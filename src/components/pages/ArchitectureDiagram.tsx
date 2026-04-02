"use client";

import { useState, useMemo, useCallback } from "react";
import {
  ReactFlow,
  Handle,
  Position,
  MarkerType,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMobile } from "@/hooks/useMobile";
import type { Architecture, ArchitectureNode } from "@/data/projects";

const typeColors: Record<string, string> = {
  external: "#808080",
  backend: "#4ec9b0",
  core: "#569cd6",
  database: "#ce9178",
  service: "#c586c0",
};

const typeLabels: Record<string, string> = {
  external: "External",
  backend: "Backend",
  core: "Core",
  database: "Database",
  service: "Service",
};

interface ArchNodeData {
  label: string;
  nodeType: string;
  isVertical: boolean;
  isSelected: boolean;
  [key: string]: unknown;
}

function ArchitectureNodeComponent({ data }: NodeProps<Node<ArchNodeData>>) {
  const label = data.label;
  const nodeType = data.nodeType;
  const isVertical = data.isVertical;
  const isSelected = data.isSelected;
  const typeColor = typeColors[nodeType] || typeColors.external;

  return (
    <>
      <Handle
        type="target"
        position={isVertical ? Position.Top : Position.Left}
        style={{ background: "transparent", border: "none" }}
      />
      <div
        className="rounded-sm border-l-3 transition-all cursor-pointer"
        style={{
          backgroundColor: isSelected
            ? "var(--active-bg)"
            : "var(--sidebar-bg)",
          borderColor: isSelected ? "var(--accent-color)" : "var(--border-color)",
          borderLeftColor: typeColor,
          padding: isVertical ? "8px 12px" : "10px 16px",
          minWidth: isVertical ? 100 : 130,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          boxShadow: isSelected
            ? "0 0 0 1px var(--accent-color)"
            : "0 1px 3px rgba(0,0,0,0.15)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: typeColor }}
          />
          <span
            className="font-medium whitespace-nowrap"
            style={{
              color: isSelected
                ? "var(--accent-color)"
                : "var(--tab-active-fg)",
              fontSize: isVertical ? 11 : 12,
            }}
          >
            {label}
          </span>
        </div>
      </div>
      <Handle
        type="source"
        position={isVertical ? Position.Bottom : Position.Right}
        style={{ background: "transparent", border: "none" }}
      />
    </>
  );
}

interface ArchitectureDiagramProps {
  architecture: Architecture;
}

export default function ArchitectureDiagram({
  architecture,
}: ArchitectureDiagramProps) {
  const isMobile = useMobile();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const nodeTypes = useMemo(
    () => ({
      architecture: ArchitectureNodeComponent,
    }),
    []
  );

  const nodes: Node<ArchNodeData>[] = useMemo(
    () =>
      architecture.nodes.map((n) => ({
        id: n.id,
        type: "architecture" as const,
        position: isMobile ? n.mobilePosition : n.position,
        data: {
          label: n.label,
          nodeType: n.type,
          isVertical: isMobile,
          isSelected: n.id === selectedNodeId,
        },
        draggable: false,
        connectable: false,
        selectable: true,
      })),
    [architecture.nodes, isMobile, selectedNodeId]
  );

  const edges: Edge[] = useMemo(
    () =>
      architecture.edges.map((e, i) => ({
        id: `e${i}`,
        source: e.from,
        target: e.to,
        type: "smoothstep",
        animated: false,
        style: {
          stroke: "var(--editor-line-number)",
          strokeWidth: 1.5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "var(--editor-line-number)",
          width: 16,
          height: 16,
        },
      })),
    [architecture.edges]
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
    },
    []
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const selectedNode: ArchitectureNode | undefined = selectedNodeId
    ? architecture.nodes.find((n) => n.id === selectedNodeId)
    : undefined;

  const containerHeight = isMobile ? 350 : 350;

  return (
    <div className="space-y-4">
      {/* Diagram */}
      <div
        className="rounded-sm border overflow-hidden"
        style={{
          borderColor: "var(--border-color)",
          height: containerHeight,
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          nodesDraggable={false}
          nodesConnectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={isMobile}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          proOptions={{ hideAttribution: true }}
          style={{ background: "var(--sidebar-bg)" }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            color="var(--border-color)"
            size={1}
            gap={20}
          />
        </ReactFlow>
      </div>

      {/* Hint / Info Panel */}
      {selectedNode ? (
        <div
          className="p-4 rounded-sm border space-y-3"
          style={{
            backgroundColor: "var(--sidebar-bg)",
            borderColor: "var(--accent-color)",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{
                backgroundColor:
                  typeColors[selectedNode.type] || typeColors.external,
              }}
            />
            <h4
              className="font-semibold text-sm"
              style={{ color: "var(--tab-active-fg)" }}
            >
              {selectedNode.label}
            </h4>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-sm"
              style={{
                backgroundColor: "var(--active-bg)",
                color: "var(--editor-fg)",
                opacity: 0.5,
              }}
            >
              {typeLabels[selectedNode.type] || selectedNode.type}
            </span>
          </div>

          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--editor-fg)", opacity: 0.7 }}
          >
            {selectedNode.description}
          </p>

          <ul className="space-y-1">
            {selectedNode.details.map((detail, i) => (
              <li
                key={i}
                className="text-xs flex items-start gap-2"
                style={{ color: "var(--editor-fg)", opacity: 0.6 }}
              >
                <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p
          className="text-xs text-center py-2"
          style={{ color: "var(--editor-fg)", opacity: 0.3 }}
        >
          {isMobile ? "Tap" : "Click"} a component to learn more about it
        </p>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5 text-[10px]">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span style={{ color: "var(--editor-fg)", opacity: 0.4 }}>
              {typeLabels[type] || type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}