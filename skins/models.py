from django.db import models
from django.contrib.auth.models import User

class Player(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class Game(models.Model):
    name = models.CharField(max_length=200)
    date = models.DateField()
    players = models.ManyToManyField(Player, related_name='games')
    skin_value = models.DecimalField(max_digits=10, decimal_places=2, default=5.00)
    total_holes = models.IntegerField(default=18)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.date}"

class Hole(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='holes')
    hole_number = models.IntegerField()
    par = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['game', 'hole_number']
        ordering = ['hole_number']
    
    def __str__(self):
        return f"Hole {self.hole_number} - {self.game.name}"

class Score(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    hole = models.ForeignKey(Hole, on_delete=models.CASCADE)
    strokes = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['player', 'hole']
    
    def __str__(self):
        return f"{self.player.name} - Hole {self.hole.hole_number}: {self.strokes}"

class Skin(models.Model):
    hole = models.OneToOneField(Hole, on_delete=models.CASCADE, related_name='skin')
    winner = models.ForeignKey(Player, on_delete=models.CASCADE, null=True, blank=True)
    winning_score = models.IntegerField(null=True, blank=True)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    is_carry_over = models.BooleanField(default=False)
    carry_over_holes = models.JSONField(default=list, blank=True)  # List of hole numbers that contributed to this skin
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        winner_name = self.winner.name if self.winner else "No Winner"
        return f"Hole {self.hole.hole_number} - {winner_name} (${self.value})"
