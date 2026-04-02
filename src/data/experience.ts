export interface Experience {
  role: string;
  company: string;
  period: string;
  type: "full-time" | "part-time" | "internship" | "freelance" | "contract";
  description: string[];
  techStack: string[];
  current?: boolean;
}

export const experiences: Experience[] = [
  {
    role: "Data Scientist Intern",
    company: "PT Kereta Api Indonesia (Persero)",
    period: "July 2024 - August 2024",
    type: "internship",
    description: [
      "Developed a high-performance data cleaning pipeline using Pandas vectorization, enabling the efficient processing of 1M+ transaction records and reducing data preparation latency",
      "Implemented an automated text classification workflow using SVM, successfully handling extreme class imbalance across 10,000+ reviews to streamline the customer feedback loop",
    ],
    techStack: ["Python", "Scikit-learn", "Pandas", "Numpy"],
    current: false,
  },
];