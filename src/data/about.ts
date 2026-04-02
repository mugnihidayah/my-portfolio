export interface Certification {
  name: string;
  issuer: string;
  year: string;
  credentialUrl?: string;
  image?: string;
}

export const about = {
  bio: [
    "Hi! I'm Mugni Hidayah, an AI Engineer and Data Scientist with a strong passion for building end-to-end intelligent systems.",
    "While my foundation is in data analytics and modeling, my true interest lies in the engineering required to bring those models to life. I focus on turning data exploration and ML concepts into functional, scalable AI applications using modern frameworks.",
  ],
  interests: [
    "Generative AI",
    "Retrieval-Augmented Generation",
    "AI Agents",
    "Machine Learning",
    "Computer Vision",
  ],
  certifications: [
    {
      name: "Python for Data Science, AI, and Development",
      issuer: "IBM",
      year: "2025",
      credentialUrl: "https://coursera.org/verify/L73YOI8OJ1C6",
      image: "/certifications/python-for-data-science-ai-and-development.jpg",
    },
    {
      name: "Databases and SQL for Data Science with Python",
      issuer: "IBM",
      year: "2025",
      credentialUrl: "https://coursera.org/verify/WZW7L9TVC4SI",
      image: "/certifications/databases-and-sql-for-data-science-with-python.jpg",
    },
    {
      name: "Data Analysis with Python",
      issuer: "IBM",
      year: "2025",
      credentialUrl: "https://coursera.org/verify/2U7LRVS81JTU",
      image: "/certifications/data-analysis-with-python.jpg",
    },
    {
      name: "Data Visualization with Python",
      issuer: "IBM",
      year: "2025",
      credentialUrl: "https://coursera.org/verify/X3E66267X09K",
      image: "/certifications/data-visualization-with-python.jpg",
    },
    {
      name: "Machine Learning with Python",
      issuer: "IBM",
      year: "2025",
      credentialUrl: "https://coursera.org/verify/EIE40PIY9BW5",
      image: "/certifications/machine-learning-with-python.jpg",
    },
    {
      name: "Generative AI",
      issuer: "IBM",
      year: "2025",
      credentialUrl: "https://coursera.org/verify/JQQ1LX3B2NGT",
      image: "/certifications/generative-ai.jpg",
    },
    {
      name: "IBM Data Science Professional Certificate",
      issuer: "IBM",
      year: "2025",
      credentialUrl: "https://coursera.org/verify/professional-cert/VXCC4E4WTBZ8",
      image: "/certifications/ibm-data-science-professional-certificate.jpg",
    },
  ] as Certification[],
};
