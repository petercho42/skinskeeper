import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Button, 
  CssBaseline,
  Box 
} from '@mui/material';
import GameList from './components/GameList';
import GameDetail from './components/GameDetail';
import PlayerStats from './components/PlayerStats';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Golf green
    },
    secondary: {
      main: '#ff6f00', // Golf orange
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Golf Skins Tracker
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Games
            </Button>
            <Button color="inherit" component={Link} to="/players">
              Players
            </Button>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<GameList />} />
            <Route path="/game/:id" element={<GameDetail />} />
            <Route path="/players" element={<PlayerStats />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
