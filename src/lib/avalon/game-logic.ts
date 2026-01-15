/**
 * 阿瓦隆桌游助手 - 游戏逻辑管理器
 */

import {
  Role,
  Faction,
  Player,
  MISSION_CONFIGS,
  MissionConfig,
  MissionState,
  MissionResult,
  GameState,
  Game,
  GamePhase,
} from './types';
import { ROLE_FACTION, BASE_ROLE_DISTRIBUTION, getAdditionalRolesForPlayerCount } from './constants';

// 工具函数：洗牌算法
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 创建游戏
 */
export function createGame(playerCount: number, additionalRoles: Role[] = []): Game {
  const config = MISSION_CONFIGS[playerCount as keyof typeof MISSION_CONFIGS];
  if (!config) {
    throw new Error(`Invalid player count: ${playerCount}. Must be one of: ${Object.keys(MISSION_CONFIGS).join(', ')}`);
  }

  // 获取基础角色
  let roles = [...BASE_ROLE_DISTRIBUTION[playerCount]];

  // 如果有额外角色，替换
  if (additionalRoles.length > 0) {
    const availableAdditional = getAdditionalRolesForPlayerCount(playerCount);
    // 只添加可用的额外角色
    const validAdditional = additionalRoles.filter(r => availableAdditional.includes(r));
    roles = [...roles, ...validAdditional];

    // 移除重复的普通角色，保持总人数
    const removeCount = roles.length - playerCount;
    const servantIndex = roles.lastIndexOf(Role.Servant);
    const minionIndex = roles.lastIndexOf(Role.Minion);
    if (removeCount > 0 && servantIndex >= 0) {
      roles.splice(servantIndex, removeCount);
    }
  }

  // 洗牌角色
  const shuffledRoles = shuffleArray(roles);

  // 创建游戏ID
  const gameId = `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // 创建初始任务状态
  const missions: MissionState[] = Array.from({ length: 5 }, (_, i) => ({
    missionNumber: i + 1,
    team: [],
    votes: new Map(),
    approved: false,
    results: new Map(),
  }));

  return {
    id: gameId,
    config,
    roles: shuffledRoles,
    players: [],
    state: {
      id: `${gameId}-state`,
      phase: GamePhase.Setup,
      currentMission: 0,
      currentLeaderId: '',
      missions,
      failedVotesInRow: 0,
      goodWins: 0,
      evilWins: 0,
    },
    createdAt: new Date(),
  };
}

/**
 * 初始化玩家（在玩家加入时调用）
 */
export function initializePlayer(game: Game, playerName: string, roleIndex: number): Player {
  const role = game.roles[roleIndex];

  return {
    id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: playerName,
    role,
    faction: ROLE_FACTION[role],
    isAlive: true,
    revealedTo: [],
  };
}

/**
 * 计算玩家视野中的其他玩家信息
 */
export function getPlayerView(player: Player, allPlayers: Player[]): {
  otherPlayers: Array<Player & { knownRole?: Role; knownFaction?: Faction }>;
  teammates?: Player[];
} {
  const otherPlayers = allPlayers
    .filter(p => p.id !== player.id)
    .map(p => ({
      ...p,
      knownRole: undefined,
      knownFaction: undefined,
    }));

  let teammates: Player[] | undefined;

  switch (player.role) {
    case Role.Merlin: {
      // 梅林可以看到所有坏人，除了莫德雷德
      otherPlayers.forEach(p => {
        if (p.faction === Faction.Evil && p.role !== Role.Mordred) {
          p.knownRole = p.role;
          p.knownFaction = Faction.Evil;
        }
      });
      break;
    }
    case Role.Percival: {
      // 帕西瓦尔知道谁是梅林
      const merlins = allPlayers.filter(p => p.role === Role.Merlin);
      otherPlayers.forEach(p => {
        if (merlins.some(m => m.id === p.id)) {
          p.knownRole = Role.Merlin;
          p.knownFaction = Faction.Good;
        }
      });
      break;
    }
    case Role.Minion:
    case Role.Assassin: {
      // 爪牙和刺客可以看到所有坏人（除了奥伯伦看不到别人，别人也看不到他）
      teammates = allPlayers.filter(p =>
        p.faction === Faction.Evil && p.id !== player.id && p.role !== Role.Oberon
      );
      otherPlayers.forEach(p => {
        if (p.faction === Faction.Evil && p.role !== Role.Oberon && p.id !== player.id) {
          p.knownRole = p.role;
          p.knownFaction = Faction.Evil;
        }
      });
      break;
    }
    case Role.Mordred: {
      // 莫德雷德可以看到所有其他坏人（除了奥伯伦）
      teammates = allPlayers.filter(p =>
        p.faction === Faction.Evil && p.id !== player.id && p.role !== Role.Oberon
      );
      otherPlayers.forEach(p => {
        if (p.faction === Faction.Evil && p.role !== Role.Oberon && p.id !== player.id) {
          p.knownRole = p.role;
          p.knownFaction = Faction.Evil;
        }
      });
      break;
    }
    case Role.Oberon: {
      // 奥伯伦看不到任何其他坏人
      break;
    }
    case Role.Servant: {
      // 普通忠臣什么都看不到
      break;
    }
  }

  return { otherPlayers, teammates };
}

/**
 * 选择任务团队
 */
export function selectTeam(game: Game, teamPlayerIds: string[]): Game {
  const mission = game.state.missions[game.state.currentMission];
  const missionSize = game.config.missionSizes[game.state.currentMission];

  if (teamPlayerIds.length !== missionSize) {
    throw new Error(`Mission ${game.state.currentMission + 1} requires exactly ${missionSize} players`);
  }

  if (!teamPlayerIds.every(id => game.players.some(p => p.id === id))) {
    throw new Error('Invalid player IDs in team selection');
  }

  const newGameState = { ...game.state };
  const newMissions = [...newGameState.missions];
  newMissions[game.state.currentMission] = {
    ...mission,
    team: teamPlayerIds,
    votes: new Map(),
    approved: false,
  };

  newGameState.missions = newMissions;
  newGameState.phase = GamePhase.Voting;

  return {
    ...game,
    state: newGameState,
  };
}

/**
 * 提交投票
 */
export function submitVote(game: Game, playerId: string, approved: boolean): Game {
  const mission = game.state.missions[game.state.currentMission];

  if (mission.votes.has(playerId)) {
    throw new Error('Player has already voted');
  }

  const newGameState = { ...game.state };
  const newMissions = [...newGameState.missions];
  const newMission = { ...mission, votes: new Map(mission.votes) };

  newMission.votes.set(playerId, approved);
  newMissions[game.state.currentMission] = newMission;

  // 检查是否所有人都投票了
  if (newMission.votes.size === game.players.length) {
    const approveCount = Array.from(newMission.votes.values()).filter(v => v).length;
    newMission.approved = approveCount > game.players.length / 2;

    if (newMission.approved) {
      newGameState.phase = GamePhase.MissionExecution;
      newGameState.failedVotesInRow = 0;
    } else {
      newGameState.failedVotesInRow += 1;
      // 检查失败投票次数，如果达到5次，坏人直接获胜
      if (newGameState.failedVotesInRow >= 5) {
        newGameState.phase = GamePhase.GameOver;
      } else {
        return advanceLeaderAndResetMission({ ...game, state: newGameState });
      }
    }
  }

  newGameState.missions = newMissions;
  return { ...game, state: newGameState };
}

/**
 * 提交任务执行结果
 */
export function submitMissionResult(game: Game, playerId: string, result: MissionResult): Game {
  const mission = game.state.missions[game.state.currentMission];
  const player = game.players.find(p => p.id === playerId);

  if (!player) {
    throw new Error('Player not found');
  }

  if (!mission.team.includes(playerId)) {
    throw new Error('Player is not in the mission team');
  }

  if (player.faction === Faction.Good && result === MissionResult.Fail) {
    throw new Error('Good players cannot fail missions');
  }

  const newGameState = { ...game.state };
  const newMissions = [...newGameState.missions];
  const newMission = { ...mission, results: new Map(mission.results) };

  newMission.results.set(playerId, result);

  // 检查是否所有任务成员都执行了
  if (newMission.results.size === mission.team.length) {
    const fails = Array.from(newMission.results.values()).filter(r => r === MissionResult.Fail).length;
    const requiredFails = game.config.requiredFails[game.state.currentMission];
    newMission.finalResult = fails >= requiredFails ? MissionResult.Fail : MissionResult.Success;

    if (newMission.finalResult === MissionResult.Fail) {
      newGameState.evilWins += 1;
    } else {
      newGameState.goodWins += 1;
    }

    // 检查游戏是否结束
    if (newGameState.goodWins >= 3 || newGameState.evilWins >= 3) {
      newGameState.phase = GamePhase.GameOver;
    } else {
      return advanceLeaderAndMission({ ...game, state: newGameState });
    }
  }

  newGameState.missions = newMissions;
  return { ...game, state: newGameState };
}

/**
 * 推进到下一个队长并重置当前任务
 */
function advanceLeaderAndResetMission(game: Game): Game {
  const newGameState = { ...game.state };
  const leaderIndex = game.players.findIndex(p => p.id === game.state.currentLeaderId);
  const nextLeaderId = game.players[(leaderIndex + 1) % game.players.length].id;

  const newMissions = [...newGameState.missions];
  newMissions[game.state.currentMission] = {
    missionNumber: game.state.currentMission + 1,
    team: [],
    votes: new Map(),
    approved: false,
    results: new Map(),
  };

  newGameState.currentLeaderId = nextLeaderId;
  newGameState.missions = newMissions;
  newGameState.phase = GamePhase.TeamSelection;

  return { ...game, state: newGameState };
}

/**
 * 推进到下一个队长和下一个任务
 */
function advanceLeaderAndMission(game: Game): Game {
  const newGameState = { ...game.state };
  const leaderIndex = game.players.findIndex(p => p.id === game.state.currentLeaderId);
  const nextLeaderId = game.players[(leaderIndex + 1) % game.players.length].id;

  newGameState.currentMission += 1;
  newGameState.currentLeaderId = nextLeaderId;
  newGameState.phase = GamePhase.TeamSelection;

  return { ...game, state: newGameState };
}

/**
 * 刺杀梅林（游戏结束时）
 */
export function assassinateMerlin(game: Game, assassinId: string, targetId: string): Game {
  const assassin = game.players.find(p => p.id === assassinId);
  const target = game.players.find(p => p.id === targetId);

  if (!assassin || assassin.role !== Role.Assassin) {
    throw new Error('Only the assassin can perform this action');
  }

  if (!target) {
    throw new Error('Target not found');
  }

  const success = target.role === Role.Merlin;
  const newGameState = { ...game.state };
  newGameState.assassinSucceed = success;
  newGameState.phase = GamePhase.GameOver;

  return { ...game, state: newGameState };
}

/**
 * 获取游戏结果
 */
export function getGameResult(game: Game): { winner: Faction; reason: string } | null {
  if (game.state.phase !== GamePhase.GameOver) {
    return null;
  }

  // 检查五次投票失败
  if (game.state.failedVotesInRow >= 5) {
    return { winner: Faction.Evil, reason: '五次团队投票失败，坏人获胜' };
  }

  // 检查任务胜负
  if (game.state.evilWins >= 3) {
    return { winner: Faction.Evil, reason: '坏人赢得3个任务任务' };
  }

  if (game.state.goodWins >= 3) {
    // 好人赢得3个任务，检查刺杀结果
    if (game.state.assassinSucceed !== undefined) {
      if (game.state.assassinSucceed) {
        return { winner: Faction.Evil, reason: '刺客成功刺杀梅林' };
      } else {
        return { winner: Faction.Good, reason: '好人赢得3个任务，且刺客没有刺中梅林' };
      }
    } else {
      return { winner: Faction.Good, reason: '好人赢得3个任务，等待刺客选择' };
    }
  }

  return null;
}
