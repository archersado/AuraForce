/**
 * 阿瓦隆桌游助手 - 角色查看界面
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAvalonStore } from '../../../lib/avalon/store';
import { ROLE_NAMES, ROLE_FACTION, ROLE_DESCRIPTIONS } from '../../../lib/avalon/constants';
import { Faction } from '../../../lib/avalon/types';

interface PlayerViewProps {
  onNext: () => void;
  isLast: boolean;
}

export function PlayerView({ onNext, isLast }: PlayerViewProps) {
  const game = useAvalonStore(state => state.game);
  const currentPlayerId = useAvalonStore(state => state.currentPlayerId);
  const joinAsPlayer = useAvalonStore(state => state.joinAsPlayer);
  const getPlayerView = useAvalonStore(state => state.getPlayerView);

  const [viewingIndex, setViewingIndex] = useState(0);
  const [viewedPlayers, setViewedPlayers] = useState<Set<string>>(new Set());

  const currentPlayer = game?.players[viewingIndex];
  const playerView = currentPlayer && getPlayerView();

  useEffect(() => {
    if (currentPlayer && !viewedPlayers.has(currentPlayer.id)) {
      joinAsPlayer(currentPlayer.id);
      setViewedPlayers(prev => new Set([...prev, currentPlayer.id]));
    }
  }, [currentPlayer, joinAsPlayer, viewedPlayers]);

  const handleNextPlayer = () => {
    if (!game) return;

    if (viewingIndex < game.players.length - 1) {
      setViewingIndex(prev => prev + 1);
    } else {
      onNext();
    }
  };

  const getFactionColor = (faction: Faction) => {
    return faction === Faction.Good
      ? 'bg-blue-100 border-blue-500 text-blue-900'
      : 'bg-red-100 border-red-500 text-red-900';
  };

  const getFactionIcon = (faction: Faction) => {
    return faction === Faction.Good ? '👑' : '🔥';
  };

  if (!currentPlayer || !playerView) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <div className="text-sm text-gray-500 mb-2">
          玩家 {viewingIndex + 1} / {game?.players.length}
        </div>
        <h2 className="text-2xl font-bold">{currentPlayer.name}</h2>
        <p className="text-sm text-gray-500">请将设备传递给该玩家查看角色</p>
      </div>

      {/* 角色卡片 */}
      <div className={`border-2 rounded-xl p-6 ${getFactionColor(currentPlayer.faction)} mb-6`}>
        <div className="text-center">
          <div className="text-4xl mb-2">{getFactionIcon(currentPlayer.faction)}</div>
          <div className="text-lg font-semibold mb-1">{ROLE_NAMES[currentPlayer.role]}</div>
          <div className="text-sm opacity-80">
            {currentPlayer.faction === Faction.Good ? '好人阵营' : '坏人阵营'}
          </div>
        </div>
        <div className="mt-4 p-3 bg-white bg-opacity-50 rounded-lg">
          <p className="text-sm">{ROLE_DESCRIPTIONS[currentPlayer.role]}</p>
        </div>
      </div>

      {/* 特殊信息 */}
      {playerView.teammates && playerView.teammates.length > 0 && (
        <div className={`border rounded-lg p-4 mb-6 ${
          currentPlayer.faction === Faction.Good ? 'bg-blue-50' : 'bg-red-50'
        }`}>
          <div className="font-semibold mb-2">
            你可以看到的其他{' '}
            {currentPlayer.faction === Faction.Good ? '梅林' : '坏人'}：
          </div>
          <div className="flex flex-wrap gap-2">
            {playerView.teammates.map(teammate => (
              <span
                key={teammate.id}
                className="px-3 py-1 bg-white rounded-full text-sm font-medium"
              >
                {teammate.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 奥伯伦特殊提示 */}
      {currentPlayer.role === 'Oberon' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="font-semibold text-red-800 mb-2">警告</div>
          <p className="text-sm text-red-700">
            你是奥伯伦，你看不到其他坏人，其他坏人也看不到你。你需要通过观察找出谁是你的同伙。
          </p>
        </div>
      )}

      {/* 提示其他玩家不要偷看 */}
      <div className="bg-gray-100 rounded-lg p-3 mb-6 text-center">
        <p className="text-sm text-gray-600">
          记住角色后，请将设备传递给下一位玩家
        </p>
      </div>

      {/* 下一步按钮 */}
      <button
        onClick={handleNextPlayer}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        {isLast && viewingIndex === (game?.players.length || 1) - 1 ? '开始游戏' : '确认并传递'}
      </button>
    </div>
  );
}
