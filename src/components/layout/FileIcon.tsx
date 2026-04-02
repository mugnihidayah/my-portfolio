import { fileIconMap } from "@/components/icons/TechIcons";
import { FileCode2 } from "lucide-react";

interface FileIconProps {
  extension: string;
  size?: number;
}

export default function FileIcon({ extension, size = 16 }: FileIconProps) {
  const IconComponent = fileIconMap[extension];

  if (IconComponent) {
    return <IconComponent size={size} className="shrink-0" />;
  }

  // Fallback
  return <FileCode2 size={size} style={{ color: "#cccccc" }} className="shrink-0" />;
}