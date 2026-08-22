(function () {
  'use strict';

  window.PORTFOLIO_PROJECT_SOURCES = window.PORTFOLIO_PROJECT_SOURCES || {};
  window.PORTFOLIO_PROJECT_SOURCES['agentic-harness-builder.html'] = [
    {
      label: 'HarnessLab repository',
      url: 'https://github.com/yashumani/harnesslab',
      note: 'Primary implementation, test, deployment, and current-state evidence for the case study.'
    },
    {
      label: 'HarnessLab product requirements',
      url: 'https://github.com/yashumani/harnesslab/blob/main/docs/product/PRD.md',
      note: 'Defines the intended user journey, V1 outcome, and explicit non-goals. Roadmap requirements are not presented as completed features.'
    },
    {
      label: 'Bounded Temporary Architecture Critic',
      url: 'https://github.com/yashumani/harnesslab/blob/main/docs/architecture/TEMPORARY_CRITIC.md',
      note: 'Primary specification for the one-worker, one-call, no-tools temporary critic and deterministic finding-acceptance policy.'
    },
    {
      label: 'Model Context Protocol — Introduction',
      url: 'https://modelcontextprotocol.io/docs/getting-started/intro',
      note: 'Published protocol referenced by HarnessLab architecture guidance. The current release recommends MCP where appropriate but does not execute MCP tools.'
    },
    {
      label: 'A2A Protocol project',
      url: 'https://github.com/a2aproject/A2A',
      note: 'Published agent-to-agent interoperability work referenced by the planner. Live A2A peer execution remains roadmap work in HarnessLab.'
    }
  ];
})();
