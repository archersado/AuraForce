/**
 * 技能雷达图组件
 *
 * 功能：以雷达图形式可视化展示用户的技能分布和强度
 */

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ExtractedSkill {
  id: string;
  name: string;
  category: 'workflow' | 'tool_usage' | 'decision_making' | 'quality_control';
  description: string;
  confidence: number;
  tools: string[];
  steps: any[];
}

interface SkillRadarProps {
  skills: ExtractedSkill[];
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

/**
 * 技能雷达图主组件
 */
export default function SkillRadar({
  skills,
  size = 'medium',
  animated = true
}: SkillRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 尺寸配置
  const sizeConfig = {
    small: { width: 200, height: 200, radius: 80 },
    medium: { width: 300, height: 300, radius: 120 },
    large: { width: 400, height: 400, radius: 160 }
  };

  const config = sizeConfig[size];

  // 技能分类映射
  const skillCategories = {
    workflow: { name: '工作流程', color: '#8B5CF6', angle: 0 },
    tool_usage: { name: '工具使用', color: '#3B82F6', angle: Math.PI / 2 },
    decision_making: { name: '决策制定', color: '#10B981', angle: Math.PI },
    quality_control: { name: '质量控制', color: '#F59E0B', angle: 3 * Math.PI / 2 }
  };

  // 计算每个分类的平均技能强度
  const calculateCategoryStrength = (category: string): number => {
    const categorySkills = skills.filter(skill => skill.category === category);
    if (categorySkills.length === 0) return 0;

    const avgConfidence = categorySkills.reduce((sum, skill) => sum + skill.confidence, 0) / categorySkills.length;
    const stepComplexity = categorySkills.reduce((sum, skill) => sum + skill.steps.length, 0) / categorySkills.length;
    const toolDiversity = categorySkills.reduce((sum, skill) => sum + skill.tools.length, 0) / categorySkills.length;

    // 综合计算强度 (0-1)
    return Math.min((avgConfidence * 0.5 + stepComplexity * 0.02 + toolDiversity * 0.05), 1);
  };

  // 绘制雷达图
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布
    const dpr = window.devicePixelRatio || 1;
    canvas.width = config.width * dpr;
    canvas.height = config.height * dpr;
    canvas.style.width = config.width + 'px';
    canvas.style.height = config.height + 'px';
    ctx.scale(dpr, dpr);

    const centerX = config.width / 2;
    const centerY = config.height / 2;
    const radius = config.radius;

    // 清空画布
    ctx.clearRect(0, 0, config.width, config.height);

    // 绘制背景网格
    drawRadarGrid(ctx, centerX, centerY, radius);

    // 绘制技能数据
    if (skills.length > 0) {
      drawSkillData(ctx, centerX, centerY, radius);
    }

    // 绘制分类标签
    drawCategoryLabels(ctx, centerX, centerY, radius);

  }, [skills, config]);

  /**
   * 绘制雷达网格背景
   */
  const drawRadarGrid = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;

    // 绘制同心圆
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // 绘制分类轴线
    Object.values(skillCategories).forEach(category => {
      const x = centerX + Math.cos(category.angle) * radius;
      const y = centerY + Math.sin(category.angle) * radius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    });
  };

  /**
   * 绘制技能数据
   */
  const drawSkillData = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
    const points: Array<{x: number, y: number, strength: number}> = [];

    // 计算每个分类的数据点
    Object.entries(skillCategories).forEach(([categoryKey, category]) => {
      const strength = calculateCategoryStrength(categoryKey);
      const distance = radius * strength;
      const x = centerX + Math.cos(category.angle) * distance;
      const y = centerY + Math.sin(category.angle) * distance;

      points.push({ x, y, strength });
    });

    // 绘制技能区域填充
    if (points.length > 0) {
      ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // 绘制数据点
    points.forEach((point, index) => {
      const category = Object.values(skillCategories)[index];

      ctx.fillStyle = category.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fill();

      // 强度标签
      if (point.strength > 0.1) {
        ctx.fillStyle = '#374151';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          Math.round(point.strength * 100) + '%',
          point.x,
          point.y - 8
        );
      }
    });
  };

  /**
   * 绘制分类标签
   */
  const drawCategoryLabels = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';

    Object.entries(skillCategories).forEach(([categoryKey, category]) => {
      const labelRadius = radius + 20;
      const x = centerX + Math.cos(category.angle) * labelRadius;
      const y = centerY + Math.sin(category.angle) * labelRadius;

      // 调整文字对齐方式
      if (category.angle === 0) ctx.textAlign = 'left';
      else if (category.angle === Math.PI) ctx.textAlign = 'right';
      else ctx.textAlign = 'center';

      ctx.fillText(category.name, x, y + 4);

      // 技能数量标识
      const skillCount = skills.filter(skill => skill.category === categoryKey).length;
      if (skillCount > 0) {
        ctx.fillStyle = category.color;
        ctx.beginPath();
        const currentTextAlign = ctx.textAlign as string;
        const arcOffsetX = currentTextAlign === 'left' ? -15 : currentTextAlign === 'right' ? 15 : 0;
        ctx.arc(x + arcOffsetX, y + 15, 8, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        const textAlign = ctx.textAlign as string;
        const offsetX = textAlign === 'left' ? -15 : textAlign === 'right' ? 15 : 0;
        ctx.fillText(skillCount.toString(), x + offsetX, y + 19);
      }
    });
  };

  return (
    <div className="flex flex-col items-center">
      {/* 雷达图画布 */}
      <motion.div
        initial={animated ? { opacity: 0, scale: 0.8 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <canvas
          ref={canvasRef}
          className="bg-white rounded-lg shadow-sm"
        />

        {/* 技能总数标识 */}
        {skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="absolute top-2 right-2 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold"
          >
            {skills.length}
          </motion.div>
        )}

        {/* 中心点技能概要 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white/90 rounded-lg p-2 backdrop-blur-sm"
        >
          <div className="text-xs text-gray-600">技能强度</div>
          <div className="text-lg font-bold text-purple-600">
            {skills.length > 0 ? Math.round(skills.reduce((sum, skill) => sum + skill.confidence, 0) / skills.length * 100) : 0}%
          </div>
        </motion.div>
      </motion.div>

      {/* 图例 */}
      {skills.length > 0 && (
        <motion.div
          initial={animated ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-4 grid grid-cols-2 gap-3 text-sm"
        >
          {Object.entries(skillCategories).map(([categoryKey, category]) => {
            const categorySkills = skills.filter(skill => skill.category === categoryKey);
            const strength = calculateCategoryStrength(categoryKey);

            return (
              <div key={categoryKey} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-gray-700">{category.name}</span>
                <span className="text-gray-500">({categorySkills.length})</span>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* 空状态提示 */}
      {skills.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center text-gray-500">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-sm">继续对话，技能雷达将实时生成</div>
          </div>
        </motion.div>
      )}

      {/* 实时更新指示 */}
      {animated && skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-2 text-xs text-green-600 flex items-center space-x-1"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>实时更新中...</span>
        </motion.div>
      )}
    </div>
  );
}