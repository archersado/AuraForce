/**
 * AuraForce 技能提取对话引擎
 *
 * 功能：通过情景式对话提取用户的专业技能和工作模式
 * 特性：多轮对话管理、智能追问、技能模式识别
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * 技能提取会话状态
 */
interface ExtractionSession {
  id: string;
  userId: string;
  scenario: string;
  currentStep: number;
  conversationHistory: ConversationTurn[];
  extractedSkills: ExtractedSkill[];
  userProfile: UserProfile;
  status: 'init' | 'extracting' | 'completed' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 对话轮次
 */
interface ConversationTurn {
  id: string;
  type: 'system' | 'assistant' | 'user';
  message: string;
  timestamp: Date;
  metadata?: {
    extractedInfo?: ExtractedSkill[];
    skillHints?: string[];
    nextQuestionType?: 'clarification' | 'deep_dive' | 'validation';
  };
}

/**
 * 提取的技能信息
 */
interface ExtractedSkill {
  id: string;
  name: string;
  category: 'workflow' | 'tool_usage' | 'decision_making' | 'quality_control';
  description: string;
  steps: SkillStep[];
  tools: string[];
  inputs: string[];
  outputs: string[];
  qualityGates: string[];
  confidence: number; // 0-1, 提取置信度
  sourceContext: string; // 来源对话上下文
}

/**
 * 技能步骤
 */
interface SkillStep {
  order: number;
  name: string;
  description: string;
  action: string;
  condition?: string;
  tools?: string[];
  duration?: string;
}

/**
 * 用户画像
 */
interface UserProfile {
  role: string;
  experience: string;
  industry: string;
  workStyle: string[];
  preferredTools: string[];
  painPoints: string[];
}

/**
 * 技能模式
 */
interface SkillPattern {
  trigger: string[];
  skillType: string;
  followUpQuestions: string[];
}

/**
 * 检测到的技能模式
 */
interface DetectedPattern {
  skillType: string;
  confidence: number;
  matchedKeywords: string[];
}

/**
 * 技能提取引擎主类
 */
class SkillExtractor {
  private sessions: Map<string, ExtractionSession> = new Map();

  /**
   * 营销场景模板
   */
  private marketingScenarios: Record<string, {
    name: string;
    description: string;
    initialPrompt: string;
    guidingQuestions: string[];
    skillPatterns: SkillPattern[];
  }> = {
    campaign_creation: {
      name: "营销Campaign创建",
      description: "为新产品创建完整的营销活动",
      initialPrompt: "恭喜！你刚被任命为某知名品牌的营销总监！第一个任务：为公司的新产品设计一个完整的营销campaign。老板给了你充分的预算和资源，你会怎么开始？",
      guidingQuestions: [
        "你通常是从哪个环节开始策划campaign的？",
        "在制定营销策略时，你最看重哪些因素？",
        "你是如何进行竞品分析的？用什么工具，关注哪些维度？",
        "创意灵感通常从哪里来？你有什么独特的方法吗？",
        "如何确保campaign的质量？你有哪些检验标准？",
        "投放前你会做哪些准备工作？",
        "如何优化campaign的表现？你关注哪些数据指标？"
      ],
      skillPatterns: [
        {
          trigger: ["竞品", "分析", "对比", "研究"],
          skillType: "competitive_analysis",
          followUpQuestions: [
            "你通常分析竞品的哪些维度？",
            "用什么工具收集竞品信息？",
            "如何整理和分析收集到的数据？"
          ]
        },
        {
          trigger: ["创意", "灵感", "想法", "头脑风暴"],
          skillType: "creative_ideation",
          followUpQuestions: [
            "你的创意流程是什么样的？",
            "如何评估创意的可行性？",
            "团队协作时如何激发更多创意？"
          ]
        },
        {
          trigger: ["投放", "渠道", "媒体", "推广"],
          skillType: "channel_strategy",
          followUpQuestions: [
            "如何选择合适的投放渠道？",
            "不同渠道的内容如何适配？",
            "如何分配预算到各个渠道？"
          ]
        }
      ]
    }
  };

  /**
   * 创建新的技能提取会话
   */
  async createSession(userId: string, scenario: string = 'campaign_creation'): Promise<string> {
    const sessionId = uuidv4();
    const scenarioConfig = this.marketingScenarios[scenario];

    const session: ExtractionSession = {
      id: sessionId,
      userId,
      scenario,
      currentStep: 0,
      conversationHistory: [],
      extractedSkills: [],
      userProfile: {
        role: '',
        experience: '',
        industry: '',
        workStyle: [],
        preferredTools: [],
        painPoints: []
      },
      status: 'init',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 添加初始系统消息
    this.addConversationTurn(session, 'system',
      `开始技能提取会话，场景：${scenarioConfig.name}`);

    // 添加欢迎消息
    this.addConversationTurn(session, 'assistant',
      `🎯 ${scenarioConfig.initialPrompt}`);

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  /**
   * 处理用户输入并生成响应
   */
  async processUserInput(sessionId: string, userMessage: string): Promise<{
    response: string;
    extractedInfo?: any;
    skillUpdates?: ExtractedSkill[];
    sessionComplete?: boolean;
  }> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    // 添加用户消息到对话历史
    this.addConversationTurn(session, 'user', userMessage);

    // 分析用户输入，提取技能信息
    const analysisResult = await this.analyzeUserInput(session, userMessage);

    // 更新提取的技能
    if (analysisResult.extractedSkills) {
      session.extractedSkills.push(...analysisResult.extractedSkills);
    }

    // 更新用户画像
    if (analysisResult.profileUpdates) {
      this.updateUserProfile(session, analysisResult.profileUpdates);
    }

    // 生成下一个问题或响应
    const nextResponse = await this.generateNextQuestion(session, analysisResult);

    // 添加AI响应到对话历史
    this.addConversationTurn(session, 'assistant', nextResponse.message, {
      extractedInfo: analysisResult.extractedInfo,
      skillHints: analysisResult.skillHints,
      nextQuestionType: nextResponse.questionType
    });

    // 更新会话状态
    session.currentStep++;
    session.updatedAt = new Date();

    // 检查是否完成提取
    const isComplete = this.checkExtractionComplete(session);
    if (isComplete) {
      session.status = 'completed';
    }

    return {
      response: nextResponse.message,
      extractedInfo: analysisResult.extractedInfo,
      skillUpdates: analysisResult.extractedSkills,
      sessionComplete: isComplete
    };
  }

  /**
   * 分析用户输入，提取技能信息
   */
  private async analyzeUserInput(session: ExtractionSession, userMessage: string): Promise<{
    extractedInfo: any;
    extractedSkills?: ExtractedSkill[];
    profileUpdates?: Partial<UserProfile>;
    skillHints?: string[];
  }> {
    const scenarioConfig = this.marketingScenarios[session.scenario];

    // 关键词匹配和模式识别
    const detectedPatterns = this.detectSkillPatterns(userMessage, scenarioConfig.skillPatterns);

    // 从对话中提取工作流步骤
    const workflowSteps = this.extractWorkflowSteps(userMessage);

    // 提取工具使用信息
    const toolUsage = this.extractToolUsage(userMessage);

    // 提取决策逻辑
    const decisionPatterns = this.extractDecisionPatterns(userMessage);

    const extractedSkills: ExtractedSkill[] = [];

    // 基于检测到的模式创建技能对象
    for (const pattern of detectedPatterns) {
      const skill: ExtractedSkill = {
        id: uuidv4(),
        name: pattern.skillType,
        category: this.categorizeSkill(pattern.skillType),
        description: `从对话中提取的${pattern.skillType}技能`,
        steps: workflowSteps,
        tools: toolUsage,
        inputs: [],
        outputs: [],
        qualityGates: [],
        confidence: pattern.confidence,
        sourceContext: userMessage
      };
      extractedSkills.push(skill);
    }

    return {
      extractedInfo: {
        detectedPatterns,
        workflowSteps,
        toolUsage,
        decisionPatterns
      },
      extractedSkills: extractedSkills.length > 0 ? extractedSkills : undefined,
      skillHints: detectedPatterns.map(p => p.skillType)
    };
  }

  /**
   * 检测技能模式
   */
  private detectSkillPatterns(message: string, patterns: SkillPattern[]): DetectedPattern[] {
    const detected: DetectedPattern[] = [];
    const lowerMessage = message.toLowerCase();

    for (const pattern of patterns) {
      const matchCount = pattern.trigger.filter((keyword: string) =>
        lowerMessage.includes(keyword.toLowerCase())
      ).length;

      if (matchCount > 0) {
        detected.push({
          skillType: pattern.skillType,
          confidence: matchCount / pattern.trigger.length,
          matchedKeywords: pattern.trigger.filter(keyword =>
            lowerMessage.includes(keyword.toLowerCase())
          )
        });
      }
    }

    return detected;
  }

  /**
   * 提取工作流步骤
   */
  private extractWorkflowSteps(message: string): SkillStep[] {
    const steps: SkillStep[] = [];
    const stepIndicators = [
      '首先', '然后', '接下来', '最后', '第一步', '第二步', '先', '再', '最终'
    ];

    // 简单的步骤提取逻辑
    const sentences = message.split(/[。！？;\n]/);
    let stepOrder = 1;

    for (const sentence of sentences) {
      if (sentence.trim().length > 5) {
        const hasStepIndicator = stepIndicators.some(indicator =>
          sentence.includes(indicator)
        );

        if (hasStepIndicator || stepOrder === 1) {
          steps.push({
            order: stepOrder++,
            name: `步骤${stepOrder - 1}`,
            description: sentence.trim(),
            action: sentence.trim()
          });
        }
      }
    }

    return steps;
  }

  /**
   * 提取工具使用信息
   */
  private extractToolUsage(message: string): string[] {
    const commonTools = [
      '小红书', '抖音', 'TikTok', 'WeChat', '微信', 'Figma', 'Canva',
      'Adobe', 'Excel', 'PPT', 'PowerPoint', 'Google', 'Analytics',
      'Photoshop', 'Premier', 'AfterEffects', 'Sketch', '石墨文档',
      '腾讯文档', 'Notion', 'Airtable', 'Slack', '钉钉', '飞书'
    ];

    return commonTools.filter(tool =>
      message.toLowerCase().includes(tool.toLowerCase())
    );
  }

  /**
   * 提取决策模式
   */
  private extractDecisionPatterns(message: string): string[] {
    const decisionIndicators = [
      '如果', '当', '根据', '判断', '评估', '选择', '决定', '考虑',
      '标准', '原则', '要求', '条件'
    ];

    const patterns = [];
    for (const indicator of decisionIndicators) {
      if (message.includes(indicator)) {
        patterns.push(`决策模式：包含${indicator}的判断逻辑`);
      }
    }

    return patterns;
  }

  /**
   * 技能分类
   */
  private categorizeSkill(skillType: string): 'workflow' | 'tool_usage' | 'decision_making' | 'quality_control' {
    const categories: Record<string, 'workflow' | 'tool_usage' | 'decision_making' | 'quality_control'> = {
      'competitive_analysis': 'workflow',
      'creative_ideation': 'workflow',
      'channel_strategy': 'decision_making',
      'content_creation': 'workflow',
      'data_analysis': 'tool_usage',
      'quality_review': 'quality_control'
    };

    return categories[skillType] || 'workflow';
  }

  /**
   * 生成下一个问题
   */
  private async generateNextQuestion(session: ExtractionSession, analysisResult: {
    extractedInfo: {
      detectedPatterns?: DetectedPattern[];
      [key: string]: any;
    };
    [key: string]: any;
  }): Promise<{
    message: string;
    questionType: 'clarification' | 'deep_dive' | 'validation' | 'completion';
  }> {
    const scenarioConfig = this.marketingScenarios[session.scenario];
    const currentStep = session.currentStep;

    // 如果检测到了特定技能模式，进行深度挖掘
    if (analysisResult.extractedInfo.detectedPatterns && analysisResult.extractedInfo.detectedPatterns.length > 0) {
      const pattern = analysisResult.extractedInfo.detectedPatterns[0];
      const skillPattern = scenarioConfig.skillPatterns.find((p: SkillPattern) => p.skillType === pattern.skillType);

      if (skillPattern && skillPattern.followUpQuestions.length > 0) {
        const randomQuestion = skillPattern.followUpQuestions[
          Math.floor(Math.random() * skillPattern.followUpQuestions.length)
        ];

        return {
          message: `💡 很有意思！${randomQuestion}`,
          questionType: 'deep_dive'
        };
      }
    }

    // 使用预设的引导问题
    if (currentStep < scenarioConfig.guidingQuestions.length) {
      return {
        message: `🎯 ${scenarioConfig.guidingQuestions[currentStep]}`,
        questionType: 'clarification'
      };
    }

    // 会话即将结束，进行总结验证
    if (currentStep >= scenarioConfig.guidingQuestions.length) {
      return {
        message: `🌟 太棒了！我已经了解了你的工作方式。让我总结一下提取到的技能：\n\n${this.generateSkillSummary(session)}\n\n这些技能描述准确吗？还有什么需要补充或修正的吗？`,
        questionType: 'validation'
      };
    }

    return {
      message: "还有其他想分享的工作经验吗？",
      questionType: 'completion'
    };
  }

  /**
   * 生成技能总结
   */
  private generateSkillSummary(session: ExtractionSession): string {
    const skills = session.extractedSkills;
    if (skills.length === 0) {
      return "暂未识别到具体的技能模式。";
    }

    return skills.map((skill, index) =>
      `${index + 1}. **${skill.name}**：${skill.description}\n   - 工具：${skill.tools.join(', ') || '无'}\n   - 步骤：${skill.steps.length}个`
    ).join('\n\n');
  }

  /**
   * 检查技能提取是否完成
   */
  private checkExtractionComplete(session: ExtractionSession): boolean {
    // 简单的完成条件：超过10轮对话或提取到足够技能
    return session.currentStep >= 10 || session.extractedSkills.length >= 3;
  }

  /**
   * 添加对话轮次
   */
  private addConversationTurn(
    session: ExtractionSession,
    type: 'system' | 'assistant' | 'user',
    message: string,
    metadata?: any
  ): void {
    const turn: ConversationTurn = {
      id: uuidv4(),
      type,
      message,
      timestamp: new Date(),
      metadata
    };

    session.conversationHistory.push(turn);
  }

  /**
   * 更新用户画像
   */
  private updateUserProfile(session: ExtractionSession, updates: Partial<UserProfile>): void {
    Object.assign(session.userProfile, updates);
  }

  /**
   * 获取会话信息
   */
  getSession(sessionId: string): ExtractionSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * 获取提取的技能
   */
  getExtractedSkills(sessionId: string): ExtractedSkill[] {
    const session = this.sessions.get(sessionId);
    return session ? session.extractedSkills : [];
  }
}

export default SkillExtractor;
export type { ExtractionSession, ExtractedSkill, ConversationTurn, UserProfile };