from rest_framework import serializers
from .models import Player, Game, Hole, Score, Skin

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'name', 'email', 'created_at']

class ScoreSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player.name', read_only=True)
    
    class Meta:
        model = Score
        fields = ['id', 'player', 'player_name', 'hole', 'strokes']

class SkinSerializer(serializers.ModelSerializer):
    winner_name = serializers.CharField(source='winner.name', read_only=True)
    hole_number = serializers.IntegerField(source='hole.hole_number', read_only=True)
    
    class Meta:
        model = Skin
        fields = ['id', 'hole', 'hole_number', 'winner', 'winner_name', 'winning_score', 'value', 'is_carry_over', 'carry_over_holes']

class HoleSerializer(serializers.ModelSerializer):
    scores = ScoreSerializer(many=True, read_only=True, source='score_set')
    skin = SkinSerializer(read_only=True)
    
    class Meta:
        model = Hole
        fields = ['id', 'hole_number', 'par', 'scores', 'skin']

class GameSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)
    holes = HoleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Game
        fields = ['id', 'name', 'date', 'players', 'skin_value', 'total_holes', 'holes', 'created_at']

class GameSummarySerializer(serializers.ModelSerializer):
    """Lightweight serializer for game list views"""
    player_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Game
        fields = ['id', 'name', 'date', 'skin_value', 'total_holes', 'player_count']
    
    def get_player_count(self, obj):
        return obj.players.count()