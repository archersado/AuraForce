/**
 * Dashboard Page (Redirect)
 *
 * After login, users are redirected here which then redirects to the Claude chat page.
 * In future, this will display a full dashboard with navigation to all features.
 */

import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Dashboard - AuraForce',
  description: 'Main dashboard for AuraForce',
};

/**
 * Redirects to Claude chat page after login
 */
export default function DashboardPage() {
  redirect('/claude');
}
