# Risk Matrix Template

Use this template to assess and document project risks.

## Risk Assessment Framework

### Risk Probability
- **极低 (1)**: < 10% chance
- **低 (2)**: 10-30% chance
- **中 (3)**: 30-50% chance
- **高 (4)**: 50-70% chance
- **极高 (5)**: > 70% chance

### Risk Impact
- **低 (1)**: Minor inconvenience, minimal cost impact
- **中 (2)**: Moderate delay/cost increase (< 10%)
- **高 (3)**: Significant delay/cost increase (10-30%)
- **极高 (4)**: Critical impact (> 30%), may threaten project

## Risk Matrix

```
Impact   | 极低 | 低  | 中  | 高  | 极高
Probability|  1  |  2 |  3 |  4 |   5
----------|-----|----|----|----|-----
极低(1)   |  1  |  2 |  3 |  4 |   5
低(2)     |  2  |  4 |  6 |  8 |  10
中(3)     |  3  |  6 |  9 | 12 |  15
高(4)     |  4  |  8 | 12 | 16 |  20
极高(5)   |  5  | 10 | 15 | 20 |  25

Risk Score = Probability × Impact
- Low Risk: 1-5
- Medium Risk: 6-15
- High Risk: 16-25
```

## Risk Register Template

| ID | Risk | Category | Probability | Impact | Score | Owner | Mitigation Strategy | Status |
|----|------|----------|-------------|--------|-------|-------|---------------------|--------|
| R1 | [Description] | [Tech/Resource/Schedule/Market] | [1-5] | [1-4] | [Score] | [Name] | [Strategy] | [Open/Mitigated/Closed] |
| R2 | [Description] | [Tech/Resource/Schedule/Market] | [1-5] | [1-4] | [Score] | [Name] | [Strategy] | [Open/Mitigated/Closed] |

## Example: Risk Register

| ID | Risk | Category | Probability | Impact | Score | Owner | Mitigation Strategy | Status |
|----|------|----------|-------------|--------|-------|-------|---------------------|--------|
| R1 | 新技术栈学习曲线 | Technical | 4 | 2 | 8 | Atlas | 提前2周培训，文档化 | Mitigated |
| R2 | 范围蔓延 | Schedule | 4 | 3 | 12 | Chen | 严格变更流程 | Open |
| R3 | 关键人员离职 | Resource | 2 | 4 | 8 | Chen | 知识文档化 | Mitigated |
| R4 | 第三方API变更 | Technical | 3 | 3 | 9 | Atlas | 实现fallback | Open |
| R5 | 预算超支 | Resource | 3 | 3 | 9 | Alex | 15%缓冲预留 | Mitigated |

## Risk Response Strategies

### For High Risk (Score 16-25): Avoid/Eliminate
- Change project approach to eliminate risk
- Redefine project to remove risk source
- Find alternative solutions

### For Medium-High Risk (Score 10-15): Mitigate
- Reduce probability through preventive actions
- Reduce impact through contingency plans
- Transfer risk to third party (insurance/outsourcing)

### For Medium Risk (Score 6-9): Accept and Monitor
- Acknowledge risk
- Monitor risk indicators
- Have contingency plans ready

### For Low Risk (Score 1-5): Accept
- Document risk
- Periodically review
- No active response needed
