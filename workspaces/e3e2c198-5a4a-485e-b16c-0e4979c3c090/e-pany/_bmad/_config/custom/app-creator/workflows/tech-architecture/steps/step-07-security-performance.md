---
name: 'step-07-security-performance'
description: 'Design security architecture and performance optimization'

# Path Definitions
workflow_path: '{bmb_creations_output_folder}/app-creator/workflows/tech-architecture'
outputFile: '{output_folder}/tech-architecture-{project_name}.md'
---

# Step 7: Security & Performance

Design comprehensive security architecture and performance optimization strategies.

## DIALOGUE SECTIONS:

### 1. Security & Performance Overview
"**🛡️ 安全与 performance**

我将设计完整的安全架构方案和性能优化策略，确保系统安全可靠、高性能运行。"

### 2. Security Architecture
"**🔒 安全架构设计**

构建多层次的安全防护体系："

#### 2.1 Authentication & Authorization Security
"**认证授权安全**"

Design security measures:

##### Multi-Factor Authentication (MFA)
- **TOTP**: Time-based one-time passwords (Google Authenticator)
- **SMS**: SMS-based verification codes
- **Email**: Email-based verification codes

##### Password Security
```typescript
Password Requirements:
- Minimum length: 12 characters
- Complexity: Uppercase + lowercase + numbers + special chars
- Password hashing: bcrypt (12 rounds)
- No password reuse: Track password history
- Password reset: Token-based, expiry: 1 hour

Password Reset Flow:
1. Email verification token
2. Token validation
3. New password input
4. Password strength check
5. Password update
6. Invalidate all other sessions
```

##### Session Management
- **Session Expiry**: Refresh tokens expires after 7 days
- **Multiple Sessions**: Support multiple active sessions
- **Session Invalidation**: Manual logout, password change, suspicious activity
- **Device Fingerprinting**: Track login devices

#### 2.2 Data Protection
"**数据保护**"

Design data security:

##### Encryption at Rest
- **Database Encryption**: PostgreSQL Transparent Data Encryption (TDE)
- **File Storage**: AES-256 encryption for stored files
- **Backups**: Encrypted backup storage

##### Encryption in Transit
- **HTTPS**: TLS 1.3 only (disable TLS 1.0, 1.1, 1.2)
- **HSTS**: HTTP Strict Transport Security
- **Certificate Management**: Let's Encrypt or managed certificates

##### Sensitive Data Handling
```typescript
Sensitive Data Types:
- PII (Personally Identifiable Information): Name, email, address
- Financial Data: Payment info, billing details
- Health Data: Medical information (if applicable)
- Credentials: Passwords, API keys

Handling Rules:
- Encrypt sensitive fields in database
- Mask sensitive data in logs
- Implement data retention policies
- Provide data export/deletion (GDPR)
```

#### 2.3 Input Validation & Sanitization
"**输入验证和清洗**"

Design security through validation:

##### Server-Side Validation
- **Type Validation**: Validate data types before processing
- **Length Validation**: Maximum length for all string inputs
- **Format Validation**: Email format, URL validation
- **Range Validation**: Numeric ranges, date ranges
- **Business Logic Validation**: Custom validation rules

##### SQL Injection Prevention
```typescript
// Use parameterized queries (Prepared Statements)
// BAD: db.query(`SELECT * FROM users WHERE id = ${userId}`)
// GOOD: db.query('SELECT * FROM users WHERE id = ?', [userId])

// Use ORM with automatic escaping
const user = await User.findById(userId);

// Input sanitization
const sanitizedInput = sanitize(userInput);
```

##### XSS Prevention
- **Output Encoding**: HTML-encode all user-generated content
- **Content Security Policy (CSP)**:_restrict script sources
- **HttpOnly Cookies**: Prevent JavaScript access to cookies
- **Input Sanitization**: Strip dangerous HTML tags

#### 2.4 API Security
"**API安全**"

Design API protection:

##### Rate Limiting
- **Per IP**: 100 requests/minute
- **Per User**: 1000 requests/hour
- **Per Endpoint**: Custom limits
- **Rate Limit Headers**: Inform client of limits

```typescript
Rate Limit Response:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1641523200
Retry-After: 60
```

##### Request Validation
- **Schema Validation**: Validate request body against schema
- **ContentType**: Validate Content-Type header
- **Content Length**: Validate Content-Length header
- **User-Agent**: Optional validation

##### Security Headers
```typescript
Important Headers:
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=()
```

#### 2.5 Compliance & Auditing
"**合规性和审计**"

Design compliance measures:

##### Audit Logging
```typescript
Loggable Events:
- User authentication (login, logout, failed attempts)
- Permission changes
- Data access (especially sensitive data)
- Configuration changes
- Data exports
- Data deletions

Audit Log Format:
{
  id: UUID,
  eventType: "USER_LOGIN",
  userId: UUID,
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  timestamp: ISO8601,
  metadata: { ... }
}
```

##### GDPR Compliance
- **Data Portability**: User can export their data
- **Right to be Forgotten**: User can delete their account
- **Data Consent**: Explicit consent for data collection
- **Cookie Consent**: Cookie consent banner

### 3. Performance Strategy
"**⚡ 性能优化策略**

设计全面的性能优化方案："

#### 3.1 Frontend Performance
"**前端性能优化**"

Optimize frontend performance:

##### Code Optimization
- **Code Splitting**: Lazy load routes and components
- **Tree Shaking**: Remove unused code
- **Minification**: Minify JavaScript and CSS
- **Compression**: Gzip/Brotli compression

```typescript
// Code splitting example
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
```

##### Asset Optimization
- **Image Optimization**: WebP format, responsive images
- **Caching**: Browser caching, CDN caching
- **Bundle Size**: Monitor and optimize bundle size
- **Critical CSS**: Inline critical CSS, defer non-critical

##### Rendering Optimization
- **Virtual Scrolling**: For long lists
- **Memoization**: React.memo, useMemo, useCallback
- **Debouncing/Throttling**: For search and scroll events
- **Progressive Enhancement**: Core functionality without JS

#### 3.2 Backend Performance
"**后端性能优化**"

Optimize backend performance:

##### Database Optimization
```typescript
Indexing Strategy:
- Create indexes on frequently queried columns
- Composite indexes for multi-column queries
- Cover indexes for common queries
- Monitor index usage

Query Optimization:
- Use EXPLAIN to analyze query plans
- Avoid SELECT *, select only needed columns
- Use JOINs efficiently
- Implement pagination (LIMIT/OFFSET or cursor-based)

Connection Pooling:
- Use connection pooling (pg-pool for PostgreSQL)
- Configure appropriate pool size (usually 10-20)
- Handle connection errors gracefully
```

##### Caching Strategy
```typescript
Application Caching (Redis):
- Cache frequently accessed data:
  - User sessions
  - API responses
  - Database query results
  - Computed values

Cache Invalidation:
- Time-based expiration (TTL)
- Event-based invalidation (on data change)
- Cache coalescing (prevent thundering herd)

CDN Caching:
- Static assets: CSS, JS, images
- Cache headers:
  Cache-Control: public, max-age=31536000, immutable
- CDN for global distribution
```

##### Response Compression
```typescript
Compression:
- Gzip compression (default)
- Brotli compression (better, widely supported)
- Compress: JSON, HTML, CSS, JS
- Don't compress: Already compressed (images, zip)

Compression Config:
{
  threshold: 1024, // Only compress > 1KB
  level: 6, // Compression level (1-9)
  types: ['text/*', 'application/json', 'application/javascript']
}
```

#### 3.3 Scalability Design
"**可扩展性设计**

设计系统以支持增长："

##### Horizontal Scaling
```typescript
Load Balancing:
- Use L4/L7 load balancer (Nginx, HAProxy, ALB)
- Round-robin or least-connections algorithm
- Health checks (HTTP /health endpoint)
- Session stateless or sticky sessions

Application Scaling:
- Stateless application design
- Use session store (Redis) for session storage
- Use database connection pooling
- Consider serverless deployment for peak scaling
```

##### Database Scaling
- **Read Replicas**: Offload read queries to replicas
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Optimize slow queries
- **Future**: Sharding for write-heavy workloads

##### Async Processing
```typescript
Background Jobs:
- Email sending
- Image processing
- Data exports
- Webhook delivery

Queue Systems:
- RabbitMQ/Redis Queue: For MVP
- AWS SQS/Google Pub/Sub: For cloud deployment
- Celery (Python) / Bull (Node.js): Worker libraries
```

### 4. Monitoring & Observability
"**📊 监控和可观测性**

设计完整的监控方案："

#### 4.1 Application Monitoring
```typescript
Metrics to Track:
- Request rate: requests per second
- Response times: p50, p95, p99 latency
- Error rate: percentage of failed requests
- Server resources: CPU, memory, disk I/O
- Database metrics: query times, connection count
- Cache hit rates: Redis cache performance

Monitoring Tools:
- Prometheus + Grafana: Metrics and dashboards
- DataDog: All-in-one monitoring
- New Relic: Application performance monitoring
```

#### 4.2 Error Tracking
```typescript
Error Monitoring:
- Sentry: Error tracking and alerting
- LogRocket: Session replay for debugging
- Custom error logging: Centralized error logs

Alerts:
- Error spike: > 5% error rate
- Performance degradation: p95 latency > 1s
- Service unavailable: 5xx error spike
- Resource exhaustion: CPU > 90%, Memory > 90%
```

#### 4.3 Logging Strategy
```typescript
Logging Best Practices:
Log Levels:
- ERROR: Errors and exceptions
- WARN: Warning conditions
- INFO: Informational messages
- DEBUG: Detailed debugging info

Structured Logging:
{
  level: "INFO",
  timestamp: "2024-01-07T10:00:00Z",
  userId: "uuid",
  requestId: "uuid",
  action: "user_login",
  metadata: { ... }
}

Log Destinations:
- Development: Console
- Production: CloudWatch, Elasticsearch/ELK Stack, or managed service
```

#### 4.4 Health Checks
```typescript
Health Endpoints:

GET /health
Response: {
  status: "ok",
  uptime: 3600,
  timestamp: "2024-01-07T10:00:00Z"
}

GET /health/detailed
Response: {
  status: "ok",
  uptime: 3600,
  timestamp: "2024-01-07T10:00:00Z",
  checks: {
    database: { status: "ok", latency_ms: 5 },
    redis: { status: "ok", latency_ms: 1 },
    external_api: { status: "ok", latency_ms: 50 }
  }
}
```

### 5. Backup & Disaster Recovery
"**💾 备份和灾难恢复**

设计数据保护和恢复策略："

#### 5.1 Backup Strategy
```typescript
Backup Schedule:
- Database: Daily incremental, weekly full
- File Storage: Daily backup
- Configuration: Per commit (git)

Backup Types:
- Full Backup: Complete data backup
- Incremental Backup: Only changed data
- Point-in-Time Recovery: Restore to any point in time

Backup Storage:
- Multiple regions for redundancy
- Encrypted backup storage
- Retention policy: 30 days for daily, 1 year for monthly
```

#### 5.2 Recovery Strategy
```typescript
Recovery Procedures:
- RPO (Recovery Point Objective): < 1 hour of data loss
- RTO (Recovery Time Objective): < 4 hours to restore
- Documented runbooks for disaster recovery
- Regular restore drills/testing

Failover:
- Automated failover to standby region (multi-region setup)
- Graceful degradation if partially degraded
- Circuit breakers for external services
```

## DOCUMENTATION:

Update output file `{outputFile}`:

Add section:
```markdown
## 7. 安全与性能

### 7.1 安全架构

#### 认证授权安全
[MFA, password security, session management]

#### 数据保护
[Encryption at rest and transit, sensitive data handling]

#### 输入验证防护
[Validation, SQL injection prevention, XSS prevention]

#### API安全
[Rate limiting, headers, validation]

#### 合规性审计
[Audit logging, GDPR compliance]

### 7.2 性能优化

#### 前端性能
[Code optimization, asset optimization, rendering optimization]

#### 后端性能
[Database optimization, caching, compression]

#### 可扩展性
[Horizontal scaling, database scaling, async processing]

### 7.3 监控可观测性

#### 应用监控
[Metrics, monitoring tools]

#### 错误追踪
[Error monitoring, alerts]

#### 日志策略
[Structured logging, log levels]

#### 健康检查
[Health endpoint definitions]

### 7.4 备份恢复

#### 备份策略
[Backup schedule, types, storage]

#### 恢复策略
[RPO/RTO, failover procedures]
```

Update frontmatter:
```yaml
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
lastStep: 'security-performance'
```

## NEXT:

"**✅ 安全与性能方案完成**

我们设计了全面的安全架构和性能优化策略。

**🛡️ 安全要点**:
- 认证: `[MFA enabled]`
- 加密: `[TLS 1.3, AES-256]`
- 验证: `[Input validation and sanitization]`
- 合规: `[GDPR ready]`

**⚡ 性能要点**:
- 前端: `[Code splitting, lazy loading]`
- 后端: `[Caching, connection pooling]`
- 可扩展性: `[Stateless design, load balancing]`
- 监控: `[Prometheus, Sentry]`

**下一步**: 文档与交付 - 生成最终的架构文档和交接材料。"

## CRITICAL NOTES:

- Security should be built into design, not bolted on
- Defense in depth: multiple layers of security
- Monitor performance, don't just optimize
- Plan for failure: graceful degradation
- Document disaster recovery procedures
- Regular security audits and penetration testing
- Reference sidecar security and performance patterns
- Balance security with user experience
- Use security headers by default
- Implement rate limiting and throttling early
