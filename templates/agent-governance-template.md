# Agent Governance Template

## 1) MCP Server Approval Process
- Owner: ______________________________
- Allowed scopes: __Filesystem__ / __Network__ / __Secrets__ / __Tools__ (cross out disallowed)
- Approval steps:
  - [ ] Security review (mcp-config-scan) completed
  - [ ] Data handling evaluated (PII/PHI?)
  - [ ] Expiry / re-approval date: ____________________
  - [ ] Logging enabled (requests + responses)
- Rollback: disable server + revoke tokens if drift detected.

## 2) Agent Permission Boundaries
- Allowed tasks for autonomous agents:
  - [ ] Docs / tests / code cleanup
  - [ ] Refactors with coverage
  - [ ] Release automation (bounded)
- Disallowed without human approval:
  - [ ] Secrets handling
  - [ ] Infra changes
  - [ ] Schema/data migrations
  - [ ] Production config changes
- Blast radius guardrails:
  - [ ] Repo paths limited to: ______________________________________
  - [ ] Max runtime: ____________
  - [ ] Kill switch contact: ___________________

## 3) Review Workflow for Agent-Generated PRs
- Required attachments:
  - [ ] Agent change log (actions, prompts, tools used)
  - [ ] Tests + results
  - [ ] MCP servers used + scopes
  - [ ] Rollback steps
- Review path:
  - [ ] Risk classification: Low / Med / High
  - [ ] Reviewer assigned (human owner): ___________________
  - [ ] Additional reviewers (security/architecture) if High

## 4) Incident Response for Agent Mistakes
- Triage owner: ___________________ | Severity: Low / Med / High
- Steps:
  - [ ] Revert/rollback applied
  - [ ] Access tokens rotated (if needed)
  - [ ] MCP server scopes audited
  - [ ] Postmortem completed (date): ____________
- Prevention actions:
  - [ ] New guardrail added
  - [ ] Tests/playbooks updated
  - [ ] Training/communication scheduled

## 5) Agent Tool & MCP Security Checklist
- [ ] MCP configs scanned (`mcp-config-scan`) before enablement
- [ ] Server allowlist stored in repo + expiry dates tracked
- [ ] Secrets stored in vault; no inline secrets in configs
- [ ] Logs retained for agent actions and MCP calls
- [ ] Least privilege enforced for each task type
- [ ] Human approvals captured for elevated actions
- [ ] Autonomy limited to pre-approved task list
