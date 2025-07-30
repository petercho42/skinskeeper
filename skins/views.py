from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Q
from .models import Player, Game, Hole, Score, Skin
from .serializers import (
    PlayerSerializer, GameSerializer, GameSummarySerializer,
    HoleSerializer, ScoreSerializer, SkinSerializer
)

class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all().prefetch_related('players', 'holes__scores', 'holes__skin')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return GameSummarySerializer
        return GameSerializer
    
    @action(detail=True, methods=['get'])
    def player_earnings(self, request, pk=None):
        """Get earnings/losses for each player in this game"""
        game = self.get_object()
        players = game.players.all()
        earnings_data = []
        
        for player in players:
            # Calculate winnings from skins
            winnings = Skin.objects.filter(
                hole__game=game,
                winner=player
            ).aggregate(total=Sum('value'))['total'] or 0
            
            # Calculate losses (total skins value divided by number of players)
            total_skins_value = Skin.objects.filter(
                hole__game=game
            ).aggregate(total=Sum('value'))['total'] or 0
            
            player_count = game.players.count()
            losses = total_skins_value / player_count if player_count > 0 else 0
            
            net_earnings = float(winnings) - float(losses)
            
            earnings_data.append({
                'player_id': player.id,
                'player_name': player.name,
                'winnings': float(winnings),
                'losses': float(losses),
                'net_earnings': net_earnings
            })
        
        return Response(earnings_data)
    
    @action(detail=True, methods=['get'])
    def hole_by_hole_earnings(self, request, pk=None):
        """Get hole-by-hole earnings progression for each player"""
        game = self.get_object()
        players = game.players.all()
        holes = game.holes.all().order_by('hole_number')
        
        # Initialize running totals for each player
        running_totals = {player.id: 0 for player in players}
        hole_data = []
        
        for hole in holes:
            hole_info = {
                'hole_number': hole.hole_number,
                'par': hole.par,
                'players': []
            }
            
            # Calculate earnings change for this hole
            try:
                skin = hole.skin
                if skin.winner:
                    # Winner gets the skin value
                    running_totals[skin.winner.id] += float(skin.value)
                
                # All players lose their share
                player_count = game.players.count()
                loss_per_player = float(skin.value) / player_count if player_count > 0 else 0
                for player in players:
                    running_totals[player.id] -= loss_per_player
                    
            except Skin.DoesNotExist:
                # No skin for this hole
                pass
            
            # Add current running totals for all players
            for player in players:
                hole_info['players'].append({
                    'player_id': player.id,
                    'player_name': player.name,
                    'running_total': running_totals[player.id]
                })
            
            hole_data.append(hole_info)
        
        return Response(hole_data)

class HoleViewSet(viewsets.ModelViewSet):
    queryset = Hole.objects.all()
    serializer_class = HoleSerializer

class ScoreViewSet(viewsets.ModelViewSet):
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer

class SkinViewSet(viewsets.ModelViewSet):
    queryset = Skin.objects.all()
    serializer_class = SkinSerializer
