window.HAI = [
  { id: 'A', name: 'Probabilistic Foundation', blurb: 'Design for inference, generation, and variability.',
    items: [
      { n: 1, t: 'Use AI only where it has a comparative advantage.', x: 'Linear keeps status and permissions deterministic; AI only on messy threads.' },
      { n: 2, t: 'Design for generative variability — don’t fight it.', x: 'Midjourney returns a grid of four, turning variance into choice.' },
      { n: 3, t: 'Choose the interaction pattern based on the task.', x: 'Notion: inline rewrite for small edits, panel for open questions.' }
    ]},
  { id: 'B', name: 'Expectation Setting', blurb: 'Clarify capability, limits, and AI involvement early.',
    items: [
      { n: 4, t: 'State what the system can do — and where its limits are.', x: 'ChatGPT should say when it cannot see a file or inbox.' },
      { n: 5, t: 'Solve the blank-canvas problem.', x: 'Canva Magic Design shows template directions on first prompt.' },
      { n: 6, t: 'Frame output as a starting point.', x: 'Gmail Gemini is a draft, not a sent message.' },
      { n: 7, t: 'Signal the AI’s role explicitly.', x: 'Meta labels AI-edited content with “AI info.”' },
      { n: 8, t: 'Adapt explanation and control to user expertise.', x: 'Copilot: ghost text for novices, agent mode for experts.' },
      { n: 9, t: 'Represent the AI’s nature honestly.', x: 'Anti-pattern: Ryanair’s human-headshot “AI Travel Assistant.”' }
    ]},
  { id: 'C', name: 'Calibrated Trust', blurb: 'Align user reliance with system reliability.',
    items: [
      { n: 10, t: 'Provide provenance for claims, tools, and data.', x: 'Perplexity numbers citations in the answer.' },
      { n: 11, t: 'Prefer provenance over confidence scores.', x: 'Consensus AI shows papers, not a trust meter.' },
      { n: 12, t: 'Make output cheap to verify.', x: 'NotebookLM: hover a citation, see the passage.' },
      { n: 13, t: 'The system must not run its own agenda.', x: 'Anti-pattern: Alexa “By the way” upsells.' },
      { n: 14, t: 'Don’t be sycophantic — design for honest pushback.', x: 'Claude is trained to correct a false premise.' },
      { n: 15, t: 'Respect creators and attribution.', x: 'Firefly Content Credentials vs contested training data.' }
    ]},
  { id: 'D', name: 'Transparency', blurb: 'Make reasoning and evidence inspectable when needed.',
    items: [
      { n: 16, t: 'Answer the five intelligibility questions.', x: 'Base44: files changed + live preview.' },
      { n: 17, t: 'Use progressive disclosure for explanations.', x: 'Arc Search: short answer, then “more detail.”' },
      { n: 18, t: 'Show plans and traces for multi-step work.', x: 'Cursor plan mode before it edits the repo.' }
    ]},
  { id: 'E', name: 'Control & Agency', blurb: 'Make accept, reject, edit, undo, and override easy.',
    items: [
      { n: 19, t: 'Make AI assistance easy to accept — and easier to ignore.', x: 'Copilot: Tab accept, Esc or keep typing to reject.' },
      { n: 20, t: 'Ask, don’t guess, when uncertain.', x: 'Claude offers a specific fork, not “more context?”' },
      { n: 21, t: 'Give global and granular controls.', x: 'ChatGPT custom instructions vs one-off prompts.' },
      { n: 22, t: 'Time interventions to attention.', x: 'Gmail Smart Compose while composing, not on a timer.' },
      { n: 23, t: 'Make AI assistance accessible and inspectable.', x: 'Be My Eyes: AI description, escalate to a human.' },
      { n: 24, t: 'Show whose rule the system is following.', x: 'Google My Ad Center: this is an ad setting, not organic.' }
    ]},
  { id: 'F', name: 'Graceful Failure', blurb: 'Make uncertainty, error, and escalation recoverable.',
    items: [
      { n: 25, t: 'Contain the damage when the AI is wrong.', x: 'Replit Agent: checkpoint, preview, rollback.' },
      { n: 26, t: 'Reduce precision when the evidence is weak.', x: 'Grammarly: soft suggestion, not a rewrite.' },
      { n: 27, t: 'Design the human handoff.', x: 'Intercom Fin routes to support with context kept.' },
      { n: 28, t: 'Design the refusal path with good intent.', x: 'ChatGPT names the limit and a safer next step.' }
    ]},
  { id: 'G', name: 'Co-Creation', blurb: 'Treat output as a draft, not a verdict.',
    items: [
      { n: 29, t: 'Keep generated output malleable.', x: 'Gemini Canvas: type into the document, rewrite a passage.' },
      { n: 30, t: 'Use friction to improve judgment, not to slow exploration.', x: 'Salesforce: pause before customer-facing send.' },
      { n: 31, t: 'Help users specify intent.', x: 'Midjourney: aspect, stylize, weirdness as controls, not prompt lore.' }
    ]},
  { id: 'H', name: 'Responsible Autonomy', blurb: 'Constrain action by stakes, reversibility, and permission.',
    items: [
      { n: 32, t: 'Bound autonomy by reversibility and stakes.', x: 'Claude Code reads freely, asks before delete or shell.' },
      { n: 33, t: 'Make data use explicit, permissioned, and revocable.', x: 'Apple Intelligence frames on-device context as a product fact.' },
      { n: 34, t: 'Protect third-party privacy.', x: 'Street View blurs faces of people who never opted in.' },
      { n: 35, t: 'Separate instructions, data, tools, and actions.', x: 'Claude Slack: search always-allow, draft-message needs approval.' }
    ]},
  { id: 'I', name: 'Sustained Reliance', blurb: 'Govern quality, drift, ownership, and change over time.',
    items: [
      { n: 36, t: 'Design the wait, not just the result.', x: 'Perplexity: Searching → Reading → Writing, sources as they arrive.' },
      { n: 37, t: 'Make compute effort visible where it affects behavior.', x: 'Claude Effort: slower, deeper, uses limits faster.' },
      { n: 38, t: 'Measure reliance, not just usage.', x: 'High accept rate may be overreliance, not success.' },
      { n: 39, t: 'Design for model and data changes.', x: 'Cursor: pick the model; treat a swap like a dependency upgrade.' }
    ]}
]
