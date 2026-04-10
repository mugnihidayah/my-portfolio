export interface ArchitectureNode {
  id: string;
  label: string;
  type: "external" | "backend" | "core" | "database" | "service";
  position: { x: number; y: number };
  mobilePosition: { x: number; y: number };
  description: string;
  details: string[];
}

export interface ArchitectureEdge {
  from: string;
  to: string;
}

export interface Architecture {
  description: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

export interface ResponsiveNumberValue {
  mobile?: number;
  desktop?: number;
}

export interface ResponsiveStringValue {
  mobile?: string;
  desktop?: string;
}

export interface ProjectImageLayout {
  position?: string;
  featuredHeight?: ResponsiveNumberValue;
  cardHeight?: ResponsiveNumberValue;
  detailHeight?: ResponsiveNumberValue;
  featuredMaxWidth?: ResponsiveStringValue;
  cardMaxWidth?: ResponsiveStringValue;
  detailMaxWidth?: ResponsiveStringValue;
}

export interface ProjectCaseStudy {
  problem: string[];
  constraints: string[];
  role: string[];
  decisions: string[];
  stackRationale: string[];
  results: string[];
  nextImprovements: string[];
}

export interface ProjectArtifactFlowStep {
  title: string;
  detail: string;
}

export interface ProjectCaseStudyArtifacts {
  snapshotTitle: string;
  snapshotCaption: string;
  flowTitle: string;
  flowSteps: ProjectArtifactFlowStep[];
  outputTitle: string;
  outputCaption: string;
  outputLanguage: "text" | "json" | "markdown";
  outputSnippet: string;
}

export interface ProjectProofMetric {
  label: string;
  value: string;
  detail: string;
}

export interface ProjectFlowStep {
  title: string;
  description: string;
}

export interface ProjectBeforeAfter {
  before: string;
  after: string;
  impact: string;
}

export interface ProjectVisualProof {
  summary: string;
  metrics: ProjectProofMetric[];
  flow: ProjectFlowStep[];
  beforeAfter: ProjectBeforeAfter;
}

export interface ProjectTrustMetric {
  label: string;
  value: string;
  detail: string;
}

export interface ProjectTrustLink {
  label: string;
  status: "available" | "limited" | "private";
  note: string;
}

export interface ProjectTrustContent {
  scope: string[];
  tradeoffs: string[];
  metrics: ProjectTrustMetric[];
  links: {
    github: ProjectTrustLink;
    demo: ProjectTrustLink;
  };
}

export type ProjectDomain = "GenAI / LLMs" | "Computer Vision" | "Data Analytics";

export interface Project {
  title: string;
  slug: string;
  description: string;
  longDescription: string[];
  features: string[];
  techStack: string[];
  domains: ProjectDomain[];
  github?: string;
  demo?: string;
  videoUrl?: string;
  image?: string;
  imageLayout?: ProjectImageLayout;
  status: "completed" | "in-progress" | "archived";
  featured?: boolean;
  architecture?: Architecture;
  caseStudy?: ProjectCaseStudy;
  artifacts?: ProjectCaseStudyArtifacts;
  visualProof?: ProjectVisualProof;
  trust?: ProjectTrustContent;
}

export const projectDomainFilters = [
  "All",
  "GenAI / LLMs",
  "Computer Vision",
  "Data Analytics",
] as const;

export type ProjectDomainFilter = typeof projectDomainFilters[number];

export const projects: Project[] = [
  {
    title: "Synapse RAG",
    slug: "synapse",
    description:
      "A multimodal Agentic RAG API for document Q&A with ReAct-style reasoning, hybrid retrieval, OCR ingestion, and production-grade controls.",
    longDescription: [
      "Synapse is a multimodal document intelligence API built for grounded question-answering across PDFs, DOCX, TXT, and image files. It features an Agentic RAG mode with a ReAct-style agent capable of multi-step reasoning and dynamic tool use, alongside a standard RAG pipeline with hybrid retrieval, reranking, and citation-rich answers through a FastAPI backend.",
      "The system is designed with production-grade features from the start: API key authentication, rate limiting, daily query quotas, usage analytics, metadata filters at query time, session exports, structured per-file ingestion outcomes, SSE streaming, and a lightweight evaluation harness with exact match, token F1, grounding score, and source recall metrics. It uses PostgreSQL with pgvector for retrieval, is containerized with Docker, tested with CI via GitHub Actions, and deployed on Hugging Face Spaces.",
    ],
    features: [
      "Multimodal ingestion for PDF, DOCX, TXT, and image files with RapidOCR and optional table extraction",
      "Agentic RAG mode with ReAct-style agent supporting multi-step reasoning and dynamic tool use (retrieve, compare, summarize, refine)",
      "Hybrid retrieval with vector search, keyword search, Cohere/local reranking, dynamic top-k, and MMR diversification",
      "Grounded answers with citations, query rewriting, strict grounding guardrails, and SSE streaming",
      "Async ingestion pipeline with structured per-file outcomes and five-state status tracking (queued, processing, ready, ready_with_warnings, failed)",
      "Lightweight evaluation harness with exact match, token F1, grounding score, and source recall metrics",
      "API key auth, rate limiting, daily query quotas, usage analytics, feedback endpoint, and session export tools",
    ],
    techStack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "LangChain",
      "Groq",
      "HuggingFace",
      "Docker",
      "GitHub Actions",
    ],
    domains: ["GenAI / LLMs"],
    github: "https://github.com/mugnihidayah/synapse-instant-document-insight",
    demo: "https://synapse-rag.vercel.app/",
    videoUrl: "https://youtu.be/KQKeUPMTZvQ",
    image: "/projects/synapse-rag-v2.jpg",
    imageLayout: {
      position: "center top",
      featuredHeight: { mobile: 220, desktop: 320 },
      detailHeight: { mobile: 240, desktop: 420 },
      featuredMaxWidth: { desktop: "84%" },
    },
    status: "in-progress",
    featured: true,
    caseStudy: {
      problem: [
        "Document Q&A tools often break down once files come from different formats, include scans, or require reliable citations backed by multi-step reasoning.",
        "Many RAG demos feel good in notebooks but are missing the operational pieces needed for real usage such as auth, quotas, ingestion feedback, evaluation, and monitoring.",
      ],
      constraints: [
        "The system had to support mixed document types, OCR-heavy inputs, agentic reasoning, and retrieval quality without turning the stack into something overly hard to run locally.",
        "I wanted it to feel closer to a product than a demo, so auth, quotas, observability, evaluation, structured ingestion outcomes, and CI had to be part of the design from the beginning.",
      ],
      role: [
        "Owned the end-to-end system design, backend implementation, retrieval pipeline, agent orchestration, evaluation harness, CI pipeline, and deployment to Hugging Face Spaces.",
        "Designed the ingestion workflow, retrieval strategy, agentic RAG mode, schema choices, and the full API surface for querying, analytics, and export.",
      ],
      decisions: [
        "I chose an async ingestion pipeline with structured per-file outcomes and five-state status tracking so uploads stay inspectable instead of failing as a black box.",
        "I combined vector retrieval, keyword retrieval, Cohere reranking, and MMR because retrieval quality mattered more here than keeping the implementation minimal.",
        "I added a ReAct-style agentic mode so the system could handle questions requiring multi-step reasoning, comparison, and summarization beyond single-pass retrieval.",
        "I treated auth, rate limiting, daily quotas, evaluation, and CI as first-class features so the project reflects how an AI backend behaves in production.",
      ],
      stackRationale: [
        "FastAPI fit well because the project needed a clear API surface, async workflows, SSE streaming, and good control over ingestion and query endpoints.",
        "PostgreSQL plus pgvector gave me semantic retrieval without introducing another database system, which kept the infrastructure simpler and more portable.",
        "LangChain helped move faster on retrieval and agent orchestration, while the ReAct agent added multi-step reasoning without overcomplicating the architecture.",
        "GitHub Actions provided automated CI with linting, type checking, and tests on every push, ensuring code quality as the system grew.",
      ],
      results: [
        "Delivered a working multimodal Agentic RAG product with grounded answers, citations, streaming, session exports, evaluation metrics, and production-oriented controls.",
        "Turned a raw LLM prototype into a backend that is easier to evaluate, extend, and deploy, with a live API on Hugging Face Spaces and CI running on every commit.",
      ],
      nextImprovements: [
        "I would add distributed background workers for ingestion instead of in-process tasks, and streamed uploads to reduce memory pressure on large files.",
        "I would expand the evaluation harness into an automated regression suite tied to CI so retrieval and agent quality changes can be caught before deployment.",
      ],
    },
    artifacts: {
      snapshotTitle: "Application Snapshot",
      snapshotCaption:
        "A product-like document workspace showing upload sessions, agentic reasoning, retrieval quality, grounded answers, and the controls needed to operate the system beyond a simple demo.",
      flowTitle: "Input -> System -> Output",
      flowSteps: [
        {
          title: "Input",
          detail:
            "Users upload PDFs, DOCX, TXT, or images via the async pipeline, then ask questions with optional metadata filters, agent mode, and query controls.",
        },
        {
          title: "System",
          detail:
            "Synapse runs OCR-aware ingestion, hybrid retrieval with reranking, and either standard grounding or a ReAct agent with multi-step tool use before generating the answer.",
        },
        {
          title: "Output",
          detail:
            "The API returns citation-backed answers (streamed via SSE or non-streaming), session status, usage analytics, and export tools.",
        },
      ],
      outputTitle: "Agentic RAG Output",
      outputCaption:
        "A realistic example of the agentic answer shape with multi-step reasoning, grounding metadata, and source citations.",
      outputLanguage: "json",
      outputSnippet: `{
  "question": "Summarize key risks and compare with Q1",
  "answer": "The primary risk shifted from supply-chain delays in Q1 to regulatory compliance costs in Q2, with a 15% increase in projected mitigation spend.",
  "citations": [
    { "chunk_id": "chunk_abc", "document_id": "doc456", "source": "risk-report.pdf", "page": 3 },
    { "chunk_id": "chunk_def", "document_id": "doc789", "source": "q1-summary.pdf", "page": 7 }
  ],
  "meta": {
    "retrieval": "hybrid + rerank",
    "agent_mode": true,
    "agent_steps": 3,
    "grounded": true
  }
}`,
    },
    trust: {
      scope: [
        "Owned system design, backend implementation, ingestion flow, retrieval pipeline, agent orchestration, evaluation harness, CI setup, and deployment.",
        "Implemented production-minded controls including auth, rate limiting, daily quotas, SSE streaming, usage analytics, feedback, and session exports.",
      ],
      tradeoffs: [
        "Kept the infrastructure simpler with PostgreSQL plus pgvector instead of splitting retrieval across multiple storage systems, accepting some scale limits in exchange for portability.",
        "Accepted extra pipeline complexity by adding agentic reasoning and hybrid retrieval in exchange for significantly better answer quality on multi-step questions.",
        "Used in-process background tasks for async ingestion instead of a distributed worker, keeping the system easy to run locally at the cost of horizontal scalability.",
      ],
      metrics: [
        {
          label: "Supported inputs",
          value: "5 formats",
          detail: "Handles PDF, DOCX, TXT, PNG/JPG/JPEG, and WEBP files with RapidOCR and optional table extraction.",
        },
        {
          label: "Retrieval shape",
          value: "Hybrid + rerank + agent",
          detail: "Combines vector search, keyword search, Cohere/local reranking, MMR, and a ReAct agentic mode for multi-step reasoning.",
        },
        {
          label: "Operational layer",
          value: "Auth + quotas + CI",
          detail: "Includes API keys, rate limiting, daily query quotas, usage analytics, feedback, session exports, evaluation harness, and GitHub Actions CI.",
        },
      ],
      links: {
        github: {
          label: "GitHub repository",
          status: "available",
          note: "Public repository with full source, CI badge, and implementation details.",
        },
        demo: {
          label: "Live API + Frontend",
          status: "available",
          note: "API deployed on Hugging Face Spaces with interactive docs. Frontend available separately.",
        },
      },
    },
    visualProof: {
      summary:
        "This project proves I can build a production-grade Agentic RAG backend by combining multimodal ingestion, hybrid retrieval, multi-step agent reasoning, evaluation, CI, and operational controls in one deployed system.",
      metrics: [
        {
          label: "Input coverage",
          value: "5 formats",
          detail: "Supports PDF, DOCX, TXT, and image inputs (PNG/JPG/JPEG/WEBP) with RapidOCR.",
        },
        {
          label: "Retrieval strategy",
          value: "Hybrid + rerank + agent",
          detail: "Uses vector search, keyword search, reranking, MMR, and a ReAct agent for multi-step queries.",
        },
        {
          label: "Quality assurance",
          value: "Eval + CI",
          detail: "Includes an evaluation harness (exact match, token F1, grounding, source recall) and GitHub Actions CI with linting, type checks, and tests.",
        },
      ],
      flow: [
        {
          title: "Ingest mixed documents",
          description:
            "Files move through async ingestion with RapidOCR, table extraction, and structured per-file outcomes with five-state status tracking.",
        },
        {
          title: "Retrieve and reason",
          description:
            "The query pipeline combines hybrid retrieval, reranking, and optionally a ReAct agent that can retrieve, compare, summarize, and refine across multiple steps.",
        },
        {
          title: "Return grounded answers",
          description:
            "The backend responds with citation-aware answers via SSE streaming or standard JSON, plus the operational controls needed for a realistic product workflow.",
        },
      ],
      beforeAfter: {
        before:
          "A typical RAG demo can answer questions from a single retrieval pass, but often has fragile ingestion, no agentic reasoning, weak grounding, and no operational visibility.",
        after:
          "Synapse behaves as a deployable Agentic RAG backend with multimodal ingestion, multi-step reasoning, grounded streaming responses, evaluation metrics, CI, and product-style controls.",
        impact:
          "The project shows not just prompt and retrieval usage, but architecture thinking across agent design, evaluation, API design, CI, and production ergonomics.",
      },
    },
    architecture: {
      description:
        "Flow from document upload and ingestion to agentic question answering with hybrid retrieval",
      nodes: [
        {
          id: "user",
          label: "User",
          type: "external",
          position: { x: 0, y: 100 },
          mobilePosition: { x: 80, y: 0 },
          description:
            "Client uploads documents, manages sessions, and submits questions with optional agent mode and query controls",
          details: [
            "Uploads documents for a session",
            "Queries with metadata filters, agent mode, and debug flags",
            "Views grounded answers with citations via SSE or JSON",
          ],
        },
        {
          id: "fastapi",
          label: "FastAPI",
          type: "backend",
          position: { x: 180, y: 100 },
          mobilePosition: { x: 80, y: 120 },
          description:
            "REST API layer for auth, validation, session management, SSE streaming, and non-streaming responses",
          details: [
            "API key authentication, rate limiting, and daily query quotas",
            "Upload, query, streaming, feedback, and export endpoints",
            "Structured JSON logging and request validation",
          ],
        },
        {
          id: "ingestion",
          label: "Ingestion + OCR",
          type: "core",
          position: { x: 380, y: 20 },
          mobilePosition: { x: 0, y: 250 },
          description:
            "Async pipeline that processes uploaded files into searchable chunks with RapidOCR and optional table extraction",
          details: [
            "Supports PDF, DOCX, TXT, and image inputs (PNG/JPG/JPEG/WEBP)",
            "Five-state status tracking: queued, processing, ready, ready_with_warnings, failed",
            "Per-file warnings and structured ingestion outcomes",
          ],
        },
        {
          id: "retrieval",
          label: "Hybrid Retrieval",
          type: "core",
          position: { x: 380, y: 110 },
          mobilePosition: { x: 160, y: 250 },
          description:
            "RAG pipeline that combines retrieval, reranking, query rewrite, and grounding checks",
          details: [
            "Hybrid search with vector and keyword signals",
            "Cohere/local reranking, dynamic top-k, and MMR diversification",
            "Metadata filters and citation-aware answer generation",
          ],
        },
        {
          id: "agent",
          label: "ReAct Agent",
          type: "core",
          position: { x: 380, y: 200 },
          mobilePosition: { x: 80, y: 370 },
          description:
            "Agentic RAG mode with a ReAct-style agent for multi-step reasoning and dynamic tool use",
          details: [
            "Tools: retrieve, compare, summarize, refine",
            "Configurable max iterations and temperature",
            "Falls back to standard RAG when agent mode is disabled",
          ],
        },
        {
          id: "groq",
          label: "Groq LLM",
          type: "service",
          position: { x: 640, y: 20 },
          mobilePosition: { x: 0, y: 500 },
          description:
            "LLM service used to generate grounded answers, power agent reasoning, and support query rewriting",
          details: [
            "Primary model: Llama 3.3 70B via Groq",
            "Supports contextualization, rewrite, and agent tool calls",
            "Configured through environment variables for flexible model choice",
          ],
        },
        {
          id: "postgres",
          label: "PostgreSQL + pgvector",
          type: "database",
          position: { x: 640, y: 150 },
          mobilePosition: { x: 160, y: 500 },
          description:
            "Persistent store for sessions, metadata, analytics, and vector-backed retrieval",
          details: [
            "Stores document chunks and session metadata",
            "Uses pgvector for semantic search",
            "Tracks usage, quotas, feedback, and daily analytics",
          ],
        },
      ],
      edges: [
        { from: "user", to: "fastapi" },
        { from: "fastapi", to: "ingestion" },
        { from: "fastapi", to: "retrieval" },
        { from: "fastapi", to: "agent" },
        { from: "ingestion", to: "postgres" },
        { from: "retrieval", to: "groq" },
        { from: "retrieval", to: "postgres" },
        { from: "agent", to: "retrieval" },
        { from: "agent", to: "groq" },
      ],
    },
  },
  {
    title: "Interview AI",
    slug: "interview-ai",
    description:
      "A full-stack AI interview simulator that analyzes resumes, runs adaptive interviews, and generates detailed coaching reports.",
    longDescription: [
      "Interview AI is a full-stack multi-agent interview simulator built to help candidates practice realistic technical and behavioral interviews. The system analyzes resumes against job descriptions, creates structured interview plans, asks adaptive follow-up questions, and evaluates each answer in real time.",
      "Beyond text-based interviews, the platform also supports voice mode with speech-to-text, text-to-speech, bilingual interactions, and streaming feedback. It combines a Next.js frontend with a FastAPI backend, LangGraph agent orchestration, PostgreSQL persistence, Redis caching, and a Groq-to-Gemini fallback strategy for resilient AI responses.",
    ],
    features: [
      "Resume analysis against job descriptions with skills extraction and gap detection",
      "Adaptive interview flow with automatic follow-up questions based on answer depth",
      "Real-time answer evaluation and final coaching reports with actionable feedback",
      "Voice interview mode with Whisper transcription and edge-tts playback",
      "Bilingual interview support with Groq primary inference and Gemini fallback",
    ],
    techStack: [
      "Python",
      "FastAPI",
      "Next.js",
      "LangGraph",
      "Groq",
      "Gemini",
      "PostgreSQL",
      "Redis",
    ],
    domains: ["GenAI / LLMs"],
    github: "https://github.com/mugnihidayah/interview-ai",
    demo: "https://interview-ai-sooty-one.vercel.app/",
    videoUrl: "https://youtu.be/NzikfL-I_oo?si=CNGo4ruqt3MMOiyn",
    image: "/projects/interview-ai.webp",
    status: "in-progress",
    featured: true,
    caseStudy: {
      problem: [
        "Interview prep tools often provide static question banks, but they do not adapt to the candidate's resume, target role, or answer quality in real time.",
        "Most mock interview experiences also separate interview practice from coaching, forcing users to assemble feedback manually after the session.",
      ],
      constraints: [
        "The experience had to feel adaptive and product-like, but still stay understandable and controllable across multiple agents and fallback models.",
        "Because the project spans frontend, backend, streaming, voice, and orchestration, complexity could grow quickly if the workflow boundaries were not explicit.",
      ],
      role: [
        "Designed the multi-agent flow, backend APIs, and overall full-stack architecture across frontend and backend boundaries.",
        "Implemented the orchestration strategy for resume analysis, question generation, evaluation, reporting, and fallback handling.",
      ],
      decisions: [
        "I split the workflow into resume analysis, interview planning, interviewer behavior, evaluation, and coaching so each stage stayed easier to reason about.",
        "I used LangGraph orchestration because the project needed explicit state transitions rather than a single prompt chain that would be harder to debug.",
        "I added SSE streaming, voice support, and model fallback because the quality of the interview experience depended on responsiveness and resilience, not just raw generation quality.",
      ],
      stackRationale: [
        "Next.js fit the product side because it made it easier to handle a more polished frontend flow, auth-aware UI, and live interaction patterns.",
        "FastAPI was a strong backend choice for orchestrating AI workflows, streaming endpoints, and voice-related utilities with clear server control.",
        "Redis and PostgreSQL worked well together here because the system needed both durable session/report storage and fast operational state for caching and limits.",
      ],
      results: [
        "Produced a full-stack interview simulator that can analyze resumes, run adaptive interviews, and return actionable coaching reports.",
        "Created a stronger portfolio example of AI product engineering, not just model prompting, by combining orchestration, UX flow, and backend reliability.",
      ],
      nextImprovements: [
        "I would add richer interview memory and more structured evaluator traces so follow-up reasoning becomes even more transparent.",
        "I would also improve calibration around scoring and report quality with a stronger offline evaluation loop tied to target roles.",
      ],
    },
    artifacts: {
      snapshotTitle: "Application Snapshot",
      snapshotCaption:
        "A live interview workspace where the candidate setup, streamed questioning, and coaching feedback are treated as one connected product flow instead of separate AI utilities.",
      flowTitle: "Input -> System -> Output",
      flowSteps: [
        {
          title: "Input",
          detail:
            "Candidates provide a resume, target role, and job description, then respond through text or voice during the interview session.",
        },
        {
          title: "System",
          detail:
            "LangGraph coordinates resume analysis, interview planning, adaptive follow-up logic, answer evaluation, and fallback-aware generation.",
        },
        {
          title: "Output",
          detail:
            "The system produces a scored interview transcript, role-fit observations, and a coaching report with concrete next steps.",
        },
      ],
      outputTitle: "Representative Output",
      outputCaption:
        "A coaching-style response that reflects how the product turns interaction data into something useful for the candidate.",
      outputLanguage: "markdown",
      outputSnippet: `## Interview Coaching Summary

- Strongest signal: practical backend + AI workflow experience
- Role fit: good match for AI engineer / ML application roles
- Follow-up focus: system design depth and tradeoff communication

### Next improvement
Give a tighter answer on why you chose LangGraph for explicit state transitions over a single prompt chain.`,
    },
    trust: {
      scope: [
        "Designed the end-to-end architecture across frontend, backend, orchestration, and live interaction flow.",
        "Implemented the agent orchestration strategy for resume analysis, adaptive interviewing, evaluation, reporting, and fallback behavior.",
      ],
      tradeoffs: [
        "Used explicit LangGraph state transitions to keep multi-agent behavior debuggable, even though it increased implementation overhead compared with a single prompt chain.",
        "Balanced UX ambition with reliability by adding streaming, voice mode, and model fallback without turning the system into an opaque black box.",
      ],
      metrics: [
        {
          label: "Interaction modes",
          value: "Text + voice",
          detail: "Supports typed interviews, speech-to-text input, and text-to-speech playback.",
        },
        {
          label: "Workflow model",
          value: "Multi-agent",
          detail: "Separates resume analysis, questioning, evaluation, and coaching into explicit stages.",
        },
        {
          label: "Inference resilience",
          value: "Fallback-ready",
          detail: "Uses Groq as primary inference with Gemini fallback for more stable session handling.",
        },
      ],
      links: {
        github: {
          label: "GitHub repository",
          status: "available",
          note: "Public repository available so the technical architecture can be reviewed directly.",
        },
        demo: {
          label: "Demo availability",
          status: "limited",
          note: "No public live demo yet. The current build is still being stabilized and is better demonstrated from the repository and screenshots.",
        },
      },
    },
    visualProof: {
      summary:
        "This project shows that I can build an AI application as a real product system, not just an LLM prompt flow, by connecting orchestration, UX, streaming, and resilience.",
      metrics: [
        {
          label: "Interaction modes",
          value: "Text + voice",
          detail: "Supports typed interviews, speech-to-text input, and text-to-speech output.",
        },
        {
          label: "Agent structure",
          value: "Multi-agent",
          detail: "Separates resume analysis, interview flow, evaluation, and coaching responsibilities.",
        },
        {
          label: "Reliability",
          value: "Fallback-ready",
          detail: "Uses Groq as primary inference with Gemini fallback for more resilient response handling.",
        },
      ],
      flow: [
        {
          title: "Analyze the candidate",
          description:
            "The system extracts role context, skills, and gaps from the resume and target job description.",
        },
        {
          title: "Run the interview live",
          description:
            "Adaptive questioning, streaming responses, and optional voice interaction simulate a more realistic interview loop.",
        },
        {
          title: "Turn answers into coaching",
          description:
            "Evaluation and coach agents convert the interview into actionable feedback and a structured report.",
        },
      ],
      beforeAfter: {
        before:
          "Static interview prep tools usually stop at question lists and leave the candidate to interpret their own performance.",
        after:
          "Interview AI gives a more realistic, role-aware practice loop with adaptive questioning and end-of-session coaching.",
        impact:
          "It demonstrates full-stack AI product engineering across orchestration, streaming UX, persistence, and fallback behavior.",
      },
    },
    architecture: {
      description:
        "Flow from interview setup to multi-agent evaluation and coaching report generation",
      nodes: [
        {
          id: "candidate",
          label: "Candidate",
          type: "external",
          position: { x: 0, y: 80 },
          mobilePosition: { x: 80, y: 0 },
          description:
            "User starts an interview, answers questions, and reviews the final coaching report",
          details: [
            "Uploads resume text and job description",
            "Participates in text or voice interviews",
            "Receives scores, feedback, and improvement suggestions",
          ],
        },
        {
          id: "nextjs",
          label: "Next.js App",
          type: "service",
          position: { x: 180, y: 80 },
          mobilePosition: { x: 80, y: 120 },
          description:
            "Frontend experience for authentication, interview setup, live chat, history, and coaching reports",
          details: [
            "Three-step interview setup flow",
            "Live interview interface with SSE updates",
            "Voice recording, playback, and report views",
          ],
        },
        {
          id: "fastapi",
          label: "FastAPI",
          type: "backend",
          position: { x: 360, y: 80 },
          mobilePosition: { x: 80, y: 240 },
          description:
            "Backend API that manages auth, interview sessions, SSE streaming, STT, and TTS endpoints",
          details: [
            "JWT auth with protected interview endpoints",
            "Session lifecycle, answer processing, and cleanup",
            "Voice transcription and audio prefetch routes",
          ],
        },
        {
          id: "langgraph",
          label: "LangGraph Agents",
          type: "core",
          position: { x: 540, y: 80 },
          mobilePosition: { x: 80, y: 360 },
          description:
            "Multi-agent pipeline for resume analysis, question generation, evaluation, and coaching",
          details: [
            "Resume Analyzer extracts skills and gaps",
            "Interviewer adapts questions and follow-ups",
            "Evaluator and Coach produce scores and final reports",
          ],
        },
        {
          id: "llm",
          label: "Groq + Gemini",
          type: "service",
          position: { x: 720, y: 20 },
          mobilePosition: { x: 0, y: 500 },
          description:
            "LLM layer for question generation, answer evaluation, fallback handling, and transcription support",
          details: [
            "Groq used as the primary fast model",
            "Gemini acts as fallback for resilience",
            "Whisper powers speech-to-text transcription",
          ],
        },
        {
          id: "storage",
          label: "PostgreSQL + Redis",
          type: "database",
          position: { x: 720, y: 160 },
          mobilePosition: { x: 160, y: 500 },
          description:
            "Persistence and caching layer for users, interview sessions, reports, and rate limiting",
          details: [
            "PostgreSQL stores accounts, sessions, and reports",
            "Redis supports caching and rate limiting",
            "Session state and performance signals are preserved across flows",
          ],
        },
      ],
      edges: [
        { from: "candidate", to: "nextjs" },
        { from: "nextjs", to: "fastapi" },
        { from: "fastapi", to: "langgraph" },
        { from: "fastapi", to: "storage" },
        { from: "langgraph", to: "llm" },
        { from: "langgraph", to: "storage" },
      ],
    },
  },
  {
    title: "Real-time Emotion Analytics Dashboard",
    slug: "emotion-analytics-dashboard",
    description:
      "A CUDA-accelerated facial emotion recognition system with real-time engagement analytics and live dashboard visualizations.",
    longDescription: [
      "This project is a deep learning-powered emotion analytics system built for real-time facial emotion recognition and engagement tracking. It combines YOLOv8 for face detection with a custom ResNet-SE CNN for emotion classification, then renders the results into a polished dashboard experience using Streamlit and OpenCV overlays.",
      "Beyond raw emotion classification, the system computes weighted engagement scores, smooths noisy predictions with exponential moving average filters, and maintains interactive visual feedback at production-friendly speeds. With CUDA acceleration enabled, the pipeline reaches roughly 30 to 60 FPS on an RTX 3050 while preserving strong validation metrics for both detection and classification.",
    ],
    features: [
      "CUDA-accelerated inference pipeline that maintains 30 to 60 FPS on modern NVIDIA GPUs",
      "Dual-model workflow using YOLOv8 face detection and a custom ResNet-SE emotion classifier",
      "Engagement analytics calculated from weighted emotion probabilities for real-time attention tracking",
      "EMA-based smoothing for predictions, bounding boxes, and engagement trends to reduce jitter",
      "Live OpenCV-rendered HUD and Streamlit dashboard with real-time visual analytics",
    ],
    techStack: [
      "Python",
      "PyTorch",
      "YOLOv8",
      "OpenCV",
      "Streamlit",
      "CUDA",
    ],
    domains: ["Computer Vision", "Data Analytics"],
    github: "https://github.com/mugnihidayah/emotion-analytics-realtime",
    demo: "#",
    videoUrl: "#",
    image: "/projects/emotion-analytics-dashboard.svg",
    status: "completed",
    caseStudy: {
      problem: [
        "Raw emotion recognition outputs are noisy in live settings, which makes dashboards jittery and difficult to trust.",
        "Many computer vision demos can detect something interesting, but they do not translate predictions into a meaningful real-time analytics experience.",
      ],
      constraints: [
        "The system needed to stay fast enough for live use while still doing two model passes and extra analytics on each frame.",
        "Output stability mattered almost as much as raw accuracy because noisy live predictions quickly make dashboards feel untrustworthy.",
      ],
      role: [
        "Built the inference workflow, analytics logic, and dashboard experience for live emotion analysis.",
        "Integrated detection, classification, smoothing, and visualization into one end-to-end pipeline.",
      ],
      decisions: [
        "I separated face detection and emotion classification into a dual-model pipeline so each stage could stay focused and easier to optimize.",
        "I added weighted engagement scoring because raw emotion labels alone were not enough to make the output decision-friendly.",
        "I used EMA smoothing on predictions, boxes, and trends because the dashboard needed to feel stable, not just technically correct frame by frame.",
      ],
      stackRationale: [
        "PyTorch gave me the flexibility I wanted for the custom CNN and the surrounding inference logic.",
        "YOLOv8 was a practical detector choice because it offered a strong speed-quality tradeoff for real-time face detection.",
        "Streamlit and OpenCV were good fits together here because they let me focus on the real-time analytics experience without overbuilding the UI layer.",
      ],
      results: [
        "Reached roughly 30 to 60 FPS on an RTX 3050 while preserving strong validation metrics for both detection and classification.",
        "Delivered a more product-like computer vision experience by combining live inference with analytics, smoothing, and dashboard visualization.",
      ],
      nextImprovements: [
        "I would add multi-person aggregation and better session-level analytics so the system could support richer engagement scenarios.",
        "I would also invest in broader robustness testing across lighting conditions, camera quality, and more varied face distributions.",
      ],
    },
    artifacts: {
      snapshotTitle: "Application Snapshot",
      snapshotCaption:
        "A real-time dashboard view where live detections, engagement signals, and smoothing make the computer vision output readable enough to trust while the stream is running.",
      flowTitle: "Input -> System -> Output",
      flowSteps: [
        {
          title: "Input",
          detail:
            "A webcam stream provides live frames that need to be processed continuously without breaking the viewing experience.",
        },
        {
          title: "System",
          detail:
            "YOLOv8 detects faces, the ResNet-SE CNN classifies emotions, and EMA smoothing stabilizes predictions plus engagement trends.",
        },
        {
          title: "Output",
          detail:
            "The dashboard overlays emotion labels, confidence, engagement score, and trend visuals directly onto the live feed.",
        },
      ],
      outputTitle: "Representative Output",
      outputCaption:
        "A lightweight analytics snapshot that mirrors the kind of live signal the dashboard is designed to surface.",
      outputLanguage: "text",
      outputSnippet: `face_01
emotion: happy (0.74)
engagement_score: 0.81
trend: stable
fps: 42
note: smoothing active`,
    },
    trust: {
      scope: [
        "Built the inference pipeline, engagement analytics logic, smoothing behavior, and dashboard rendering workflow.",
        "Integrated detection, classification, scoring, and visualization into one real-time system rather than treating them as separate experiments.",
      ],
      tradeoffs: [
        "Chose a dual-model pipeline to keep detection and emotion classification separately optimizable, even though it adds more moving parts than a single model approach.",
        "Prioritized output stability with EMA smoothing because live usability matters almost as much as raw frame-level accuracy in this kind of dashboard.",
      ],
      metrics: [
        {
          label: "Inference speed",
          value: "30 to 60 FPS",
          detail: "Runs at real-time speeds on an RTX 3050 with CUDA acceleration enabled.",
        },
        {
          label: "Detection quality",
          value: "mAP 0.89",
          detail: "YOLOv8 face detection maintained strong validation performance for the live pipeline.",
        },
        {
          label: "Classification quality",
          value: "81% accuracy",
          detail: "The custom emotion classifier reached solid FER-2013plus test performance.",
        },
      ],
      links: {
        github: {
          label: "GitHub repository",
          status: "available",
          note: "Public repository available with notebooks, inference code, and setup details.",
        },
        demo: {
          label: "Demo availability",
          status: "limited",
          note: "No persistent public demo. The project is best verified through the repository, dashboard preview, and documented performance results.",
        },
      },
    },
    visualProof: {
      summary:
        "This project proves I can take a computer vision pipeline beyond raw prediction and shape it into a live analytics experience that feels stable and interpretable.",
      metrics: [
        {
          label: "Inference speed",
          value: "30 to 60 FPS",
          detail: "Runs at real-time speeds on an RTX 3050 with CUDA acceleration enabled.",
        },
        {
          label: "Detection quality",
          value: "mAP 0.89",
          detail: "YOLOv8 face detection holds strong validation performance for the live pipeline.",
        },
        {
          label: "Classification quality",
          value: "81% accuracy",
          detail: "The custom emotion classifier reached solid FER-2013plus test performance.",
        },
      ],
      flow: [
        {
          title: "Detect faces in each frame",
          description:
            "YOLOv8 isolates face regions so the downstream classifier works on focused inputs.",
        },
        {
          title: "Stabilize noisy predictions",
          description:
            "Emotion probabilities are translated into engagement signals and smoothed with EMA filters.",
        },
        {
          title: "Render live analytics",
          description:
            "OpenCV overlays and the Streamlit dashboard turn model output into something users can actually read and trust.",
        },
      ],
      beforeAfter: {
        before:
          "Raw frame-by-frame emotion predictions are often too jittery and too abstract to feel useful in a live setting.",
        after:
          "The pipeline becomes a more readable real-time dashboard by combining smoothing, engagement scoring, and direct visual overlays.",
        impact:
          "The system demonstrates applied ML engineering, not only model training, by balancing speed, interpretability, and live UX.",
      },
    },
    architecture: {
      description:
        "Real-time pipeline from camera input to emotion classification, engagement scoring, and dashboard rendering",
      nodes: [
        {
          id: "camera",
          label: "Camera Input",
          type: "external",
          position: { x: 0, y: 60 },
          mobilePosition: { x: 80, y: 0 },
          description:
            "Live webcam frames are captured and passed into the real-time analytics pipeline",
          details: [
            "Browser camera feed powers the dashboard",
            "Frames are processed continuously in real time",
            "Designed for interactive live analysis sessions",
          ],
        },
        {
          id: "yolov8",
          label: "YOLOv8 Face Detector",
          type: "backend",
          position: { x: 230, y: 60 },
          mobilePosition: { x: 80, y: 120 },
          description:
            "Detects faces and extracts regions of interest from each incoming frame",
          details: [
            "Uses YOLOv8n tuned for face detection",
            "Produces bounding boxes with confidence scores",
            "Runs with CUDA acceleration when available",
          ],
        },
        {
          id: "emotion-cnn",
          label: "ResNet-SE Emotion CNN",
          type: "core",
          position: { x: 460, y: 60 },
          mobilePosition: { x: 80, y: 240 },
          description:
            "Classifies each detected face into one of seven emotion categories",
          details: [
            "Consumes 48x48 grayscale face crops",
            "Custom CNN uses residual blocks and squeeze-and-excitation",
            "Outputs softmax probabilities for engagement scoring",
          ],
        },
        {
          id: "analytics",
          label: "Analytics + EMA",
          type: "core",
          position: { x: 690, y: 20 },
          mobilePosition: { x: 0, y: 360 },
          description:
            "Transforms model probabilities into smoothed emotion and engagement signals",
          details: [
            "Computes weighted engagement scores from emotion probabilities",
            "Applies EMA smoothing to reduce prediction jitter",
            "Tracks temporal changes for more stable live feedback",
          ],
        },
        {
          id: "dashboard",
          label: "OpenCV + Streamlit Dashboard",
          type: "service",
          position: { x: 690, y: 140 },
          mobilePosition: { x: 160, y: 360 },
          description:
            "Renders the annotated feed, sparkline analytics, and interactive UI for the user",
          details: [
            "Displays full-width video feed in Streamlit",
            "Overlays HUD elements directly on frames with OpenCV",
            "Shows real-time engagement feedback and visual trends",
          ],
        },
      ],
      edges: [
        { from: "camera", to: "yolov8" },
        { from: "yolov8", to: "emotion-cnn" },
        { from: "emotion-cnn", to: "analytics" },
        { from: "analytics", to: "dashboard" },
      ],
    },
  },
];
