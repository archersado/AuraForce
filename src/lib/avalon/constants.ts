/**
 * 阿瓦隆桌游助手 - 游戏常量和角色信息
 */

import { Role, RoleInfo, Faction, MISSION_CONFIGS } from './types';

// 角色名称映射
export const ROLE_NAMES: Record<Role, string> = {
  [Role.Mordred]: '莫德雷德',
  [Role.Oberon]: '奥伯伦',
  [Role.Minion]: '爪牙',
  [Role.Assassin]: '刺客',
  [Role.Merlin]: '梅林',
  [Role.Percival]: '帕西瓦尔',
  [Role.Servant]: '忠臣',
};

// 角色阵营映射
export const ROLE_FACTION: Record<Role, Faction> = {
  [Role.Mordred]: Faction.Evil,
  [Role.Oberon]: Faction.Evil,
  [Role.Minion]: Faction.Evil,
  [Role.Assassin]: Faction.Evil,
  [Role.Merlin]: Faction.Good,
  [Role.Percival]: Faction.Good,
  [Role.Servant]: Faction.Good,
};

// 角色描述
export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  [Role.Mordred]: '你是坏人阵营。梅林不知道你是坏人。',
  [Role.Oberon]: '你是坏人阵营。你看不到其他坏人，其他坏人也不知道你是坏人。',
  [Role.Minion]: '你是坏人阵营。你知道其他坏人是谁。',
  [Role.Assassin]: '你是坏人阵营。在游戏结束时，如果坏人输了，你可以尝试刺杀梅林。',
  [Role.Merlin]: '你是好人阵营。你知道所有坏人是谁，除了莫德雷德。你要小心保护好自己的身份。',
  [Role.Percival]: '你是好人阵营。你知道谁是梅林（梅林可能不止一个角色伪装）。',
  [Role.Servant]: '你是好人阵营。通过观察投票和任务结果，找到梅林支持好人。',
};

// 扩展角色信息
export const ROLE_INFOS: Record<Role, RoleInfo> = {
  [Role.Mordred]: {
    role: Role.Mordred,
    faction: Faction.Evil,
    name: ROLE_NAMES[Role.Mordred],
    description: ROLE_DESCRIPTIONS[Role.Mordred],
    minPlayers: 7,
  },
  [Role.Oberon]: {
    role: Role.Oberon,
    faction: Faction.Evil,
    name: ROLE_NAMES[Role.Oberon],
    description: ROLE_DESCRIPTIONS[Role.Oberon],
    minPlayers: 7,
  },
  [Role.Minion]: {
    role: Role.Minion,
    faction: Faction.Evil,
    name: ROLE_NAMES[Role.Minion],
    description: ROLE_DESCRIPTIONS[Role.Minion],
  },
  [Role.Assassin]: {
    role: Role.Assassin,
    faction: Faction.Evil,
    name: ROLE_NAMES[Role.Assassin],
    description: ROLE_DESCRIPTIONS[Role.Assassin],
  },
  [Role.Merlin]: {
    role: Role.Merlin,
    faction: Faction.Good,
    name: ROLE_NAMES[Role.Merlin],
    description: ROLE_DESCRIPTIONS[Role.Merlin],
  },
  [Role.Percival]: {
    role: Role.Percival,
    faction: Faction.Good,
    name: ROLE_NAMES[Role.Percival],
    description: ROLE_DESCRIPTIONS[Role.Percival],
    minPlayers: 7,
  },
  [Role.Servant]: {
    role: Role.Servant,
    faction: Faction.Good,
    name: ROLE_NAMES[Role.Servant],
    description: ROLE_DESCRIPTIONS[Role.Servant],
  },
};

// 基础角色分配规则
export const BASE_ROLE_DISTRIBUTION: Record<number, Role[]> = {
  5: [Role.Merlin, Role.Assassin, Role.Servant, Role.Servant, Role.Minion],
  6: [Role.Merlin, Role.Assassin, Role.Servant, Role.Servant, Role.Servant, Role.Minion],
  7: [Role.Merlin, Role.Assassin, Role.Percival, Role.Servant, Role.Servant, Role.Minion, Role.Minion],
  8: [Role.Merlin, Role.Assassin, Role.Percival, Role.Servant, Role.Servant, Role.Servant, Role.Minion, Role.Minion],
  9: [Role.Merlin, Role.Assassin, Role.Percival, Role.Servant, Role.Servant, Role.Servant, Role.Servant, Role.Minion, Role.Minion],
  10: [Role.Merlin, Role.Assassin, Role.Percival, Role.Servant, Role.Servant, Role.Servant, Role.Servant, Role.Minion, Role.Minion, Role.Mordred],
};

// 可选扩展角色
export const ADDITIONAL_ROLES: Role[] = [Role.Mordred, Role.Oberon, Role.Percival];

// 游戏阶段名称
export const GAME_PHASE_NAMES = {
  Setup: '游戏设置',
  TeamSelection: '选择任务团队',
  Voting: '团队投票',
  MissionExecution: '任务执行',
  GameOver: '游戏结束',
};

// 获取可用的配置
export function getAvailableConfigs() {
  return Object.keys(MISSION_CONFIGS).map(key => ({
    playerCount: parseInt(key),
    config: MISSION_CONFIGS[parseInt(key) as keyof typeof MISSION_CONFIGS],
  }));
}

// 获取指定玩家数的可选扩展角色
export function getAdditionalRolesForPlayerCount(playerCount: number): Role[] {
  const base = BASE_ROLE_DISTRIBUTION[playerCount];
  if (!base) return [];

  return ADDITIONAL_ROLES.filter(role => {
    const roleInfo = ROLE_INFOS[role];
    // 如果有最小玩家数要求，检查是否满足
    if (roleInfo.minPlayers && playerCount < roleInfo.minPlayers) {
      return false;
    }
    // 检查是否 already included
    return !base.includes(role);
  });
}

// 验证角色配置是否有效
export function validateRoleConfig(playerCount: number, customRoles: Role[]): boolean {
  const baseRoles = BASE_ROLE_DISTRIBUTION[playerCount];
  if (!baseRoles) return false;

  // 检查总人数
  if (customRoles.length !== playerCount) return false;

  // 检查必须有梅林和刺客
  if (!customRoles.includes(Role.Merlin) || !customRoles.includes(Role.Assassin)) {
    return false;
  }

  // 统计好人和坏人数量
  const goodCount = customRoles.filter(r => ROLE_FACTION[r] === Faction.Good).length;
  const evilCount = customRoles.filter(r => ROLE_FACTION[r] === Faction.Evil).length;

  // 坏人数量应该符合规则（近似1/3）
  const expectedEvilCount = Math.floor(playerCount / 3);
  if (evilCount !== expectedEvilCount) {
    return false;
  }

  return true;
}
