import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Button,
  CircularProgress
} from '@mui/material';
import { getGames } from '../services/api';

const GameList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await getGames();
        setGames(response.data);
      } catch (err) {
        setError('Failed to fetch games');
        console.error('Error fetching games:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Golf Games
      </Typography>
      
      {games.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No games found. Create your first game to get started!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {games.map((game) => (
            <Grid item xs={12} sm={6} md={4} key={game.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {game.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {new Date(game.date).toLocaleDateString()}
                  </Typography>
                  
                  <Box display="flex" gap={1} mb={2}>
                    <Chip 
                      label={`${game.player_count} Players`} 
                      size="small" 
                      color="primary" 
                    />
                    <Chip 
                      label={`$${game.skin_value} per skin`} 
                      size="small" 
                      color="secondary" 
                    />
                    <Chip 
                      label={`${game.total_holes} holes`} 
                      size="small" 
                      variant="outlined" 
                    />
                  </Box>
                  
                  <Button
                    component={Link}
                    to={`/game/${game.id}`}
                    variant="contained"
                    fullWidth
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default GameList;