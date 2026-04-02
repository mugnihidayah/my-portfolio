export interface CommandDef {
  name: string;
  description: string;
  usage?: string;
}

export const commandList: CommandDef[] = [
  { name: "help", description: "Show available commands" },
  { name: "about", description: "Open about page" },
  { name: "projects", description: "Open projects page" },
  { name: "skills", description: "Open skills page" },
  { name: "experience", description: "Open experience page" },
  { name: "contact", description: "Open contact page" },
  { name: "home", description: "Open home page" },
  { name: "resume", description: "Download resume" },
  { name: "theme", description: "Change theme", usage: "theme <name>" },
  { name: "themes", description: "List available themes" },
  { name: "clear", description: "Clear terminal" },
  { name: "whoami", description: "Who are you?" },
  { name: "date", description: "Show current date & time" },
  { name: "echo", description: "Echo text back", usage: "echo <text>" },
  { name: "neofetch", description: "System info" },
  { name: "secret", description: "🤫" },
];

export const availableThemes = [
  "dark+",
  "light+",
  "dracula",
  "one-dark",
  "github-dark",
  "monokai",
];