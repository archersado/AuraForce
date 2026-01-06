/**
 * Claude Chat Page
 *
 * Main page for the Claude Code graphical interface chat UI.
 * Protected route - requires authentication.
 */

import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { ChatInterface } from '@/components/claude';

export const metadata = {
  title: 'Claude Code - AuraForce',
  description: 'Chat with Claude Code through a modern graphical interface',
};

/**
 * Server component - validates authentication before rendering
 */
export default async function ClaudeChatPage() {
  const session = await getSession();

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login?redirect=/claude');
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ChatInterface />
    </div>
  );
}
