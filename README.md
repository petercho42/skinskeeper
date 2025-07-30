# Golf Skins App

A web application for tracking golf skins games, showing player earnings/losses and hole-by-hole progression.

## Features

- **Player Management**: Track multiple players and their information
- **Game Tracking**: Create and manage golf games with customizable skin values
- **Skins Calculation**: Automatic calculation of skin winners and carry-overs
- **Earnings Dashboard**: View player earnings/losses with detailed breakdowns
- **Hole-by-Hole Chart**: Interactive line chart showing earnings progression throughout the game
- **Game Details**: Comprehensive view of each hole, scores, and skin results

## Technology Stack

### Backend (Django)
- Django 5.2.4
- Django REST Framework
- SQLite database
- CORS headers for frontend integration

### Frontend (React)
- React 18
- Material-UI for components and styling
- Recharts for data visualization
- Axios for API communication
- React Router for navigation

## Getting Started

### Backend Setup

1. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install django djangorestframework django-cors-headers
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Create sample data:
```bash
python manage.py create_sample_data
```

5. Start the Django server:
```bash
python manage.py runserver 0.0.0.0:8000
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd golf-skins-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api

## API Endpoints

- `GET /api/games/` - List all games
- `GET /api/games/{id}/` - Get game details
- `GET /api/games/{id}/player_earnings/` - Get player earnings for a game
- `GET /api/games/{id}/hole_by_hole_earnings/` - Get hole-by-hole earnings progression
- `GET /api/players/` - List all players
- `GET /api/holes/` - List all holes
- `GET /api/scores/` - List all scores
- `GET /api/skins/` - List all skins

## How Golf Skins Work

In a skins game:
1. Each hole has a predetermined value (skin)
2. The player with the lowest score on a hole wins the skin
3. If players tie for the lowest score, the skin carries over to the next hole
4. Carried-over skins accumulate value until someone wins
5. All players contribute equally to the total pot, winners take skins

## Sample Data

The app includes sample data with:
- 4 players: John Smith, Mike Johnson, David Wilson, Chris Brown
- 1 complete 18-hole game with realistic scores
- Calculated skins with winners and carry-overs
- Earnings/losses for each player

## Development

To extend the application:
1. Add new Django models in `skins/models.py`
2. Create corresponding serializers in `skins/serializers.py`
3. Add API views in `skins/views.py`
4. Create React components in `golf-skins-frontend/src/components/`
5. Update API service in `golf-skins-frontend/src/services/api.js`

## License

This project is licensed under the MIT License.