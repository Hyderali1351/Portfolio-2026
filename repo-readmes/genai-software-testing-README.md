# GenAI for Software Testing

> Co-authored research exploring LLM-based automated unit test generation using graph-structured code representations.

---

## Overview

This project investigates using **Generative AI to augment graph-based unit test generation**. Source code is parsed into call graphs and control-flow graphs (CFGs), encoding structural relationships between functions and execution paths. These graphs are used as rich contextual prompts for large language models — enabling generated tests that exercise deeper execution paths than conventional auto-generated suites.

**Result:** 78% valid test coverage with minimal human input across real-world codebases.

---

## Approach

```
Source Code
    │
    ▼
AST / CFG Parser
    │
    ▼
Graph Model  ──────► Structural Context (nodes, edges, paths)
    │
    ▼
LLM Prompt (GPT-4 / CodeLlama)
    │
    ▼
Generated Unit Tests  ──► Coverage Analysis
```

---

## Models Evaluated

| Model | Type | Valid Test Rate |
|---|---|---|
| GPT-4 | Closed-source LLM | 78% |
| CodeLlama-34B | Open-source code LLM | 61% |
| Baseline (no graph context) | Naive prompt | 34% |

Graph-augmented prompting improved valid test generation by **~2.3× over baseline** across the evaluated codebases.

---

## Tech Stack

- **Python** — parsing, graph construction, evaluation pipeline
- **OpenAI API** — GPT-4 inference
- **LangChain** — prompt orchestration and chain management
- **NetworkX** — call graph and CFG construction
- **Tree-sitter** — language-agnostic AST parsing
- **pytest** — test execution and coverage measurement

---

## Key Findings

- Graph-structured context significantly outperforms raw source code prompting
- Call graph paths correlate strongly with edge-case test discovery
- CodeLlama benefits more from graph context than GPT-4 (relative gain: +41% vs +18%)
- Hallucination rate drops when structural constraints are included in the prompt

---

## Research Publication

This work was co-authored as part of graduate research at Lewis University.  
Published: *"The Use of GenAI in Graph-Based Unit Testing"*

---

*Mir Hyder Ali · [LinkedIn](https://www.linkedin.com/in/mir-hyder-ali) · [Portfolio](https://mirhyderali.com)*
