# Agent Governance Template

## 1) MCP Server Approval Process
- Owner: ______________________________
- Allowed scopes: __Filesystem__ / __Network__ / __Secrets__ / __Tools__ (cross out disallowed)
- Enterprise allowlist entry (`allowedMcpServers` / `deniedMcpServers` in `copilot/managed-settings.json`): __________________
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
  - [ ] Agent change log (actions, prompts, tools used, session link)
  - [ ] Tests + results
  - [ ] MCP servers used + scopes
  - [ ] Agent self-review and security review output (cloud agent / Copilot app / `/security-review`)
  - [ ] Rubber Duck (cross-model) findings for Medium/High risk diffs
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
- [ ] Skills and plugins reviewed like code (pinned versions, marketplace on the allowed list)

## 6) Copilot App, CLI & Enterprise Managed Settings
- Copilot app access policy: __Enabled everywhere__ / __Disabled everywhere__ / __Let organizations decide__
- Copilot CLI access policy: __Enabled__ / __Disabled__ (separate from the app policy since July 2026)
- Managed settings owner (`.github-private` → `copilot/managed-settings.json`): ___________________
- Policies set:
  - [ ] MCP allowlist (`allowedMcpServers` / `deniedMcpServers`)
  - [ ] Allowed plugins and marketplaces (`enabledPlugins`, `extraKnownMarketplaces`)
  - [ ] Approval-prompt bypass: __allowed__ / __blocked__
  - [ ] Sandbox policy and proxy enforcement for local sessions
  - [ ] Model policy reviewed (new models default on for enterprise since Aug 2026)
- Local session hygiene:
  - [ ] One session per worktree; no shared working tree between agents
  - [ ] Cloud sessions only in repos with branch protection
  - [ ] BYOK providers approved by security

## 7) Agent Merge & Automations
- Agent Merge is **off** until the review workflow above is in place.
- When enabled, the agent may (tick what applies per repo):
  - [ ] Fix failing CI checks
  - [ ] Respond to review comments
  - [ ] Merge once required checks and approvals pass
- Never allowed to merge without a human on: __security__ / __infra__ / __schema__ / __billing__ paths
- Automations (scheduled or background tasks):
  - [ ] Each automation has an owner, a prompt in version control, and a max blast radius
  - [ ] Outputs land as PRs, never direct pushes to protected branches
  - [ ] Monthly review of automation runs, cost (premium requests), and failures
