import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const PhaserComponent = dynamic(
  () => import('./PhaserComponent'),
  { ssr: false }
);

const Game: React.FC = () => {
  return <PhaserComponent />;
};

export default Game;
