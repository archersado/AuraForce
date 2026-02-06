/**
 * Workflow Types
 *
 * Types for BMAD workflow specifications and execution
 */

/**
 * Input type for workflow entry parameters
 */
export type WorkflowInputType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'textarea'
  | 'file'
  | 'json';

/**
 * Validation rules for workflow inputs
 */
export interface WorkflowInputValidation {
  min?: number;
  max?: number;
  pattern?: string;
  custom?: string;
}

/**
 * Single workflow input parameter definition
 */
export interface WorkflowInput {
  name: string;
  label?: string;
  type: WorkflowInputType;
  description?: string;
  required?: boolean;
  default?: string | number | boolean | string[];
  options?: string[];
  placeholder?: string;
  validation?: WorkflowInputValidation;
}

/**
 * Workflow metadata in database
 */
export interface WorkflowMetadata {
  id: string;
  name: string;
  description: string | null;
  version: string;
  author: string;
  ccPath: string;
  userId: string;
  status: string;
  visibility: 'public' | 'private';
  metadata?: {
    tags?: string[];
    requires?: string[];
    resources?: Array<{ path: string; description?: string }>;
    inputs?: WorkflowInput[];
    agents?: Array<{ name: string; path: string }>;
    subWorkflows?: Array<{ name: string; path: string }>;
  };
  deployedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Execution parameters for running a workflow
 */
export interface WorkflowExecutionParams {
  [key: string]: string | number | boolean | string[] | null;
}

/**
 * Workflow execution state
 */
export type WorkflowExecutionState = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

/**
 * Workflow execution record
 */
export interface WorkflowExecution {
  id: string;
  workflowId: string;
  userId: string;
  params: WorkflowExecutionParams;
  state: WorkflowExecutionState;
  startedAt: Date;
  completedAt: Date | null;
  result?: unknown;
  error?: string;
}

/**
 * Workflow list item
 */
export interface WorkflowListItem {
  id: string;
  name: string;
  description: string | null;
  version: string;
  author: string;
  tags?: string[];
  visibility: 'public' | 'private';
  status: string;
  inputs?: WorkflowInput[];
  deployedAt: Date | null;
  createdAt: Date;
}
