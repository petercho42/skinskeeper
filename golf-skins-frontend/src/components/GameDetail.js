import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getGame, getPlayerEarnings, getHoleByHoleEarnings } from '../services/api';

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [playerEarnings, setPlayerEarnings] = useState([]);
  const [holeByHoleData, setHoleByHoleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = ['#2e7d32', '#ff6f00', '#1976d2', '#d32f2f', '#7b1fa2', '#388e3c'];

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const [gameResponse, earningsResponse, holeDataResponse] = await Promise.all([
          getGame(id),
          getPlayerEarnings(id),
          getHoleByHoleEarnings(id)
        ]);

        setGame(gameResponse.data);
        setPlayerEarnings(earningsResponse.data);
        setHoleByHoleData(holeDataResponse.data);
      } catch (err) {
        setError('Failed to fetch game data');
        console.error('Error fetching game data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !game) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">{error || 'Game not found'}</Typography>
      </Box>
    );
  }

  // Prepare chart data
  const chartData = holeByHoleData.map(hole => {
    const dataPoint = { hole: hole.hole_number };
    hole.players.forEach(player => {
      dataPoint[player.player_name] = player.running_total;
    });
    return dataPoint;
  });

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {game.name}
      </Typography>
      
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        {new Date(game.date).toLocaleDateString()}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Game Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Game Information
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Chip 
                  label={`${game.players.length} Players`} 
                  color="primary" 
                  size="small" 
                />
                <Chip 
                  label={`$${game.skin_value} per skin`} 
                  color="secondary" 
                  size="small" 
                />
                <Chip 
                  label={`${game.total_holes} holes`} 
                  variant="outlined" 
                  size="small" 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Player Earnings Summary */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Player Earnings Summary
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Player</TableCell>
                      <TableCell align="right">Winnings</TableCell>
                      <TableCell align="right">Losses</TableCell>
                      <TableCell align="right">Net Earnings</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {playerEarnings
                      .sort((a, b) => b.net_earnings - a.net_earnings)
                      .map((player) => (
                      <TableRow key={player.player_id}>
                        <TableCell>{player.player_name}</TableCell>
                        <TableCell align="right">
                          ${player.winnings.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          ${player.losses.toFixed(2)}
                        </TableCell>
                        <TableCell 
                          align="right"
                          sx={{ 
                            color: player.net_earnings >= 0 ? 'success.main' : 'error.main',
                            fontWeight: 'bold'
                          }}
                        >
                          ${player.net_earnings.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Hole-by-Hole Earnings Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Hole-by-Hole Earnings Progression
              </Typography>
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hole" 
                      label={{ value: 'Hole', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      label={{ value: 'Earnings ($)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value.toFixed(2)}`, 'Earnings']}
                      labelFormatter={(label) => `Hole ${label}`}
                    />
                    <Legend />
                    {game.players.map((player, index) => (
                      <Line
                        key={player.id}
                        type="monotone"
                        dataKey={player.name}
                        stroke={colors[index % colors.length]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Skins Details */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skins Details
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Hole</TableCell>
                      <TableCell>Par</TableCell>
                      <TableCell>Winner</TableCell>
                      <TableCell>Winning Score</TableCell>
                      <TableCell align="right">Value</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {game.holes.map((hole) => (
                      <TableRow key={hole.id}>
                        <TableCell>{hole.hole_number}</TableCell>
                        <TableCell>{hole.par}</TableCell>
                        <TableCell>
                          {hole.skin?.winner_name || 'No Winner'}
                        </TableCell>
                        <TableCell>
                          {hole.skin?.winning_score || '-'}
                        </TableCell>
                        <TableCell align="right">
                          ${hole.skin?.value || '0.00'}
                        </TableCell>
                        <TableCell>
                          {hole.skin?.is_carry_over ? (
                            <Chip label="Carry Over" size="small" color="warning" />
                          ) : hole.skin?.winner ? (
                            <Chip label="Won" size="small" color="success" />
                          ) : (
                            <Chip label="Tied" size="small" color="default" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GameDetail;