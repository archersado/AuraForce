/**
 * Experience Center API Routes
 *
 * Epic 5: Success Case Experience Center
 *
 * Routes:
 * - /api/experience/industries - Get available industries
 * - /api/experience/cases - Get success cases for an industry
 * - /api/experience/start - Start a new experience session
 * - /api/experience/ask - Ask AI during experience
 * - /api/experience/complete - Complete experience session
 * - /api/experience/history - Get user's experience history
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/custom-session';
import { PrismaClient } from '@/lib/prisma';

const prisma = new PrismaClient();

// Mock industries data (in production, would come from database)
const INDUSTRIES = [
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒', description: 'Online retail success stories' },
  { id: 'finance', name: 'Finance', icon: '💰', description: 'Banking and fintech innovations' },
  { id: 'education', name: 'Education', icon: '📚', description: 'Learning platform transformations' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', description: 'Medical tech breakthroughs' },
  { id: 'real-estate', name: 'Real Estate', icon: '🏠', description: 'Property tech revolution' },
  { id: 'logistics', name: 'Logistics', icon: '🚚', description: 'Supply chain optimizations' },
];

// Mock cases data (in production, would come from database)
const MOCK_CASES: Record<string, any[]> = {
  ecommerce: [
    {
      id: 'ecommerce-1',
      title: 'Platform Launch Challenge',
      industry: 'ecommerce',
      description: 'Experience the journey of launching a new e-commerce platform, from initial concept to first 1000 customers.',
      duration: 30,
      difficulty: 'beginner',
      category: 'Growth',
      image: '/images/cases/ecommerce-1.jpg',
      tags: ['startup', 'growth', 'marketing'],
      outcomes: ['Customer acquisition', 'Product-market fit', 'Revenue model'],
    },
    {
      id: 'ecommerce-2',
      title: 'Crisis Response Strategy',
      industry: 'ecommerce',
      description: 'Navigate through a major supply chain disruption and lead your team to recovery.',
      duration: 30,
      difficulty: 'advanced',
      category: 'Crisis Management',
      image: '/images/cases/ecommerce-2.jpg',
      tags: ['crisis', 'leadership', 'strategy'],
      outcomes: ['Team resilience', 'Alternative solutions', 'Customer retention'],
    },
  ],
  finance: [
    {
      id: 'finance-1',
      title: 'Digital Transformation',
      industry: 'finance',
      description: 'Lead a traditional bank through digital transformation while balancing innovation and risk.',
      duration: 30,
      difficulty: 'intermediate',
      category: 'Transformation',
      image: '/images/cases/finance-1.jpg',
      tags: ['digital', 'transformation', 'risk'],
      outcomes: ['Modernization', 'Regulatory compliance', 'User adoption'],
    },
  ],
  education: [
    {
      id: 'education-1',
      title: 'EdTech Platform Scale',
      industry: 'education',
      description: 'Scale an online learning platform to serve a million students across different time zones.',
      duration: 30,
      difficulty: 'intermediate',
      category: 'Growth',
      image: '/images/cases/education-1.jpg',
      tags: ['scale', 'technology', 'operations'],
      outcomes: ['Infrastructure design', 'Content localization', 'Quality assurance'],
    },
  ],
  healthcare: [
    {
      id: 'healthcare-1',
      title: 'Patient Data Integration',
      industry: 'healthcare',
      description: 'Integrate patient data from multiple hospital systems while maintaining privacy and security.',
      duration: 30,
      difficulty: 'advanced',
      category: 'Integration',
      image: '/images/cases/healthcare-1.jpg',
      tags: ['integration', 'security', 'compliance'],
      outcomes: ['Data unification', 'HIPAA compliance', 'Real-time access'],
    },
  ],
  'real-estate': [
    {
      id: 'realestate-1',
      title: 'Market Expansion',
      industry: 'real-estate',
      description: 'Expand a real estate platform to three new markets while adjusting for local regulations.',
      duration: 30,
      difficulty: 'intermediate',
      category: 'Expansion',
      image: '/images/cases/realestate-1.jpg',
      tags: ['expansion', 'regulation', 'localization'],
      outcomes: ['Market entry', 'Regulatory adaptation', 'Network building'],
    },
  ],
  logistics: [
    {
      id: 'logistics-1',
      title: 'Route Optimization',
      industry: 'logistics',
      description: 'Optimize delivery routes for a national logistics network during peak season.',
      duration: 30,
      difficulty: 'intermediate',
      category: 'Optimization',
      image: '/images/cases/logistics-1.jpg',
      tags: ['optimization', 'efficiency', 'ai'],
      outcomes: ['Cost reduction', 'Delivery speed', 'Customer satisfaction'],
    },
  ],
};

/**
 * GET /api/experience/industries - Get available industries
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Handle different actions
    switch (action) {
      case 'industries':
        return NextResponse.json({
          success: true,
          industries: INDUSTRIES,
        });

      case 'cases': {
        const industry = searchParams.get('industry');
        if (!industry) {
          return NextResponse.json({ error: 'Industry parameter is required' }, { status: 400 });
        }
        return NextResponse.json({
          success: true,
          cases: MOCK_CASES[industry] || [],
          industry,
        });
      }

      case 'history': {
        const history = await prisma.experienceHistory.findMany({
          where: { userId: session.user.id },
          orderBy: { completedAt: 'desc' },
          take: 50,
        });
        return NextResponse.json({
          success: true,
          history,
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('[Experience API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/experience/start - Start a new experience session
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'start') {
      const body = await request.json();
      const { caseId, profile, industry } = body;

      if (!caseId) {
        return NextResponse.json({ error: 'Case ID is required' }, { status: 400 });
      }

      // Find the case
      const case_ = Object.values(MOCK_CASES).flat().find((c) => c.id === caseId);
      if (!case_) {
        return NextResponse.json({ error: 'Case not found' }, { status: 404 });
      }

      // Create experience session
      const experienceSession = await prisma.experienceSession.create({
        data: {
          userId: session.user.id,
          caseId,
          industry: industry || case_.industry,
          startedAt: new Date(),
          status: 'in_progress',
          userProfile: profile || {},
        },
      });

      return NextResponse.json({
        success: true,
        session: experienceSession,
        case: case_,
      });
    }

    if (action === 'ask') {
      const body = await request.json();
      const { sessionId, question, context } = body;

      if (!sessionId || !question) {
        return NextResponse.json({ error: 'Session ID and question are required' }, { status: 400 });
      }

      // Verify session ownership
      const sessionData = await prisma.experienceSession.findUnique({
        where: { id: sessionId },
      });

      if (!sessionData || sessionData.userId !== session.user.id) {
        return NextResponse.json({ error: 'Session not found or unauthorized' }, { status: 404 });
      }

      // TODO: Integrate with Claude AI for actual responses
      // For now, return a mock response
      return NextResponse.json({
        success: true,
        response: {
          role: 'assistant',
          content: `Based on your question "${question}": This is a mock AI response. In production, this would be generated by Claude Agent based on the current step in the experience.`,
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (action === 'complete') {
      const body = await request.json();
      const { sessionId, duration, score, decisions } = body;

      if (!sessionId) {
        return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
      }

      const sessionData = await prisma.experienceSession.findUnique({
        where: { id: sessionId },
        include: { case: true },
      });

      if (!sessionData || sessionData.userId !== session.user.id) {
        return NextResponse.json({ error: 'Session not found or unauthorized' }, { status: 404 });
      }

      // Update session
      const updatedSession = await prisma.experienceSession.update({
        where: { id: sessionId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          duration,
          score: score || 0,
          decisions: decisions || [],
        },
      });

      // Create history record
      const history = await prisma.experienceHistory.create({
        data: {
          userId: session.user.id,
          caseId: sessionData.caseId,
          caseTitle: sessionData.case?.title || 'Unknown',
          industry: sessionData.industry,
          completedAt: new Date(),
          duration,
          score: score || 0,
          strategy: decisions?.length ? decisions[decisions.length - 1].strategy : 'balanced',
          decisions: decisions || [],
        },
      });

      return NextResponse.json({
        success: true,
        session: updatedSession,
        history,
        score: score || 0,
      });
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (error) {
    console.error('[Experience API] POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
