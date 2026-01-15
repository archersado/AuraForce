/**
 * 阿瓦隆桌游助手 - 创建游戏界面
 */

'use client';

import React, { useState } from 'react';
import { Role } from '../../../lib/avalon/types';
import { getAvailableConfigs, getAdditionalRolesForPlayerCount, ROLE_NAMES, ROLE_INFOS } from '../../../lib/avalon/constants';
import { useAvalonStore } from '../../../lib/avalon/store';

interface CreateGameProps {
  onStartGame?: () => void;
}

export function CreateGame({ onStartGame }: CreateGameProps) {
  const [playerCount, setPlayerCount] = useState(5);
  const [playerNames, setPlayerNames] = useState<string[]>(['玩家1', '玩家2', '玩家3', '玩家4', '玩家5']);
  const [additionalRoles, setAdditionalRoles] = useState<Role[]>([]);

  const availableConfigs = getAvailableConfigs();
  const availableAdditionalRoles = getAdditionalRolesForPlayerCount(playerCount);

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    // 更新玩家名单
    const newNames = Array.from({ length: count }, (_, i) =>
      playerNames[i] || `玩家${i + 1}`
    );
    setPlayerNames(newNames);

    // 移除不可用的额外角色
    const validRoles = additionalRoles.filter(r =>
      getAdditionalRolesForPlayerCount(count).includes(r)
    );
    setAdditionalRoles(validRoles);
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const toggleAdditionalRole = (role: Role) => {
    if (additionalRoles.includes(role)) {
      setAdditionalRoles(additionalRoles.filter(r => r !== role));
    } else {
      setAdditionalRoles([...additionalRoles, role]);
    }
  };

  const handleStartGame = () => {
    const initGame = useAvalonStore.getState().initGame;
    try {
      initGame(playerCount, additionalRoles, playerNames);
      onStartGame?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : '创建游戏失败');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">
        阿瓦隆 Avalon
      </h1>

      {/* 玩家人数选择 */}
      <div className="mb-8">
        <label className="block text-lg font-semibold mb-3">选择玩家人数</label>
        <div className="flex flex-wrap gap-3">
          {availableConfigs.map(({ playerCount: count }) => (
            <button
              key={count}
              onClick={() => handlePlayerCountChange(count)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                playerCount === count
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {count} 人
            </button>
          ))}
        </div>
      </div>

      {/* 玩家名称设置 */}
      <div className="mb-8">
        <label className="block text-lg font-semibold mb-3">设置玩家名称</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {playerNames.map((name, index) => (
            <input
              key={index}
              type="text"
              value={name}
              onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`玩家 ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 额外角色选择 */}
      {availableAdditionalRoles.length > 0 && (
        <div className="mb-8">
          <label className="block text-lg font-semibold mb-3">额外角色（可选）</label>
          <div className="space-y-3">
            {availableAdditionalRoles.map((role) => {
              const info = ROLE_INFOS[role];
              return (
                <label
                  key={role}
                  className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={additionalRoles.includes(role)}
                    onChange={() => toggleAdditionalRole(role)}
                    className="mt-1 mr-3 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-semibold">{info.name}</div>
                    <div className="text-sm text-gray-600">{info.description}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 开始游戏按钮 */}
      <button
        onClick={handleStartGame}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        开始游戏
      </button>

      {/* 游戏规则提示 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
        <p className="font-semibold mb-2">游戏规则概要：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>好人目标：完成3个任务，或让好人完成任务且刺客没刺中梅林</li>
          <li>坏人目标：破坏3个任务，或五次团队投票失败，或在结束时刺中梅林</li>
          <li>梅林知道坏人（除了莫德雷德），但要小心暴露</li>
          <li>每个任务由队长选择团队，全员投票决定是否通过</li>
        </ul>
      </div>
    </div>
  );
}
