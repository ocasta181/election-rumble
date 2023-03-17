// pages/game.tsx
import React from 'react';
import Game from '../components/game';

const GamePage: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <h1 style={{ textAlign: 'center' }}>Election Rumble</h1>
      <Game />
    </div>
  );
};

export default GamePage;