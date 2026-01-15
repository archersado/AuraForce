/**
 * 阿瓦隆桌游助手 - 游戏主界面
 */

'use client';

import React from 'react';
import { useAvalonStore } from '../../../lib/avalon/store';
import { GamePhase, Role, Faction } from '../../../lib/avalon/types';
import { GameOverview } from './GameOverview';
import { TeamSelectionPhase } from './TeamSelectionPhase';
import { VotingPhase } from './VotingPhase';
import { MissionExecutionPhase } from './MissionExecutionPhase';
import { GameOverPhase } from './GameOverPhase';

export function GameBoard() {
  const game = useAvalonStore(state => state.game);
  const currentPlayerId = useAvalonStore(state => state.currentPlayerId);

  if (!game) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <p>游戏未初始化</p>
      </div>
    );
  }

  const currentPlayer = game.players.find(p => p.id === currentPlayerId);
  const phase = game.state.phase;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <GameOverview game={game} currentPlayer={currentPlayer} />

        <div className="mt-6">
          {phase === GamePhase.TeamSelection && (
            <TeamSelectionPhase
              game={game}
              currentPlayer={currentPlayer}
            />
          )}
          {phase === GamePhase.Voting && (
            <VotingPhase
              game={game}
              currentPlayer={currentPlayer}
            />
          )}
          {phase === GamePhase.MissionExecution && (
            <MissionExecutionPhase
              game={game}
              currentPlayer={currentPlayer}
            />
          )}
          {phase === GamePhase.GameOver && (
            <GameOverPhase game={game} />
          )}
        </div>
      </div>
    </div>
  );
}
