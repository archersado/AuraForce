/**
 * 阿瓦隆桌游助手 - 主应用组件
 */

'use client';

import React, { useState } from 'react';
import { CreateGame } from './CreateGame';
import { PlayerView } from './PlayerView';
import { GameBoard } from './GameBoard';

type AppPhase = 'create' | 'role-reveal' | 'game';

export function AvalonApp() {
  const [appPhase, setAppPhase] = useState<AppPhase>('create');

  const handleGameStart = () => {
    setAppPhase('role-reveal');
  };

  const handleRolesRevealed = () => {
    setAppPhase('game');
  };

  const handleBackToCreate = () => {
    setAppPhase('create');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {appPhase === 'create' && (
        <div className="flex items-start justify-center p-4 pt-12">
          <CreateGame onStartGame={handleGameStart} />
        </div>
      )}

      {appPhase === 'role-reveal' && (
        <div className="flex items-center justify-center p-4 min-h-screen">
          <PlayerView
            onNext={handleRolesRevealed}
            isLast={true}
          />
        </div>
      )}

      {appPhase === 'game' && (
        <GameBoard />
      )}
    </div>
  );
}
