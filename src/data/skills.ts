export type SkillRoleFit = "AI Engineer" | "Data Scientist";

export type SkillCategory =
  | "Data Science"
  | "Machine Learning"
  | "AI Engineering"
  | "Backend / Deployment";

export interface SkillExtension {
  name: string;
  publisher: string;
  description: string;
  category: SkillCategory;
  icon: string;
  rating: number;
  installed: boolean;
  roleFit: SkillRoleFit[];
  keywords: string[];
}

export const skillCategories = [
  "All",
  "Data Science",
  "Machine Learning",
  "AI Engineering",
  "Backend / Deployment",
] as const;

export const skills: SkillExtension[] = [
  {
    name: "Python",
    publisher: "Core Language",
    description:
      "Primary language for analytics workflows, machine learning experimentation, backend services, and AI application development.",
    category: "Data Science",
    icon: "Python",
    rating: 5,
    installed: true,
    roleFit: ["AI Engineer", "Data Scientist"],
    keywords: [
      "analytics",
      "modeling",
      "experimentation",
      "data processing",
      "machine learning",
    ],
  },
  {
    name: "SQL",
    publisher: "Query Language",
    description:
      "Used for querying structured data, analysis workflows, and building reliable data access patterns.",
    category: "Data Science",
    icon: "SQL",
    rating: 4,
    installed: true,
    roleFit: ["Data Scientist"],
    keywords: [
      "analytics",
      "data analysis",
      "reporting",
      "feature extraction",
      "structured data",
    ],
  },
  {
    name: "Pandas",
    publisher: "Open Source",
    description:
      "Data wrangling and tabular analysis toolkit for cleaning datasets, transforming features, and building practical analysis pipelines.",
    category: "Data Science",
    icon: "Pandas",
    rating: 5,
    installed: true,
    roleFit: ["Data Scientist"],
    keywords: [
      "feature engineering",
      "data wrangling",
      "exploratory analysis",
      "analytics",
      "cleaning",
    ],
  },
  {
    name: "NumPy",
    publisher: "Open Source",
    description:
      "Numerical computing foundation I use for vectorized operations, matrix work, and efficient experimentation.",
    category: "Data Science",
    icon: "NumPy",
    rating: 4,
    installed: true,
    roleFit: ["Data Scientist"],
    keywords: [
      "numerical computing",
      "experimentation",
      "array processing",
      "statistics",
      "analysis",
    ],
  },
  {
    name: "Matplotlib",
    publisher: "Open Source",
    description:
      "Data visualization library for creating static, animated, and interactive visual plots and charts.",
    category: "Data Science",
    icon: "Matplotlib",
    rating: 4,
    installed: true,
    roleFit: ["Data Scientist"],
    keywords: [
      "visualization",
      "plotting",
      "charts",
      "data analysis",
      "graphs",
    ],
  },
  {
    name: "Scikit-learn",
    publisher: "Open Source",
    description:
      "Classical machine learning toolkit for classification, regression, evaluation, and fast iteration on structured-data problems.",
    category: "Machine Learning",
    icon: "Scikit-learn",
    rating: 4,
    installed: true,
    roleFit: ["AI Engineer", "Data Scientist"],
    keywords: [
      "classification",
      "regression",
      "evaluation",
      "modeling",
      "experimentation",
    ],
  },
  {
    name: "MLflow",
    publisher: "Databricks / LF",
    description:
      "Experiment tracking platform I use to log metrics, compare model parameters, and maintain an organized training history beyond standalone notebooks.",
    category: "Machine Learning",
    icon: "MLflow",
    rating: 4,
    installed: true,
    roleFit: ["AI Engineer", "Data Scientist"],
    keywords: [
      "mlops",
      "experiment tracking",
      "model lifecycle",
      "metrics",
    ],
  },
  {
    name: "PyTorch",
    publisher: "Meta AI",
    description:
      "Deep learning framework I use to build, train, and evaluate neural networks for computer vision and applied ML systems.",
    category: "Machine Learning",
    icon: "PyTorch",
    rating: 5,
    installed: true,
    roleFit: ["AI Engineer", "Data Scientist"],
    keywords: [
      "deep learning",
      "model training",
      "evaluation",
      "computer vision",
      "neural networks",
    ],
  },
  {
    name: "TensorFlow",
    publisher: "Google",
    description:
      "End-to-end ML platform for training, experimentation, and deploying models in applied production scenarios.",
    category: "Machine Learning",
    icon: "TensorFlow",
    rating: 4,
    installed: true,
    roleFit: ["AI Engineer", "Data Scientist"],
    keywords: [
      "modeling",
      "training",
      "evaluation",
      "deployment",
      "deep learning",
    ],
  },
  {
    name: "HuggingFace",
    publisher: "Hugging Face",
    description:
      "Model ecosystem and transformer tooling for NLP, inference workflows, and rapid experimentation with modern foundation models.",
    category: "Machine Learning",
    icon: "HuggingFace",
    rating: 5,
    installed: true,
    roleFit: ["AI Engineer", "Data Scientist"],
    keywords: [
      "transformers",
      "nlp",
      "inference",
      "evaluation",
      "model hub",
    ],
  },
  {
    name: "LangChain",
    publisher: "LangChain Inc",
    description:
      "Framework for building LLM applications with retrieval, tool use, prompt orchestration, and agent-style workflows.",
    category: "AI Engineering",
    icon: "LangChain",
    rating: 5,
    installed: true,
    roleFit: ["AI Engineer"],
    keywords: [
      "rag",
      "agents",
      "llm applications",
      "retrieval",
      "prompt orchestration",
    ],
  },
  {
    name: "LangGraph",
    publisher: "LangChain Inc",
    description:
      "Stateful orchestration for multi-step and multi-agent application logic where control flow matters as much as prompting.",
    category: "AI Engineering",
    icon: "LangGraph",
    rating: 4,
    installed: true,
    roleFit: ["AI Engineer"],
    keywords: [
      "agent workflows",
      "state machines",
      "multi-agent",
      "orchestration",
      "llm systems",
    ],
  },
  {
    name: "FastAPI",
    publisher: "Sebastian Ramirez",
    description:
      "Modern Python API framework I use to ship inference services, backend logic, and production-minded AI application endpoints.",
    category: "Backend / Deployment",
    icon: "FastAPI",
    rating: 5,
    installed: true,
    roleFit: ["AI Engineer"],
    keywords: [
      "api",
      "backend",
      "deployment",
      "serving",
      "architecture",
    ],
  },
  {
    name: "PostgreSQL",
    publisher: "Open Source",
    description:
      "Relational database I use for structured storage, analytics-backed products, and AI applications that need reliable persistence.",
    category: "Backend / Deployment",
    icon: "PostgreSQL",
    rating: 4,
    installed: true,
    roleFit: ["AI Engineer", "Data Scientist"],
    keywords: [
      "database",
      "analytics",
      "data storage",
      "backend",
      "sql",
    ],
  },
  {
    name: "Docker",
    publisher: "Docker Inc",
    description:
      "Containerization tool for stable local development, reproducible AI stacks, and deployment-ready services.",
    category: "Backend / Deployment",
    icon: "Docker",
    rating: 4,
    installed: true,
    roleFit: ["AI Engineer"],
    keywords: [
      "deployment",
      "containers",
      "infrastructure",
      "reproducibility",
      "shipping",
    ],
  },
  {
    name: "GitHub Actions",
    publisher: "GitHub",
    description:
      "CI/CD automation tool I use for linting, testing, and deploying machine learning services and web applications directly from the repository.",
    category: "Backend / Deployment",
    icon: "GitHub Actions",
    rating: 3,
    installed: true,
    roleFit: ["AI Engineer"],
    keywords: [
      "automation",
      "ci/cd",
      "pipelines",
      "deployment",
      "workflow",
    ],
  },
  {
    name: "Git",
    publisher: "Version Control",
    description:
      "Version control workflow for collaboration, iteration, experiment history, and maintainable engineering delivery.",
    category: "Backend / Deployment",
    icon: "Git",
    rating: 5,
    installed: true,
    roleFit: ["AI Engineer", "Data Scientist"],
    keywords: [
      "collaboration",
      "experimentation",
      "version control",
      "workflow",
      "delivery",
    ],
  },
  {
    name: "Vercel",
    publisher: "Vercel Inc",
    description:
      "Deployment platform I use to ship frontend and full-stack applications quickly with a clean production workflow.",
    category: "Backend / Deployment",
    icon: "Vercel",
    rating: 4,
    installed: true,
    roleFit: ["AI Engineer"],
    keywords: [
      "deployment",
      "shipping",
      "frontend delivery",
      "hosting",
      "production",
    ],
  },
];
