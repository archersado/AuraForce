# Story 4.6: Error Handling and Retry from Spec Config

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want robust error handling and configurable retry mechanisms for my workflow executions based on specification configuration,
so that I can ensure reliable execution of complex workflows with automatic recovery from transient failures and intelligent error management.

## Acceptance Criteria

1. **Specification-Based Error Configuration**
   - Parse error handling configuration from BMAD workflow spec frontmatter
   - Support per-step retry policies, timeout settings, and failure strategies
   - Define error classification (transient, permanent, timeout) with custom rules
   - Configure notification rules and escalation paths for different error types
   - Support conditional error handling based on step type and context

2. **Intelligent Retry Engine**
   - Implement exponential backoff and jitter for retry delays
   - Support maximum retry limits per step with configurable multipliers
   - Provide circuit breaker pattern for failing services and dependencies
   - Handle workflow-level vs step-level retry logic with priority handling
   - Support manual intervention triggers for critical failures

3. **Comprehensive Error Classification and Recovery**
   - Automatic error type detection (network, timeout, validation, runtime)
   - Custom error patterns and recovery strategies per workflow type
   - Support for error context preservation across retry attempts
   - Implement rollback mechanisms for failed multi-step transactions
   - Provide error aggregation and correlation for complex failure scenarios

4. **Real-time Error Monitoring and Alerting**
   - Stream error events and retry attempts via WebSocket to monitoring dashboard
   - Generate actionable error reports with debugging information
   - Support custom alerting rules and notification channels (email, webhook)
   - Provide error trend analysis and failure pattern detection
   - Implement emergency stop mechanisms for cascading failures

5. **Recovery State Management**
   - Maintain execution checkpoints for resumable workflow recovery
   - Support workflow state snapshots before critical operations
   - Implement partial execution recovery with step skipping capabilities
   - Provide manual recovery intervention points with user confirmation
   - Support workflow continuation from arbitrary checkpoints

## Tasks / Subtasks

- [ ] Task 1: Implement Spec-Based Error Configuration (AC: 1)
  - [ ] Subtask 1.1: Extend BMAD spec parser for error handling configuration
  - [ ] Subtask 1.2: Create error configuration validation and schema
  - [ ] Subtask 1.3: Build per-step retry policy management
  - [ ] Subtask 1.4: Add conditional error handling rule engine
- [ ] Task 2: Build Intelligent Retry Engine (AC: 2)
  - [ ] Subtask 2.1: Implement exponential backoff with configurable jitter
  - [ ] Subtask 2.2: Create circuit breaker pattern for service failures
  - [ ] Subtask 2.3: Build workflow-level and step-level retry coordination
  - [ ] Subtask 2.4: Add manual intervention and escalation triggers
- [ ] Task 3: Create Comprehensive Error Classification System (AC: 3)
  - [ ] Subtask 3.1: Build automatic error type detection engine
  - [ ] Subtask 3.2: Implement custom error patterns and recovery strategies
  - [ ] Subtask 3.3: Add error context preservation and correlation
  - [ ] Subtask 3.4: Create rollback mechanisms for transactional failures
- [ ] Task 4: Implement Error Monitoring and Alerting (AC: 4)
  - [ ] Subtask 4.1: Extend WebSocket system for error event streaming
  - [ ] Subtask 4.2: Create real-time error dashboard with actionable insights
  - [ ] Subtask 4.3: Build configurable alerting and notification system
  - [ ] Subtask 4.4: Add error pattern detection and trend analysis
- [ ] Task 5: Build Recovery State Management (AC: 5)
  - [ ] Subtask 5.1: Implement execution checkpoint system
  - [ ] Subtask 5.2: Create workflow state snapshot and restoration
  - [ ] Subtask 5.3: Add manual recovery intervention interface
  - [ ] Subtask 5.4: Build checkpoint-based workflow continuation

## Dev Notes

### Enhanced Error Configuration Schema

The developer MUST extend the workflow specification format to support comprehensive error handling configuration:

```typescript
// src/lib/workflows/error-config.ts

export interface WorkflowErrorConfig {
  retryPolicy?: {
    maxAttempts: number;
    backoffStrategy: 'exponential' | 'linear' | 'fixed';
    baseDelay: number;
    maxDelay: number;
    jitter: boolean;
    multiplier: number;
  };

  errorClassification?: {
    transientErrors: string[]; // Regex patterns for transient errors
    permanentErrors: string[]; // Regex patterns for permanent errors
    timeoutErrors: string[]; // Regex patterns for timeout errors
    customRules: ErrorClassificationRule[];
  };

  recoveryStrategy?: {
    onTransientError: 'retry' | 'skip' | 'abort' | 'manual';
    onPermanentError: 'abort' | 'skip' | 'manual';
    onTimeout: 'retry' | 'abort' | 'extend';
    rollbackOnFailure: boolean;
    preserveContext: boolean;
  };

  alerting?: {
    channels: AlertChannel[];
    rules: AlertRule[];
    escalationPath: EscalationLevel[];
    suppressDuplicates: boolean;
    quietHours?: { start: string; end: string };
  };

  checkpoints?: {
    enabled: boolean;
    frequency: 'step' | 'stage' | 'custom';
    retentionDays: number;
    compression: boolean;
  };
}

export interface StepErrorConfig extends Partial<WorkflowErrorConfig> {
  stepId: string;
  criticalStep: boolean;
  dependencies: string[];
  customHandlers: CustomErrorHandler[];
}

export interface ErrorClassificationRule {
  pattern: string;
  type: 'transient' | 'permanent' | 'timeout' | 'validation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: 'retry' | 'skip' | 'abort' | 'manual' | 'escalate';
  context?: Record<string, any>;
}

export interface AlertChannel {
  type: 'email' | 'webhook' | 'sms' | 'slack';
  endpoint: string;
  credentials?: Record<string, string>;
  enabled: boolean;
  filters?: AlertFilter[];
}

export interface AlertRule {
  name: string;
  condition: string; // JavaScript expression
  severity: 'info' | 'warning' | 'error' | 'critical';
  throttle: number; // Seconds between alerts
  channels: string[]; // Channel names
}

export interface EscalationLevel {
  level: number;
  delay: number; // Minutes before escalation
  channels: string[];
  requiresAcknowledgment: boolean;
  autoResolve: boolean;
}

export class ErrorConfigurationParser {
  parseWorkflowErrorConfig(frontmatter: any): WorkflowErrorConfig {
    const errorConfig: WorkflowErrorConfig = {};

    if (frontmatter.error_handling) {
      const config = frontmatter.error_handling;

      // Parse retry policy
      if (config.retry_policy) {
        errorConfig.retryPolicy = {
          maxAttempts: config.retry_policy.max_attempts || 3,
          backoffStrategy: config.retry_policy.backoff_strategy || 'exponential',
          baseDelay: config.retry_policy.base_delay || 1000,
          maxDelay: config.retry_policy.max_delay || 30000,
          jitter: config.retry_policy.jitter ?? true,
          multiplier: config.retry_policy.multiplier || 2
        };
      }

      // Parse error classification
      if (config.error_classification) {
        errorConfig.errorClassification = {
          transientErrors: config.error_classification.transient || [
            'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', '5[0-9][0-9]'
          ],
          permanentErrors: config.error_classification.permanent || [
            '4[0-1][0-9]', 'EACCES', 'EPERM'
          ],
          timeoutErrors: config.error_classification.timeout || [
            'TIMEOUT', 'ETIMEDOUT', 'Request timeout'
          ],
          customRules: this.parseCustomRules(config.error_classification.custom_rules)
        };
      }

      // Parse recovery strategy
      if (config.recovery_strategy) {
        errorConfig.recoveryStrategy = {
          onTransientError: config.recovery_strategy.on_transient || 'retry',
          onPermanentError: config.recovery_strategy.on_permanent || 'abort',
          onTimeout: config.recovery_strategy.on_timeout || 'retry',
          rollbackOnFailure: config.recovery_strategy.rollback_on_failure ?? false,
          preserveContext: config.recovery_strategy.preserve_context ?? true
        };
      }

      // Parse alerting configuration
      if (config.alerting) {
        errorConfig.alerting = this.parseAlertingConfig(config.alerting);
      }

      // Parse checkpoint configuration
      if (config.checkpoints) {
        errorConfig.checkpoints = {
          enabled: config.checkpoints.enabled ?? true,
          frequency: config.checkpoints.frequency || 'step',
          retentionDays: config.checkpoints.retention_days || 7,
          compression: config.checkpoints.compression ?? true
        };
      }
    }

    return this.validateErrorConfig(errorConfig);
  }

  parseStepErrorConfig(stepConfig: any, workflowConfig: WorkflowErrorConfig): StepErrorConfig {
    return {
      stepId: stepConfig.id,
      criticalStep: stepConfig.critical ?? false,
      dependencies: stepConfig.dependencies || [],
      customHandlers: this.parseCustomHandlers(stepConfig.error_handlers),
      // Inherit from workflow config and override with step-specific config
      ...workflowConfig,
      ...this.parseWorkflowErrorConfig({ error_handling: stepConfig.error_handling })
    };
  }

  private parseCustomRules(rules: any[]): ErrorClassificationRule[] {
    if (!Array.isArray(rules)) return [];

    return rules.map(rule => ({
      pattern: rule.pattern,
      type: rule.type || 'transient',
      severity: rule.severity || 'medium',
      action: rule.action || 'retry',
      context: rule.context
    }));
  }

  private parseAlertingConfig(alerting: any): WorkflowErrorConfig['alerting'] {
    return {
      channels: alerting.channels?.map(ch => ({
        type: ch.type,
        endpoint: ch.endpoint,
        credentials: ch.credentials,
        enabled: ch.enabled ?? true,
        filters: ch.filters
      })) || [],
      rules: alerting.rules?.map(rule => ({
        name: rule.name,
        condition: rule.condition,
        severity: rule.severity || 'warning',
        throttle: rule.throttle || 300, // 5 minutes default
        channels: rule.channels || []
      })) || [],
      escalationPath: alerting.escalation?.map((level, index) => ({
        level: index + 1,
        delay: level.delay || 15,
        channels: level.channels || [],
        requiresAcknowledgment: level.requires_acknowledgment ?? false,
        autoResolve: level.auto_resolve ?? true
      })) || [],
      suppressDuplicates: alerting.suppress_duplicates ?? true,
      quietHours: alerting.quiet_hours
    };
  }

  private validateErrorConfig(config: WorkflowErrorConfig): WorkflowErrorConfig {
    // Validate retry policy
    if (config.retryPolicy) {
      if (config.retryPolicy.maxAttempts < 0 || config.retryPolicy.maxAttempts > 50) {
        throw new Error('Max retry attempts must be between 0 and 50');
      }

      if (config.retryPolicy.baseDelay < 100) {
        throw new Error('Base delay must be at least 100ms');
      }

      if (config.retryPolicy.maxDelay < config.retryPolicy.baseDelay) {
        throw new Error('Max delay must be greater than base delay');
      }
    }

    // Validate error patterns
    if (config.errorClassification?.customRules) {
      for (const rule of config.errorClassification.customRules) {
        try {
          new RegExp(rule.pattern);
        } catch (error) {
          throw new Error(`Invalid error pattern regex: ${rule.pattern}`);
        }
      }
    }

    return config;
  }
}
```

### Advanced Retry Engine with Circuit Breaker

**CRITICAL:** The developer MUST implement an intelligent retry system that prevents cascading failures:

```typescript
// src/lib/workflows/retry-engine.ts

export interface RetryContext {
  executionId: string;
  stepId: string;
  attemptNumber: number;
  error: Error;
  startTime: Date;
  config: StepErrorConfig;
  workflowContext: any;
}

export interface CircuitBreakerState {
  serviceName: string;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureCount: number;
  lastFailureTime: Date;
  successCount: number;
  nextAttemptTime: Date;
}

export class RetryEngine {
  private circuitBreakers = new Map<string, CircuitBreakerState>();
  private retryAttempts = new Map<string, number>();
  private errorMonitor: ErrorMonitor;
  private checkpointManager: CheckpointManager;

  constructor(errorMonitor: ErrorMonitor, checkpointManager: CheckpointManager) {
    this.errorMonitor = errorMonitor;
    this.checkpointManager = checkpointManager;
  }

  async executeWithRetry<T>(
    retryContext: RetryContext,
    executeFunction: () => Promise<T>
  ): Promise<T> {
    const { config, stepId, executionId } = retryContext;
    const retryKey = `${executionId}:${stepId}`;

    // Check circuit breaker state
    if (await this.isCircuitBreakerOpen(stepId, config)) {
      throw new Error(`Circuit breaker is open for step: ${stepId}`);
    }

    // Create checkpoint before first attempt
    if (config.checkpoints?.enabled && retryContext.attemptNumber === 1) {
      await this.checkpointManager.createCheckpoint(executionId, stepId, retryContext.workflowContext);
    }

    try {
      const result = await this.executeWithTimeout(executeFunction, config);

      // Success - reset retry count and close circuit breaker
      this.retryAttempts.delete(retryKey);
      await this.closeCircuitBreaker(stepId);

      // Log successful execution
      await this.errorMonitor.logEvent(executionId, {
        type: 'step_success',
        stepId,
        attemptNumber: retryContext.attemptNumber,
        timestamp: new Date()
      });

      return result;

    } catch (error) {
      const currentAttempts = this.retryAttempts.get(retryKey) || 0;
      this.retryAttempts.set(retryKey, currentAttempts + 1);

      // Classify error
      const errorClassification = await this.classifyError(error, config);

      // Log error attempt
      await this.errorMonitor.logEvent(executionId, {
        type: 'step_error',
        stepId,
        attemptNumber: retryContext.attemptNumber,
        error: error.message,
        classification: errorClassification,
        timestamp: new Date()
      });

      // Check if we should retry
      const shouldRetry = await this.shouldRetry(error, errorClassification, retryContext);

      if (!shouldRetry) {
        // Update circuit breaker on permanent failure
        if (errorClassification.type === 'permanent') {
          await this.openCircuitBreaker(stepId, error);
        }

        // Clean up and throw final error
        this.retryAttempts.delete(retryKey);
        throw await this.enhanceError(error, retryContext, errorClassification);
      }

      // Calculate retry delay
      const delay = this.calculateRetryDelay(retryContext.attemptNumber, config.retryPolicy);

      // Log retry attempt
      await this.errorMonitor.logEvent(executionId, {
        type: 'retry_scheduled',
        stepId,
        attemptNumber: retryContext.attemptNumber,
        delay,
        nextAttempt: new Date(Date.now() + delay),
        timestamp: new Date()
      });

      // Wait before retry
      await this.delay(delay);

      // Recursive retry with updated context
      return await this.executeWithRetry(
        {
          ...retryContext,
          attemptNumber: retryContext.attemptNumber + 1,
          error
        },
        executeFunction
      );
    }
  }

  private async executeWithTimeout<T>(
    executeFunction: () => Promise<T>,
    config: StepErrorConfig
  ): Promise<T> {
    const timeout = config.retryPolicy?.maxDelay || 60000; // 1 minute default

    return new Promise<T>((resolve, reject) => {
      const timeoutHandle = setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeout}ms`));
      }, timeout);

      executeFunction()
        .then(result => {
          clearTimeout(timeoutHandle);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutHandle);
          reject(error);
        });
    });
  }

  private async classifyError(error: Error, config: StepErrorConfig): Promise<ErrorClassification> {
    const errorMessage = error.message;
    const classification: ErrorClassification = {
      type: 'unknown',
      severity: 'medium',
      recoverable: false,
      context: {}
    };

    // Check custom rules first
    if (config.errorClassification?.customRules) {
      for (const rule of config.errorClassification.customRules) {
        if (new RegExp(rule.pattern).test(errorMessage)) {
          classification.type = rule.type;
          classification.severity = rule.severity;
          classification.recoverable = rule.action !== 'abort';
          classification.context = rule.context || {};
          return classification;
        }
      }
    }

    // Check predefined patterns
    const errorConfig = config.errorClassification;
    if (errorConfig) {
      // Check transient errors
      if (errorConfig.transientErrors.some(pattern => new RegExp(pattern).test(errorMessage))) {
        classification.type = 'transient';
        classification.recoverable = true;
        classification.severity = 'low';
      }

      // Check permanent errors
      else if (errorConfig.permanentErrors.some(pattern => new RegExp(pattern).test(errorMessage))) {
        classification.type = 'permanent';
        classification.recoverable = false;
        classification.severity = 'high';
      }

      // Check timeout errors
      else if (errorConfig.timeoutErrors.some(pattern => new RegExp(pattern).test(errorMessage))) {
        classification.type = 'timeout';
        classification.recoverable = true;
        classification.severity = 'medium';
      }
    }

    // Enhance with additional context
    classification.context = {
      errorCode: error.code,
      errorName: error.name,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };

    return classification;
  }

  private async shouldRetry(
    error: Error,
    classification: ErrorClassification,
    context: RetryContext
  ): Promise<boolean> {
    const { config, attemptNumber } = context;

    // Check max attempts
    const maxAttempts = config.retryPolicy?.maxAttempts || 3;
    if (attemptNumber >= maxAttempts) {
      return false;
    }

    // Check recovery strategy
    const strategy = config.recoveryStrategy;
    if (strategy) {
      switch (classification.type) {
        case 'transient':
          return strategy.onTransientError === 'retry';
        case 'permanent':
          return strategy.onPermanentError === 'retry';
        case 'timeout':
          return strategy.onTimeout === 'retry';
        default:
          return false;
      }
    }

    // Default: retry transient and timeout errors only
    return ['transient', 'timeout'].includes(classification.type);
  }

  private calculateRetryDelay(attemptNumber: number, retryPolicy?: WorkflowErrorConfig['retryPolicy']): number {
    const baseDelay = retryPolicy?.baseDelay || 1000;
    const maxDelay = retryPolicy?.maxDelay || 30000;
    const multiplier = retryPolicy?.multiplier || 2;
    const strategy = retryPolicy?.backoffStrategy || 'exponential';
    const jitter = retryPolicy?.jitter ?? true;

    let delay: number;

    switch (strategy) {
      case 'exponential':
        delay = Math.min(baseDelay * Math.pow(multiplier, attemptNumber - 1), maxDelay);
        break;
      case 'linear':
        delay = Math.min(baseDelay * attemptNumber, maxDelay);
        break;
      case 'fixed':
      default:
        delay = baseDelay;
        break;
    }

    // Add jitter to prevent thundering herd
    if (jitter) {
      const jitterAmount = delay * 0.1; // 10% jitter
      delay += (Math.random() - 0.5) * 2 * jitterAmount;
    }

    return Math.max(100, Math.floor(delay)); // Minimum 100ms delay
  }

  private async isCircuitBreakerOpen(stepId: string, config: StepErrorConfig): Promise<boolean> {
    const breaker = this.circuitBreakers.get(stepId);

    if (!breaker) {
      return false; // No circuit breaker, allow execution
    }

    const now = new Date();

    switch (breaker.state) {
      case 'CLOSED':
        return false; // Circuit is closed, allow execution

      case 'OPEN':
        // Check if we should transition to half-open
        if (now >= breaker.nextAttemptTime) {
          breaker.state = 'HALF_OPEN';
          breaker.successCount = 0;
          this.circuitBreakers.set(stepId, breaker);
          return false; // Allow one test execution
        }
        return true; // Circuit is open, reject execution

      case 'HALF_OPEN':
        return false; // Allow execution to test recovery

      default:
        return false;
    }
  }

  private async openCircuitBreaker(stepId: string, error: Error): Promise<void> {
    const now = new Date();
    const breaker = this.circuitBreakers.get(stepId) || {
      serviceName: stepId,
      state: 'CLOSED' as const,
      failureCount: 0,
      lastFailureTime: now,
      successCount: 0,
      nextAttemptTime: now
    };

    breaker.failureCount++;
    breaker.lastFailureTime = now;

    // Open circuit after 5 failures
    if (breaker.failureCount >= 5) {
      breaker.state = 'OPEN';
      breaker.nextAttemptTime = new Date(now.getTime() + 60000); // 1 minute timeout

      // Log circuit breaker opening
      await this.errorMonitor.logEvent('system', {
        type: 'circuit_breaker_opened',
        stepId,
        error: error.message,
        failureCount: breaker.failureCount,
        timeout: breaker.nextAttemptTime,
        timestamp: now
      });
    }

    this.circuitBreakers.set(stepId, breaker);
  }

  private async closeCircuitBreaker(stepId: string): Promise<void> {
    const breaker = this.circuitBreakers.get(stepId);

    if (breaker && breaker.state !== 'CLOSED') {
      if (breaker.state === 'HALF_OPEN') {
        breaker.successCount++;

        // Close circuit after successful execution
        if (breaker.successCount >= 1) {
          breaker.state = 'CLOSED';
          breaker.failureCount = 0;
          breaker.successCount = 0;

          // Log circuit breaker closing
          await this.errorMonitor.logEvent('system', {
            type: 'circuit_breaker_closed',
            stepId,
            timestamp: new Date()
          });
        }
      }

      this.circuitBreakers.set(stepId, breaker);
    }
  }

  private async enhanceError(
    error: Error,
    context: RetryContext,
    classification: ErrorClassification
  ): Promise<Error> {
    const enhanced = new Error(
      `Step ${context.stepId} failed after ${context.attemptNumber} attempts: ${error.message}`
    );

    (enhanced as any).originalError = error;
    (enhanced as any).classification = classification;
    (enhanced as any).retryContext = context;
    (enhanced as any).executionId = context.executionId;
    (enhanced as any).stepId = context.stepId;
    (enhanced as any).attemptNumber = context.attemptNumber;

    return enhanced;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getCircuitBreakerStatus(): Promise<CircuitBreakerState[]> {
    return Array.from(this.circuitBreakers.values());
  }

  async resetCircuitBreaker(stepId: string): Promise<void> {
    this.circuitBreakers.delete(stepId);
  }
}

interface ErrorClassification {
  type: 'transient' | 'permanent' | 'timeout' | 'validation' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
  context: Record<string, any>;
}
```

### Enhanced Error Monitoring and Alerting System

**CRITICAL:** The developer MUST implement comprehensive error monitoring with real-time alerting:

```typescript
// src/lib/workflows/error-monitor.ts

export interface ErrorEvent {
  id: string;
  executionId: string;
  stepId?: string;
  type: 'step_error' | 'step_success' | 'retry_scheduled' | 'circuit_breaker_opened' | 'circuit_breaker_closed' | 'manual_intervention_required';
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: Date;
  data: Record<string, any>;
}

export interface AlertContext {
  errorEvent: ErrorEvent;
  workflowSpec: WorkflowSpec;
  errorConfig: WorkflowErrorConfig;
  escalationLevel: number;
}

export class ErrorMonitor {
  private websocketManager: ExecutionMonitor;
  private alertQueue = new Map<string, AlertContext>();
  private notificationService: NotificationService;
  private errorAggregator: ErrorAggregator;

  constructor(
    websocketManager: ExecutionMonitor,
    notificationService: NotificationService,
    errorAggregator: ErrorAggregator
  ) {
    this.websocketManager = websocketManager;
    this.notificationService = notificationService;
    this.errorAggregator = errorAggregator;
  }

  async logEvent(executionId: string, eventData: Partial<ErrorEvent>): Promise<void> {
    const event: ErrorEvent = {
      id: this.generateEventId(),
      executionId,
      severity: eventData.severity || 'info',
      timestamp: eventData.timestamp || new Date(),
      type: eventData.type || 'step_error',
      stepId: eventData.stepId,
      data: eventData.data || {}
    };

    // Store in database
    await this.persistEvent(event);

    // Stream to monitoring dashboard
    this.websocketManager.broadcastExecutionEvent({
      type: 'error_event',
      executionId,
      timestamp: event.timestamp,
      data: event
    });

    // Aggregate for pattern detection
    await this.errorAggregator.addEvent(event);

    // Check if alerting is needed
    if (event.severity === 'error' || event.severity === 'critical') {
      await this.processAlert(event);
    }
  }

  private async processAlert(event: ErrorEvent): Promise<void> {
    try {
      // Get workflow specification and error configuration
      const execution = await prisma.workflowExecution.findUnique({
        where: { id: event.executionId },
        include: { workflowSpec: true }
      });

      if (!execution || !execution.workflowSpec) {
        console.error(`No execution found for error event: ${event.id}`);
        return;
      }

      const errorConfigParser = new ErrorConfigurationParser();
      const errorConfig = errorConfigParser.parseWorkflowErrorConfig(
        execution.workflowSpec.metadata?.errorHandling || {}
      );

      const alertContext: AlertContext = {
        errorEvent: event,
        workflowSpec: execution.workflowSpec,
        errorConfig,
        escalationLevel: 0
      };

      // Check alerting rules
      const shouldAlert = await this.evaluateAlertRules(alertContext);

      if (shouldAlert) {
        await this.triggerAlert(alertContext);
      }

    } catch (error) {
      console.error('Failed to process alert:', error);
    }
  }

  private async evaluateAlertRules(context: AlertContext): Promise<boolean> {
    const { errorConfig, errorEvent } = context;

    if (!errorConfig.alerting?.rules) {
      return false; // No alerting rules configured
    }

    // Check quiet hours
    if (errorConfig.alerting.quietHours && this.isQuietHour(errorConfig.alerting.quietHours)) {
      return false;
    }

    // Evaluate each rule
    for (const rule of errorConfig.alerting.rules) {
      try {
        const ruleContext = {
          event: errorEvent,
          severity: errorEvent.severity,
          type: errorEvent.type,
          stepId: errorEvent.stepId,
          timestamp: errorEvent.timestamp,
          data: errorEvent.data
        };

        // Evaluate JavaScript condition
        const result = this.evaluateCondition(rule.condition, ruleContext);

        if (result) {
          // Check throttling
          if (await this.isThrottled(rule, context)) {
            continue;
          }

          return true;
        }
      } catch (error) {
        console.error(`Failed to evaluate alert rule ${rule.name}:`, error);
      }
    }

    return false;
  }

  private evaluateCondition(condition: string, context: any): boolean {
    try {
      // Create a safe evaluation environment
      const func = new Function('context', `
        const { event, severity, type, stepId, timestamp, data } = context;
        return ${condition};
      `);

      return Boolean(func(context));
    } catch (error) {
      console.error('Condition evaluation error:', error);
      return false;
    }
  }

  private isQuietHour(quietHours: { start: string; end: string }): boolean {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:mm format

    if (quietHours.start <= quietHours.end) {
      // Same day quiet hours
      return currentTime >= quietHours.start && currentTime <= quietHours.end;
    } else {
      // Overnight quiet hours
      return currentTime >= quietHours.start || currentTime <= quietHours.end;
    }
  }

  private async isThrottled(rule: AlertRule, context: AlertContext): Promise<boolean> {
    const throttleKey = `alert:${rule.name}:${context.errorEvent.executionId}`;
    const lastAlert = await this.getLastAlertTime(throttleKey);

    if (!lastAlert) {
      return false;
    }

    const throttleMs = rule.throttle * 1000;
    const timeSinceLastAlert = Date.now() - lastAlert.getTime();

    return timeSinceLastAlert < throttleMs;
  }

  private async triggerAlert(context: AlertContext): Promise<void> {
    const { errorConfig, errorEvent, workflowSpec } = context;

    if (!errorConfig.alerting) {
      return;
    }

    // Find matching alert rule
    const matchingRule = errorConfig.alerting.rules.find(rule =>
      this.evaluateCondition(rule.condition, {
        event: errorEvent,
        severity: errorEvent.severity,
        type: errorEvent.type,
        stepId: errorEvent.stepId,
        data: errorEvent.data
      })
    );

    if (!matchingRule) {
      return;
    }

    // Prepare alert message
    const alertMessage = await this.createAlertMessage(context, matchingRule);

    // Send to configured channels
    const channels = errorConfig.alerting.channels.filter(ch =>
      matchingRule.channels.includes(ch.type) && ch.enabled
    );

    for (const channel of channels) {
      try {
        await this.notificationService.send(channel, alertMessage);

        // Record alert sent
        await this.recordAlertSent(matchingRule, channel, context);

      } catch (error) {
        console.error(`Failed to send alert via ${channel.type}:`, error);
      }
    }

    // Schedule escalation if configured
    if (errorConfig.alerting.escalationPath && errorConfig.alerting.escalationPath.length > 0) {
      await this.scheduleEscalation(context, matchingRule);
    }
  }

  private async createAlertMessage(context: AlertContext, rule: AlertRule): Promise<AlertMessage> {
    const { errorEvent, workflowSpec } = context;

    return {
      subject: `Workflow Alert: ${rule.name} - ${workflowSpec.name}`,
      title: `${rule.severity.toUpperCase()}: ${rule.name}`,
      body: `
**Workflow:** ${workflowSpec.name}
**Execution ID:** ${errorEvent.executionId}
**Step:** ${errorEvent.stepId || 'N/A'}
**Event Type:** ${errorEvent.type}
**Severity:** ${errorEvent.severity}
**Time:** ${errorEvent.timestamp.toISOString()}

**Error Details:**
${JSON.stringify(errorEvent.data, null, 2)}

**Workflow Path:** ${workflowSpec.ccPath}
      `.trim(),
      severity: rule.severity,
      timestamp: errorEvent.timestamp,
      metadata: {
        executionId: errorEvent.executionId,
        workflowName: workflowSpec.name,
        stepId: errorEvent.stepId,
        ruleName: rule.name
      }
    };
  }

  private async scheduleEscalation(context: AlertContext, rule: AlertRule): Promise<void> {
    const escalationPath = context.errorConfig.alerting?.escalationPath || [];

    for (let level = 0; level < escalationPath.length; level++) {
      const escalationLevel = escalationPath[level];
      const delayMs = escalationLevel.delay * 60 * 1000; // Convert minutes to milliseconds

      setTimeout(async () => {
        try {
          // Check if alert is still active and unacknowledged
          const alertStillActive = await this.isAlertStillActive(context, rule);

          if (alertStillActive && (!escalationLevel.requiresAcknowledgment ||
              !await this.isAlertAcknowledged(context, rule))) {

            await this.triggerEscalatedAlert(context, rule, escalationLevel);
          }
        } catch (error) {
          console.error('Escalation failed:', error);
        }
      }, delayMs);
    }
  }

  private async triggerEscalatedAlert(
    context: AlertContext,
    rule: AlertRule,
    escalationLevel: EscalationLevel
  ): Promise<void> {
    const escalatedMessage = await this.createEscalatedAlertMessage(context, rule, escalationLevel);

    const channels = context.errorConfig.alerting?.channels.filter(ch =>
      escalationLevel.channels.includes(ch.type) && ch.enabled
    ) || [];

    for (const channel of channels) {
      try {
        await this.notificationService.send(channel, escalatedMessage);
      } catch (error) {
        console.error(`Failed to send escalated alert via ${channel.type}:`, error);
      }
    }
  }

  async acknowledgeAlert(executionId: string, ruleName: string, userId: string): Promise<void> {
    await prisma.workflowAlertAcknowledgment.create({
      data: {
        executionId,
        ruleName,
        acknowledgedBy: userId,
        acknowledgedAt: new Date()
      }
    });
  }

  async getErrorTrends(timeRange: { start: Date; end: Date }): Promise<ErrorTrend[]> {
    return await this.errorAggregator.getTrends(timeRange);
  }

  async getFailurePatterns(workflowSpecId: string): Promise<FailurePattern[]> {
    return await this.errorAggregator.getFailurePatterns(workflowSpecId);
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private async persistEvent(event: ErrorEvent): Promise<void> {
    await prisma.workflowExecutionLog.create({
      data: {
        id: event.id,
        executionId: event.executionId,
        level: event.severity,
        message: `${event.type}: ${JSON.stringify(event.data)}`,
        timestamp: event.timestamp,
        source: 'error-monitor',
        stepName: event.stepId,
        metadata: {
          eventType: event.type,
          ...event.data
        }
      }
    });
  }

  private async getLastAlertTime(throttleKey: string): Promise<Date | null> {
    // Implementation would check cache or database for last alert time
    // Simplified for brevity
    return null;
  }

  private async recordAlertSent(
    rule: AlertRule,
    channel: AlertChannel,
    context: AlertContext
  ): Promise<void> {
    // Record alert for throttling and audit purposes
    await prisma.workflowAlert.create({
      data: {
        executionId: context.errorEvent.executionId,
        ruleName: rule.name,
        channelType: channel.type,
        severity: rule.severity,
        sentAt: new Date(),
        message: JSON.stringify(await this.createAlertMessage(context, rule))
      }
    });
  }

  private async isAlertStillActive(context: AlertContext, rule: AlertRule): Promise<boolean> {
    // Check if the condition that triggered the alert is still true
    return true; // Simplified for brevity
  }

  private async isAlertAcknowledged(context: AlertContext, rule: AlertRule): Promise<boolean> {
    const acknowledgment = await prisma.workflowAlertAcknowledgment.findFirst({
      where: {
        executionId: context.errorEvent.executionId,
        ruleName: rule.name
      }
    });

    return acknowledgment !== null;
  }

  private async createEscalatedAlertMessage(
    context: AlertContext,
    rule: AlertRule,
    escalationLevel: EscalationLevel
  ): Promise<AlertMessage> {
    const baseMessage = await this.createAlertMessage(context, rule);

    return {
      ...baseMessage,
      subject: `🚨 ESCALATED: ${baseMessage.subject}`,
      title: `🚨 ESCALATION LEVEL ${escalationLevel.level}: ${baseMessage.title}`,
      body: `
⚠️ **THIS IS AN ESCALATED ALERT** ⚠️

This alert has been escalated to level ${escalationLevel.level} because it was not acknowledged within ${escalationLevel.delay} minutes.

${baseMessage.body}

**Escalation Level:** ${escalationLevel.level}
**Requires Acknowledgment:** ${escalationLevel.requiresAcknowledgment ? 'Yes' : 'No'}
**Auto-Resolve:** ${escalationLevel.autoResolve ? 'Yes' : 'No'}
      `.trim(),
      severity: 'critical'
    };
  }
}

interface AlertMessage {
  subject: string;
  title: string;
  body: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: Date;
  metadata: Record<string, any>;
}

interface ErrorTrend {
  period: Date;
  errorCount: number;
  errorType: string;
  avgRetryCount: number;
  successRate: number;
}

interface FailurePattern {
  pattern: string;
  frequency: number;
  stepIds: string[];
  commonContext: Record<string, any>;
  suggestedFix: string;
}
```

### Checkpoint and Recovery State Management

**CRITICAL:** The developer MUST implement reliable state management for workflow recovery:

```typescript
// src/lib/workflows/checkpoint-manager.ts

export interface WorkflowCheckpoint {
  id: string;
  executionId: string;
  stepId: string;
  checkpointType: 'automatic' | 'manual' | 'pre_critical' | 'post_failure';
  state: WorkflowState;
  context: Record<string, any>;
  timestamp: Date;
  compressedData?: Buffer;
  metadata: CheckpointMetadata;
}

export interface WorkflowState {
  currentStep: string;
  completedSteps: string[];
  pendingSteps: string[];
  stepInputs: Record<string, any>;
  stepOutputs: Record<string, any>;
  variables: Record<string, any>;
  errorHistory: ErrorRecord[];
}

export interface CheckpointMetadata {
  size: number;
  compressed: boolean;
  version: string;
  checkpointReason: string;
  recoverySuggestions: string[];
}

export interface RecoveryOptions {
  continueFromCheckpoint: boolean;
  skipFailedStep: boolean;
  retryFailedStep: boolean;
  rollbackToStep: string;
  manualIntervention: boolean;
}

export class CheckpointManager {
  private compressionService: CompressionService;
  private encryptionService: EncryptionService;

  constructor(compressionService: CompressionService, encryptionService: EncryptionService) {
    this.compressionService = compressionService;
    this.encryptionService = encryptionService;
  }

  async createCheckpoint(
    executionId: string,
    stepId: string,
    workflowContext: any,
    checkpointType: WorkflowCheckpoint['checkpointType'] = 'automatic',
    reason?: string
  ): Promise<WorkflowCheckpoint> {
    const checkpointId = this.generateCheckpointId();
    const timestamp = new Date();

    // Build workflow state
    const state: WorkflowState = await this.captureWorkflowState(executionId, workflowContext);

    // Prepare checkpoint data
    let checkpointData = {
      id: checkpointId,
      executionId,
      stepId,
      checkpointType,
      state,
      context: this.sanitizeContext(workflowContext),
      timestamp
    };

    // Calculate size and compress if needed
    const serializedData = JSON.stringify(checkpointData);
    const size = Buffer.byteLength(serializedData, 'utf8');
    let compressedData: Buffer | undefined;
    let compressed = false;

    // Compress if data is larger than 1KB
    if (size > 1024) {
      compressedData = await this.compressionService.compress(serializedData);
      compressed = true;
    }

    const metadata: CheckpointMetadata = {
      size,
      compressed,
      version: '1.0',
      checkpointReason: reason || `${checkpointType} checkpoint`,
      recoverySuggestions: await this.generateRecoverySuggestions(state, checkpointType)
    };

    const checkpoint: WorkflowCheckpoint = {
      ...checkpointData,
      compressedData,
      metadata
    };

    // Store checkpoint in database
    await this.persistCheckpoint(checkpoint);

    // Log checkpoint creation
    await this.logCheckpointEvent(executionId, 'checkpoint_created', {
      checkpointId,
      stepId,
      checkpointType,
      size,
      compressed
    });

    return checkpoint;
  }

  async listCheckpoints(executionId: string): Promise<WorkflowCheckpoint[]> {
    const checkpoints = await prisma.workflowCheckpoint.findMany({
      where: { executionId },
      orderBy: { timestamp: 'desc' }
    });

    return checkpoints.map(cp => this.deserializeCheckpoint(cp));
  }

  async getCheckpoint(checkpointId: string): Promise<WorkflowCheckpoint | null> {
    const checkpoint = await prisma.workflowCheckpoint.findUnique({
      where: { id: checkpointId }
    });

    if (!checkpoint) {
      return null;
    }

    return this.deserializeCheckpoint(checkpoint);
  }

  async createRecoveryPlan(
    checkpointId: string,
    failureContext: any
  ): Promise<RecoveryPlan> {
    const checkpoint = await this.getCheckpoint(checkpointId);

    if (!checkpoint) {
      throw new Error(`Checkpoint not found: ${checkpointId}`);
    }

    const execution = await prisma.workflowExecution.findUnique({
      where: { id: checkpoint.executionId },
      include: { workflowSpec: true, steps: true }
    });

    if (!execution) {
      throw new Error(`Execution not found: ${checkpoint.executionId}`);
    }

    const options: RecoveryOptions = await this.analyzeRecoveryOptions(
      checkpoint,
      execution,
      failureContext
    );

    const plan: RecoveryPlan = {
      checkpointId,
      executionId: checkpoint.executionId,
      options,
      recommendedAction: await this.determineRecommendedAction(options, failureContext),
      riskAssessment: await this.assessRecoveryRisk(checkpoint, execution, failureContext),
      estimatedRecoveryTime: await this.estimateRecoveryTime(options, execution),
      prerequisites: await this.identifyPrerequisites(options, checkpoint),
      rollbackPlan: await this.createRollbackPlan(checkpoint, execution)
    };

    return plan;
  }

  async executeRecovery(
    checkpointId: string,
    recoveryAction: RecoveryAction,
    userConfirmation?: boolean
  ): Promise<RecoveryResult> {
    const checkpoint = await this.getCheckpoint(checkpointId);

    if (!checkpoint) {
      throw new Error(`Checkpoint not found: ${checkpointId}`);
    }

    // Verify user confirmation for critical operations
    if (recoveryAction.requiresConfirmation && !userConfirmation) {
      throw new Error('User confirmation required for this recovery action');
    }

    const recoveryId = this.generateRecoveryId();
    const startTime = new Date();

    try {
      // Log recovery attempt
      await this.logCheckpointEvent(checkpoint.executionId, 'recovery_started', {
        recoveryId,
        checkpointId,
        action: recoveryAction.type,
        timestamp: startTime
      });

      let result: RecoveryResult;

      switch (recoveryAction.type) {
        case 'continue_from_checkpoint':
          result = await this.continueFromCheckpoint(checkpoint, recoveryAction.parameters);
          break;

        case 'skip_failed_step':
          result = await this.skipFailedStep(checkpoint, recoveryAction.parameters);
          break;

        case 'retry_failed_step':
          result = await this.retryFailedStep(checkpoint, recoveryAction.parameters);
          break;

        case 'rollback_to_step':
          result = await this.rollbackToStep(checkpoint, recoveryAction.parameters);
          break;

        case 'manual_intervention':
          result = await this.requestManualIntervention(checkpoint, recoveryAction.parameters);
          break;

        default:
          throw new Error(`Unknown recovery action: ${recoveryAction.type}`);
      }

      // Log successful recovery
      await this.logCheckpointEvent(checkpoint.executionId, 'recovery_completed', {
        recoveryId,
        checkpointId,
        action: recoveryAction.type,
        duration: Date.now() - startTime.getTime(),
        result: result.success ? 'success' : 'failure'
      });

      return result;

    } catch (error) {
      // Log failed recovery
      await this.logCheckpointEvent(checkpoint.executionId, 'recovery_failed', {
        recoveryId,
        checkpointId,
        action: recoveryAction.type,
        duration: Date.now() - startTime.getTime(),
        error: error.message
      });

      return {
        success: false,
        executionId: checkpoint.executionId,
        recoveryId,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  private async continueFromCheckpoint(
    checkpoint: WorkflowCheckpoint,
    parameters: any
  ): Promise<RecoveryResult> {
    // Restore workflow state from checkpoint
    const restoredState = await this.restoreWorkflowState(checkpoint);

    // Update execution to continue from checkpoint
    await prisma.workflowExecution.update({
      where: { id: checkpoint.executionId },
      data: {
        status: 'running',
        metadata: {
          ...restoredState,
          recoveredFromCheckpoint: checkpoint.id,
          recoveryTimestamp: new Date()
        }
      }
    });

    return {
      success: true,
      executionId: checkpoint.executionId,
      recoveryId: this.generateRecoveryId(),
      resumedStepId: checkpoint.stepId,
      timestamp: new Date()
    };
  }

  private async skipFailedStep(
    checkpoint: WorkflowCheckpoint,
    parameters: any
  ): Promise<RecoveryResult> {
    const state = await this.restoreWorkflowState(checkpoint);

    // Mark the failed step as skipped and move to next step
    const failedStepId = parameters.failedStepId;
    state.completedSteps.push(failedStepId);
    state.stepOutputs[failedStepId] = { status: 'skipped', reason: 'Recovery skip' };

    // Find next step to execute
    const nextStep = this.findNextStep(state.pendingSteps, failedStepId);
    if (nextStep) {
      state.currentStep = nextStep;
    }

    // Update execution state
    await prisma.workflowExecution.update({
      where: { id: checkpoint.executionId },
      data: {
        status: 'running',
        metadata: {
          ...state,
          skippedStep: failedStepId,
          recoveredFromCheckpoint: checkpoint.id
        }
      }
    });

    return {
      success: true,
      executionId: checkpoint.executionId,
      recoveryId: this.generateRecoveryId(),
      skippedStepId: failedStepId,
      resumedStepId: nextStep,
      timestamp: new Date()
    };
  }

  private async retryFailedStep(
    checkpoint: WorkflowCheckpoint,
    parameters: any
  ): Promise<RecoveryResult> {
    const state = await this.restoreWorkflowState(checkpoint);

    // Reset step state for retry
    const failedStepId = parameters.failedStepId;
    state.currentStep = failedStepId;

    // Clear previous error context
    state.errorHistory = state.errorHistory.filter(err => err.stepId !== failedStepId);

    // Remove step from completed list if present
    state.completedSteps = state.completedSteps.filter(stepId => stepId !== failedStepId);

    // Add back to pending if needed
    if (!state.pendingSteps.includes(failedStepId)) {
      state.pendingSteps.unshift(failedStepId);
    }

    // Update execution state
    await prisma.workflowExecution.update({
      where: { id: checkpoint.executionId },
      data: {
        status: 'running',
        metadata: {
          ...state,
          retriedStep: failedStepId,
          recoveredFromCheckpoint: checkpoint.id
        }
      }
    });

    return {
      success: true,
      executionId: checkpoint.executionId,
      recoveryId: this.generateRecoveryId(),
      retriedStepId: failedStepId,
      timestamp: new Date()
    };
  }

  private async captureWorkflowState(
    executionId: string,
    workflowContext: any
  ): Promise<WorkflowState> {
    const execution = await prisma.workflowExecution.findUnique({
      where: { id: executionId },
      include: { steps: true }
    });

    if (!execution) {
      throw new Error(`Execution not found: ${executionId}`);
    }

    const completedSteps = execution.steps
      .filter(step => step.status === 'completed')
      .map(step => step.stepName);

    const pendingSteps = execution.steps
      .filter(step => step.status === 'pending')
      .map(step => step.stepName);

    const stepInputs: Record<string, any> = {};
    const stepOutputs: Record<string, any> = {};
    const errorHistory: ErrorRecord[] = [];

    execution.steps.forEach(step => {
      if (step.input) {
        stepInputs[step.stepName] = step.input;
      }
      if (step.output) {
        stepOutputs[step.stepName] = step.output;
      }
      if (step.status === 'failed' && step.errorMessage) {
        errorHistory.push({
          stepId: step.stepName,
          error: step.errorMessage,
          timestamp: step.completedAt || new Date()
        });
      }
    });

    return {
      currentStep: workflowContext.currentStep,
      completedSteps,
      pendingSteps,
      stepInputs,
      stepOutputs,
      variables: workflowContext.variables || {},
      errorHistory
    };
  }

  private sanitizeContext(context: any): Record<string, any> {
    // Remove sensitive information from context
    const sanitized = { ...context };

    // Remove passwords, API keys, tokens
    const sensitiveKeys = ['password', 'apiKey', 'token', 'secret', 'key', 'credential'];

    function recursiveSanitize(obj: any): any {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }

      if (Array.isArray(obj)) {
        return obj.map(recursiveSanitize);
      }

      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        const isSensitive = sensitiveKeys.some(sensitive => lowerKey.includes(sensitive));

        if (isSensitive) {
          result[key] = '[REDACTED]';
        } else {
          result[key] = recursiveSanitize(value);
        }
      }

      return result;
    }

    return recursiveSanitize(sanitized);
  }

  private async generateRecoverySuggestions(
    state: WorkflowState,
    checkpointType: string
  ): Promise<string[]> {
    const suggestions: string[] = [];

    if (state.errorHistory.length > 0) {
      suggestions.push('Consider reviewing error history before recovery');

      const recentErrors = state.errorHistory.slice(-3);
      const errorTypes = [...new Set(recentErrors.map(err => this.classifyErrorType(err.error)))];

      if (errorTypes.includes('network')) {
        suggestions.push('Network errors detected - verify connectivity before retry');
      }

      if (errorTypes.includes('timeout')) {
        suggestions.push('Timeout errors detected - consider increasing timeout values');
      }

      if (errorTypes.includes('authentication')) {
        suggestions.push('Authentication errors detected - verify credentials');
      }
    }

    if (checkpointType === 'pre_critical') {
      suggestions.push('Critical step ahead - ensure all prerequisites are met');
      suggestions.push('Consider manual verification before proceeding');
    }

    if (state.pendingSteps.length > 0) {
      suggestions.push(`${state.pendingSteps.length} steps remaining in workflow`);
    }

    return suggestions;
  }

  private classifyErrorType(errorMessage: string): string {
    const message = errorMessage.toLowerCase();

    if (message.includes('network') || message.includes('connection') || message.includes('econnreset')) {
      return 'network';
    }

    if (message.includes('timeout') || message.includes('etimedout')) {
      return 'timeout';
    }

    if (message.includes('auth') || message.includes('unauthorized') || message.includes('forbidden')) {
      return 'authentication';
    }

    if (message.includes('validation') || message.includes('invalid') || message.includes('format')) {
      return 'validation';
    }

    return 'unknown';
  }

  private generateCheckpointId(): string {
    return `checkpoint_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private generateRecoveryId(): string {
    return `recovery_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private async persistCheckpoint(checkpoint: WorkflowCheckpoint): Promise<void> {
    const data = checkpoint.compressedData || Buffer.from(JSON.stringify({
      state: checkpoint.state,
      context: checkpoint.context
    }));

    await prisma.workflowCheckpoint.create({
      data: {
        id: checkpoint.id,
        executionId: checkpoint.executionId,
        stepId: checkpoint.stepId,
        checkpointType: checkpoint.checkpointType,
        data,
        timestamp: checkpoint.timestamp,
        metadata: checkpoint.metadata,
        compressed: checkpoint.metadata.compressed
      }
    });
  }

  private deserializeCheckpoint(dbCheckpoint: any): WorkflowCheckpoint {
    const data = dbCheckpoint.compressed ?
      this.compressionService.decompress(dbCheckpoint.data) :
      dbCheckpoint.data.toString();

    const parsedData = JSON.parse(data);

    return {
      id: dbCheckpoint.id,
      executionId: dbCheckpoint.executionId,
      stepId: dbCheckpoint.stepId,
      checkpointType: dbCheckpoint.checkpointType,
      state: parsedData.state,
      context: parsedData.context,
      timestamp: dbCheckpoint.timestamp,
      metadata: dbCheckpoint.metadata,
      compressedData: dbCheckpoint.compressed ? dbCheckpoint.data : undefined
    };
  }

  private async logCheckpointEvent(
    executionId: string,
    eventType: string,
    data: any
  ): Promise<void> {
    await prisma.workflowExecutionLog.create({
      data: {
        executionId,
        level: 'info',
        message: `Checkpoint ${eventType}`,
        source: 'checkpoint-manager',
        metadata: {
          eventType,
          ...data
        }
      }
    });
  }

  // Additional helper methods for recovery plan analysis...
  private async analyzeRecoveryOptions(
    checkpoint: WorkflowCheckpoint,
    execution: any,
    failureContext: any
  ): Promise<RecoveryOptions> {
    // Implementation would analyze the failure context and suggest recovery options
    return {
      continueFromCheckpoint: true,
      skipFailedStep: !checkpoint.state.errorHistory.some(err => err.stepId === checkpoint.stepId),
      retryFailedStep: true,
      rollbackToStep: checkpoint.stepId,
      manualIntervention: failureContext.severity === 'critical'
    };
  }

  private async restoreWorkflowState(checkpoint: WorkflowCheckpoint): Promise<WorkflowState> {
    return checkpoint.state;
  }

  private findNextStep(pendingSteps: string[], currentStep: string): string | undefined {
    const currentIndex = pendingSteps.indexOf(currentStep);
    return currentIndex >= 0 && currentIndex < pendingSteps.length - 1 ?
      pendingSteps[currentIndex + 1] : undefined;
  }
}

interface ErrorRecord {
  stepId: string;
  error: string;
  timestamp: Date;
}

interface RecoveryPlan {
  checkpointId: string;
  executionId: string;
  options: RecoveryOptions;
  recommendedAction: string;
  riskAssessment: string;
  estimatedRecoveryTime: number;
  prerequisites: string[];
  rollbackPlan: string;
}

interface RecoveryAction {
  type: 'continue_from_checkpoint' | 'skip_failed_step' | 'retry_failed_step' | 'rollback_to_step' | 'manual_intervention';
  parameters: Record<string, any>;
  requiresConfirmation: boolean;
}

interface RecoveryResult {
  success: boolean;
  executionId: string;
  recoveryId: string;
  resumedStepId?: string;
  skippedStepId?: string;
  retriedStepId?: string;
  error?: string;
  timestamp: Date;
}
```

### Enhanced Database Models for Error Handling

The developer MUST extend the database schema to support comprehensive error tracking and recovery:

```prisma
// Additional models for error handling and recovery

model WorkflowCheckpoint {
  id              String   @id
  executionId     String   @map("execution_id")
  stepId          String   @map("step_id")
  checkpointType  String   @map("checkpoint_type") // automatic, manual, pre_critical, post_failure
  data            Bytes    // Serialized checkpoint data
  compressed      Boolean  @default(false)
  timestamp       DateTime @default(now())
  metadata        Json?    // Checkpoint metadata

  execution WorkflowExecution @relation(fields: [executionId], references: [id], onDelete: Cascade)

  @@index([executionId])
  @@index([stepId])
  @@index([timestamp])
  @@map("workflow_checkpoints")
}

model WorkflowAlert {
  id          String   @id @default(uuid())
  executionId String   @map("execution_id")
  ruleName    String   @map("rule_name")
  channelType String   @map("channel_type")
  severity    String   // info, warning, error, critical
  message     Text
  sentAt      DateTime @default(now()) @map("sent_at")

  execution WorkflowExecution @relation(fields: [executionId], references: [id], onDelete: Cascade)

  @@index([executionId])
  @@index([sentAt])
  @@index([severity])
  @@map("workflow_alerts")
}

model WorkflowAlertAcknowledgment {
  id              String   @id @default(uuid())
  executionId     String   @map("execution_id")
  ruleName        String   @map("rule_name")
  acknowledgedBy  String   @map("acknowledged_by")
  acknowledgedAt  DateTime @default(now()) @map("acknowledged_at")

  @@unique([executionId, ruleName])
  @@index([acknowledgedBy])
  @@map("workflow_alert_acknowledgments")
}

model WorkflowRetryAttempt {
  id            String   @id @default(uuid())
  executionId   String   @map("execution_id")
  stepId        String   @map("step_id")
  attemptNumber Int      @map("attempt_number")
  errorType     String?  @map("error_type")
  errorMessage  Text?    @map("error_message")
  retryDelay    Int?     @map("retry_delay") // Milliseconds
  timestamp     DateTime @default(now())

  execution WorkflowExecution @relation(fields: [executionId], references: [id], onDelete: Cascade)

  @@index([executionId, stepId])
  @@index([timestamp])
  @@map("workflow_retry_attempts")
}

model WorkflowCircuitBreaker {
  id               String   @id @default(uuid())
  serviceName      String   @unique @map("service_name")
  state            String   @default("CLOSED") // CLOSED, OPEN, HALF_OPEN
  failureCount     Int      @default(0) @map("failure_count")
  successCount     Int      @default(0) @map("success_count")
  lastFailureTime  DateTime? @map("last_failure_time")
  nextAttemptTime  DateTime? @map("next_attempt_time")
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  @@index([serviceName])
  @@index([state])
  @@map("workflow_circuit_breakers")
}

// Add relations to existing WorkflowExecution model
model WorkflowExecution {
  // ... existing fields ...
  checkpoints    WorkflowCheckpoint[]
  alerts         WorkflowAlert[]
  retryAttempts  WorkflowRetryAttempt[]
}
```

### API Implementation for Error Management

The developer MUST implement comprehensive APIs for error handling management:

```typescript
// src/app/api/workflows/[id]/errors/route.ts

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({
        error: { type: 'AUTH_ERROR', message: 'Authentication required' },
        success: false
      }, { status: 401 });
    }

    const { id } = params;
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'status';

    const errorMonitor = new ErrorMonitor(/* dependencies */);

    if (action === 'status') {
      // Get overall error status for workflow execution
      const execution = await prisma.workflowExecution.findUnique({
        where: { id, userId: session.user.id },
        include: {
          retryAttempts: { orderBy: { timestamp: 'desc' }, take: 10 },
          alerts: { orderBy: { sentAt: 'desc' }, take: 10 },
          checkpoints: { orderBy: { timestamp: 'desc' }, take: 5 }
        }
      });

      if (!execution) {
        return NextResponse.json({
          error: { type: 'NOT_FOUND', message: 'Execution not found' },
          success: false
        }, { status: 404 });
      }

      return NextResponse.json({
        data: {
          execution,
          errorTrends: await errorMonitor.getErrorTrends({
            start: new Date(Date.now() - 24 * 60 * 60 * 1000),
            end: new Date()
          }),
          circuitBreakerStatus: await errorMonitor.getCircuitBreakerStatus?.()
        },
        success: true
      });
    }

    if (action === 'recovery_plan') {
      const checkpointId = url.searchParams.get('checkpointId');
      if (!checkpointId) {
        return NextResponse.json({
          error: { type: 'VALIDATION_ERROR', message: 'Checkpoint ID required' },
          success: false
        }, { status: 400 });
      }

      const checkpointManager = new CheckpointManager(/* dependencies */);
      const recoveryPlan = await checkpointManager.createRecoveryPlan(
        checkpointId,
        { executionId: id }
      );

      return NextResponse.json({
        data: { recoveryPlan },
        success: true,
        message: 'Recovery plan generated'
      });
    }

    return NextResponse.json({
      error: { type: 'VALIDATION_ERROR', message: 'Invalid action specified' },
      success: false
    }, { status: 400 });

  } catch (error) {
    console.error('Error management API error:', error);
    return NextResponse.json({
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to process error management request',
        details: error instanceof Error ? { message: error.message } : undefined
      },
      success: false
    }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({
        error: { type: 'AUTH_ERROR', message: 'Authentication required' },
        success: false
      }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { action, checkpointId, recoveryAction, userConfirmation } = body;

    if (action === 'acknowledge_alert') {
      const { ruleName } = body;
      const errorMonitor = new ErrorMonitor(/* dependencies */);

      await errorMonitor.acknowledgeAlert(id, ruleName, session.user.id);

      return NextResponse.json({
        data: { acknowledged: true },
        success: true,
        message: 'Alert acknowledged'
      });
    }

    if (action === 'execute_recovery') {
      const checkpointManager = new CheckpointManager(/* dependencies */);

      const result = await checkpointManager.executeRecovery(
        checkpointId,
        recoveryAction,
        userConfirmation
      );

      return NextResponse.json({
        data: { result },
        success: result.success,
        message: result.success ? 'Recovery executed successfully' : 'Recovery failed'
      });
    }

    if (action === 'create_checkpoint') {
      const { stepId, reason } = body;
      const checkpointManager = new CheckpointManager(/* dependencies */);

      // Get current workflow context
      const execution = await prisma.workflowExecution.findUnique({
        where: { id },
        include: { steps: true }
      });

      if (!execution) {
        return NextResponse.json({
          error: { type: 'NOT_FOUND', message: 'Execution not found' },
          success: false
        }, { status: 404 });
      }

      const checkpoint = await checkpointManager.createCheckpoint(
        id,
        stepId,
        execution.metadata || {},
        'manual',
        reason
      );

      return NextResponse.json({
        data: { checkpoint },
        success: true,
        message: 'Manual checkpoint created'
      });
    }

    return NextResponse.json({
      error: { type: 'VALIDATION_ERROR', message: 'Invalid action specified' },
      success: false
    }, { status: 400 });

  } catch (error) {
    console.error('Error management action error:', error);
    return NextResponse.json({
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to execute error management action',
        details: error instanceof Error ? { message: error.message } : undefined
      },
      success: false
    }, { status: 500 });
  }
}
```

### Project Structure Notes

**CRITICAL:** The developer MUST follow the exact project structure defined in the Architecture document:

- Error handling services in `src/lib/workflows/` directory
- Enhanced WebSocket monitoring integration with existing systems
- API endpoints following REST conventions with proper error handling
- Database models following snake_case with Prisma @@map() directives
- Error UI components in `src/components/workflow/` directory

### References

- **Enhanced WebSocket Infrastructure**: [Source: _bmad-output/implementation-artifacts/stories/4-5-real-time-execution-monitoring.md]
- **Architecture Decisions**: [Source: _bmad-output/architecture.md#Core Architectural Decisions]
- **Previous Story Foundation**: [Source: _bmad-output/implementation-artifacts/stories/4-4-trigger-workflow-execution.md]
- **Database Patterns**: [Source: _bmad-output/architecture.md#Implementation Patterns & Consistency Rules]
- **Project Requirements**: [Source: _bmad-output/prd.md#Workflow Engine Core Requirements]

## Dev Agent Record

### Agent Model Used

Claude 3.5 Sonnet

### Debug Log References

### Completion Notes List

### File List