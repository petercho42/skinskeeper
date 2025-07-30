from django.core.management.base import BaseCommand
from django.utils import timezone
from skins.models import Player, Game, Hole, Score, Skin
from datetime import date
import random

class Command(BaseCommand):
    help = 'Create sample data for the golf skins app'

    def handle(self, *args, **options):
        # Create players
        players_data = [
            {'name': 'John Smith', 'email': 'john@example.com'},
            {'name': 'Mike Johnson', 'email': 'mike@example.com'},
            {'name': 'David Wilson', 'email': 'david@example.com'},
            {'name': 'Chris Brown', 'email': 'chris@example.com'},
        ]
        
        players = []
        for player_data in players_data:
            player, created = Player.objects.get_or_create(
                name=player_data['name'],
                defaults={'email': player_data['email']}
            )
            players.append(player)
            if created:
                self.stdout.write(f'Created player: {player.name}')

        # Create a sample game
        game, created = Game.objects.get_or_create(
            name='Sunday Morning Round',
            date=date.today(),
            defaults={'skin_value': 5.00, 'total_holes': 18}
        )
        
        if created:
            self.stdout.write(f'Created game: {game.name}')
            # Add players to the game
            game.players.set(players)

        # Create holes with sample scores and skins
        holes_data = [
            {'hole_number': 1, 'par': 4},
            {'hole_number': 2, 'par': 3},
            {'hole_number': 3, 'par': 5},
            {'hole_number': 4, 'par': 4},
            {'hole_number': 5, 'par': 3},
            {'hole_number': 6, 'par': 4},
            {'hole_number': 7, 'par': 5},
            {'hole_number': 8, 'par': 4},
            {'hole_number': 9, 'par': 3},
            {'hole_number': 10, 'par': 4},
            {'hole_number': 11, 'par': 4},
            {'hole_number': 12, 'par': 3},
            {'hole_number': 13, 'par': 5},
            {'hole_number': 14, 'par': 4},
            {'hole_number': 15, 'par': 3},
            {'hole_number': 16, 'par': 4},
            {'hole_number': 17, 'par': 5},
            {'hole_number': 18, 'par': 4},
        ]

        for hole_data in holes_data:
            hole, created = Hole.objects.get_or_create(
                game=game,
                hole_number=hole_data['hole_number'],
                defaults={'par': hole_data['par']}
            )
            
            if created:
                self.stdout.write(f'Created hole {hole.hole_number}')
                
                # Create sample scores for each player
                scores = []
                for player in players:
                    # Generate realistic scores (par +/- 2)
                    par = hole_data['par']
                    score_options = [par-1, par, par, par+1, par+2]  # Weighted towards par
                    strokes = random.choice(score_options)
                    
                    score, _ = Score.objects.get_or_create(
                        player=player,
                        hole=hole,
                        defaults={'strokes': strokes}
                    )
                    scores.append((player, strokes))
                
                # Determine skin winner (lowest score)
                min_strokes = min([s[1] for s in scores])
                winners = [s[0] for s in scores if s[1] == min_strokes]
                
                # Create skin
                if len(winners) == 1:
                    # Single winner
                    winner = winners[0]
                    skin_value = float(game.skin_value)
                    carry_over = False
                    carry_over_holes = []
                else:
                    # Tie - no winner, carry over
                    winner = None
                    skin_value = float(game.skin_value)
                    carry_over = True
                    carry_over_holes = [hole_data['hole_number']]
                
                # If this is a carry over from previous holes, add accumulated value
                previous_carry_overs = Skin.objects.filter(
                    hole__game=game,
                    hole__hole_number__lt=hole_data['hole_number'],
                    winner__isnull=True
                )
                
                for carry_over_skin in previous_carry_overs:
                    skin_value += float(carry_over_skin.value)
                    carry_over_holes.extend(carry_over_skin.carry_over_holes)
                
                skin, _ = Skin.objects.get_or_create(
                    hole=hole,
                    defaults={
                        'winner': winner,
                        'winning_score': min_strokes if winner else None,
                        'value': skin_value,
                        'is_carry_over': carry_over,
                        'carry_over_holes': carry_over_holes
                    }
                )

        self.stdout.write(
            self.style.SUCCESS('Successfully created sample data!')
        )