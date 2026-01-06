/**
 * Zustand Store Type Definitions
 *
 * Provides common types and utilities for all Zustand stores
 * in the AuraForce application.
 */

import type { StateCreator } from 'zustand'

/**
 * Generic store state type
 * @template T - The state type
 */
export type StoreState<T> = T

/**
 * Generic store actions type
 * @template T - The actions type
 */
export type StoreActions<T> = T

/**
 * Store slice type for composing multiple stores
 * @template T - The store type
 */
export type StoreSlice<T> = StateCreator<T>

/**
 * Store selector type for extracting specific state
 * @template S - The full store state type
 * @template T - The selected type
 */
export type StoreSelector<S, T> = (state: S) => T

/**
 * Middleware configuration for store creation
 */
export interface MiddlewareConfig {
  /**
   * Store name for DevTools identification
   */
  name: string

  /**
   * Enable DevTools (only in development by default)
   * @default true
   */
  enabled?: boolean

  /**
   * Storage key for persistence middleware
   */
  storageKey?: string
}

/**
 * Store configuration options
 */
export interface StoreOptions {
  /**
   * Whether to enable DevTools middleware
   * @default process.env.NODE_ENV === 'development'
   */
  devtools?: boolean

  /**
   * Whether to enable persistence middleware
   * @default false
   */
  persist?: boolean

  /**
   * Storage key for persisted state
   */
  storageKey?: string
}
