# Code Quality Gate for AI-Generated Code

## Risk-Based Review Framework

### Risk Classification Matrix

| Code Area | Security Risk | Review Requirement |
|-----------|---------------|-------------------|
| **Critical Systems** | High | Level 4: Security team + automated + peer |
| Authentication/Authorization | High | Level 4: Security team + automated + peer |
| Payment/Financial | High | Level 4: Security team + automated + peer |
| Data Processing (PII/PHI) | High | Level 4: Security team + automated + peer |
| External API Integration | Medium | Level 3: Automated + senior peer |
| Business Logic | Medium | Level 3: Automated + senior peer |
| Database Operations | Medium | Level 3: Automated + senior peer |
| UI Components | Low | Level 2: Automated + peer |
| Configuration/Documentation | Low | Level 1: Automated only |

## Four-Tier Review Process

### Level 1: Automated Pre-Commit (All AI Code)
**Required Tools:**
```yaml
pre_commit_hooks:
  - secret_detection: true
  - security_linting: true  
  - ai_code_flagging: true
  - basic_syntax_check: true
  
auto_fail_criteria:
  - exposed_secrets: true
  - critical_security_issues: true
  - syntax_errors: true
```

**Checklist:**
- [ ] No hardcoded secrets or credentials
- [ ] Basic syntax and style compliance
- [ ] Security linter passes (no critical issues)
- [ ] AI-generated code properly flagged for human review

### Level 2: CI/CD Pipeline (Medium+ Risk Code)
**Required Analysis:**
```yaml
sast_analysis:
  tools: [Semgrep, SonarQube, Snyk]
  fail_criteria: "High severity or above"
  
dependency_check:  
  tools: [OWASP Dependency-Check]
  fail_on_cvss: 7.0
  
coverage_check:
  min_coverage: 80%
  ai_code_requires_tests: true
```

**Quality Gates:**
- [ ] SAST scan complete with no high/critical issues
- [ ] All dependencies have CVSS < 7.0
- [ ] Test coverage ≥80% for AI-generated functions
- [ ] No OWASP Top 10 vulnerability patterns detected

### Level 3: Enhanced Peer Review (Medium Risk Code)
**Review Checklist:**
- [ ] **Functionality:** Code meets stated requirements accurately
- [ ] **Security:** No injection vulnerabilities, proper input validation
- [ ] **Architecture:** Follows established patterns and design principles
- [ ] **Performance:** No obvious bottlenecks or inefficient algorithms
- [ ] **Maintainability:** Code is readable, well-structured, adequately commented
- [ ] **Testing:** Comprehensive test coverage including edge cases
- [ ] **Documentation:** Complex logic properly explained

**AI-Specific Review Points:**
- [ ] Human reviewer understands the AI-generated logic
- [ ] AI suggestions align with project coding standards
- [ ] No obvious AI hallucinations or incorrect assumptions
- [ ] Business logic validation beyond syntactic correctness

### Level 4: Security Team Review (High Risk Code)
**Security-Focused Checklist:**
- [ ] **Authentication:** Proper implementation of auth mechanisms
- [ ] **Authorization:** Correct access control and permission checks  
- [ ] **Data Protection:** Encryption, sanitization, secure storage
- [ ] **Input Validation:** Comprehensive input filtering and validation
- [ ] **Error Handling:** No information leakage in error messages
- [ ] **Cryptography:** Proper use of crypto libraries and algorithms
- [ ] **Compliance:** Meets regulatory requirements (GDPR, PCI-DSS, etc.)

**Required Documentation:**
- [ ] Security impact assessment completed
- [ ] Threat model updated if architectural changes
- [ ] Security test cases added to test suite
- [ ] Incident response procedures reviewed if applicable

## Automated Quality Monitoring

### Dashboard Metrics
```markdown
## AI Code Quality Dashboard

### Daily Metrics
- AI code generation volume (lines/day)
- Review cycle time by risk level
- Quality gate pass/fail rates
- Security issue detection rate

### Weekly Trends
- AI suggestion acceptance rates
- Bug rates (AI vs human-written code)
- Time to merge for AI-assisted PRs
- Developer satisfaction scores

### Monthly Analysis  
- Security vulnerability trends
- Tool effectiveness analysis
- Process improvement opportunities
- Team maturity progression
```

### Alert Thresholds
- **Critical Alert:** High-risk AI code bypassing security review
- **Warning Alert:** >30% quality gate failures in AI code
- **Notice Alert:** AI suggestion acceptance rate <20% or >80%

## Team Implementation Guide

**Week 1-2: Foundation**
- Configure automated tools and quality gates
- Train team on risk classification matrix
- Establish baseline metrics

**Week 3-4: Process Integration**
- Practice review workflows on non-production code  
- Calibrate review criteria with actual examples
- Refine alert thresholds based on initial data

**Month 2: Optimization**
- Analyze metrics and adjust process
- Update tool configurations based on false positive rates
- Expand to additional teams or code areas

**Ongoing: Continuous Improvement**
- Monthly process retrospectives
- Quarterly security review of AI code patterns
- Annual evaluation of tools and frameworks