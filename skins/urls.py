from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'players', views.PlayerViewSet)
router.register(r'games', views.GameViewSet)
router.register(r'holes', views.HoleViewSet)
router.register(r'scores', views.ScoreViewSet)
router.register(r'skins', views.SkinViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]