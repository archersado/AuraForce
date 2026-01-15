/**
 * Active Session Storage
 *
 * Manages localStorage persistence for the currently active session ID.
 * This allows the UI to restore the last active session on page refresh.
 */

const ACTIVE_SESSION_KEY = 'auraforce_active_session_id';

export class SessionStorage {
  /**
   * Set the active session ID in localStorage
   */
  static setActiveSessionId(sessionId: string | null): void {
    try {
      if (sessionId === null) {
        localStorage.removeItem(ACTIVE_SESSION_KEY);
      } else {
        localStorage.setItem(ACTIVE_SESSION_KEY, sessionId);
      }
      console.log('[SessionStorage] Set active session:', sessionId);
    } catch (error) {
      console.warn('[SessionStorage] Failed to set active session:', error);
    }
  }

  /**
   * Get the active session ID from localStorage
   * @returns The active session ID, or null if not found
   */
  static getActiveSessionId(): string | null {
    try {
      const value = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (value) {
        console.log('[SessionStorage] Get active session:', value);
        return value;
      }
      return null;
    } catch (error) {
      console.warn('[SessionStorage] Failed to get active session:', error);
      return null;
    }
  }

  /**
   * Clear the active session ID from localStorage
   */
  static clearActiveSessionId(): void {
    try {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
      console.log('[SessionStorage] Cleared active session');
    } catch (error) {
      console.warn('[SessionStorage] Failed to clear active session:', error);
    }
  }

  /**
   * Check if there is an active session stored
   */
  static hasActiveSession(): boolean {
    return this.getActiveSessionId() !== null;
  }
}
