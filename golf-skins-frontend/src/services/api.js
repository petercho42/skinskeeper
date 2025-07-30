import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Game endpoints
export const getGames = () => api.get('/games/');
export const getGame = (id) => api.get(`/games/${id}/`);
export const getPlayerEarnings = (gameId) => api.get(`/games/${gameId}/player_earnings/`);
export const getHoleByHoleEarnings = (gameId) => api.get(`/games/${gameId}/hole_by_hole_earnings/`);

// Player endpoints
export const getPlayers = () => api.get('/players/');
export const getPlayer = (id) => api.get(`/players/${id}/`);

// Hole endpoints
export const getHoles = () => api.get('/holes/');

// Score endpoints
export const getScores = () => api.get('/scores/');

// Skin endpoints
export const getSkins = () => api.get('/skins/');

export default api;