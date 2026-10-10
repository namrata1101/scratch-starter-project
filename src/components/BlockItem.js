import React from "react";
import Icon from "./Icon";

export const CATEGORY_COLORS = {
  events: {
    bg: "bg-yellow-500 hover:bg-yellow-600",
    border: "border-yellow-600",
    text: "text-white",
  },
  motion: {
    bg: "bg-blue-500 hover:bg-blue-600",
    border: "border-blue-600",
    text: "text-white",
  },
  looks: {
    bg: "bg-purple-500 hover:bg-purple-600",
    border: "border-purple-600",
    text: "text-white",
  },
  control: {
    bg: "bg-yellow-600 hover:bg-yellow-700",
    border: "border-yellow-700",
    text: "text-white",
  },
};

export default function BlockItem({
  block,
  isTemplate = false,
  onParamChange,
  onDelete,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging = false,
}) {
  const category = getCategoryForType(block.type);
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.motion;

  const handleInputChange = (e, key) => {
    e.stopPropagation();
    if (onParamChange) {
      onParamChange(key, e.target.value);
    }
  };

  const renderContent = () => {
    switch (block.type) {
      case "when_flag_clicked":
        return (
          <div className="flex items-center space-x-1.5">
            <span>When</span>
            <span className="inline-flex items-center justify-center bg-white bg-opacity-25 rounded px-1 py-0.5">
              <Icon name="flag" size={13} className="text-green-400" />
            </span>
            <span>clicked</span>
          </div>
        );

      case "when_sprite_clicked":
        return (
          <div className="flex items-center space-x-1.5">
            <span>When this sprite clicked</span>
          </div>
        );

      case "move_steps":
        return (
          <div className="flex items-center space-x-1.5">
            <span>Move</span>
            {isTemplate ? (
              <span className="bg-white text-blue-600 font-bold px-2 py-0.5 rounded-full text-xs shadow-inner">
                {block.defaultParams?.steps ?? 10}
              </span>
            ) : (
              <input
                type="number"
                value={block.params?.steps ?? 10}
                onChange={(e) => handleInputChange(e, "steps")}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-12 text-center text-xs font-bold text-gray-800 bg-white rounded-full px-1.5 py-0.5 outline-none shadow-inner border border-blue-300"
              />
            )}
            <span>steps</span>
          </div>
        );

      case "turn_right":
        return (
          <div className="flex items-center space-x-1.5">
            <span>Turn</span>
            <Icon name="redo" size={13} className="text-white" />
            {isTemplate ? (
              <span className="bg-white text-blue-600 font-bold px-2 py-0.5 rounded-full text-xs shadow-inner">
                {block.defaultParams?.degrees ?? 15}
              </span>
            ) : (
              <input
                type="number"
                value={block.params?.degrees ?? 15}
                onChange={(e) => handleInputChange(e, "degrees")}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-12 text-center text-xs font-bold text-gray-800 bg-white rounded-full px-1.5 py-0.5 outline-none shadow-inner border border-blue-300"
              />
            )}
            <span>degrees</span>
          </div>
        );

      case "turn_left":
        return (
          <div className="flex items-center space-x-1.5">
            <span>Turn</span>
            <Icon name="undo" size={13} className="text-white" />
            {isTemplate ? (
              <span className="bg-white text-blue-600 font-bold px-2 py-0.5 rounded-full text-xs shadow-inner">
                {block.defaultParams?.degrees ?? 15}
              </span>
            ) : (
              <input
                type="number"
                value={block.params?.degrees ?? 15}
                onChange={(e) => handleInputChange(e, "degrees")}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-12 text-center text-xs font-bold text-gray-800 bg-white rounded-full px-1.5 py-0.5 outline-none shadow-inner border border-blue-300"
              />
            )}
            <span>degrees</span>
          </div>
        );

      case "goto_xy":
        return (
          <div className="flex items-center space-x-1.5 flex-wrap">
            <span>Go to x:</span>
            {isTemplate ? (
              <span className="bg-white text-blue-600 font-bold px-2 py-0.5 rounded-full text-xs shadow-inner">
                {block.defaultParams?.x ?? 0}
              </span>
            ) : (
              <input
                type="number"
                value={block.params?.x ?? 0}
                onChange={(e) => handleInputChange(e, "x")}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-12 text-center text-xs font-bold text-gray-800 bg-white rounded-full px-1.5 py-0.5 outline-none shadow-inner border border-blue-300"
              />
            )}
            <span>y:</span>
            {isTemplate ? (
              <span className="bg-white text-blue-600 font-bold px-2 py-0.5 rounded-full text-xs shadow-inner">
                {block.defaultParams?.y ?? 0}
              </span>
            ) : (
              <input
                type="number"
                value={block.params?.y ?? 0}
                onChange={(e) => handleInputChange(e, "y")}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-12 text-center text-xs font-bold text-gray-800 bg-white rounded-full px-1.5 py-0.5 outline-none shadow-inner border border-blue-300"
              />
            )}
          </div>
        );

      case "say_for":
        return (
          <div className="flex items-center space-x-1.5 flex-wrap">
            <span>Say</span>
            {isTemplate ? (
              <span className="bg-white text-purple-600 font-bold px-2 py-0.5 rounded-full text-xs shadow-inner">
                {block.defaultParams?.message ?? "Hello!"}
              </span>
            ) : (
              <input
                type="text"
                value={block.params?.message ?? "Hello!"}
                onChange={(e) => handleInputChange(e, "message")}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-20 text-center text-xs font-bold text-gray-800 bg-white rounded-full px-1.5 py-0.5 outline-none shadow-inner border border-purple-300"
              />
            )}
            <span>for</span>
            {isTemplate ? (
              <span className="bg-white text-purple-600 font-bold px-2 py-0.5 rounded-full text-xs shadow-inner">
                {block.defaultParams?.seconds ?? 2}
              </span>
            ) : (
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={block.params?.seconds ?? 2}
                onChange={(e) => handleInputChange(e, "seconds")}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-12 text-center text-xs font-bold text-gray-800 bg-white rounded-full px-1.5 py-0.5 outline-none shadow-inner border border-purple-300"
              />
            )}
            <span>secs</span>
          </div>
        );

      case "think_for":
        return (
          <div className="flex items-center space-x-1.5 flex-wrap">
            <span>Think</span>
            {isTemplate ? (
              <span className="bg-white text-purple-600 font-bold px-2 py-0.5 rounded-full text-xs shadow-inner">
                {block.defaultParams?.message ?? "Hmm..."}
              </span>
            ) : (
              <input
                type="text"
                value={block.params?.message ?? "Hmm..."}
                onChange={(e) => handleInputChange(e, "message")}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-20 text-center text-xs font-bold text-gray-800 bg-white rounded-full px-1.5 py-0.5 outline-none shadow-inner border border-purple-300"
              />
            )}
            <span>for</span>
            {isTemplate ? (
              <span className="bg-white text-purple-600 font-bold px-2 py-0.5 rounded-full text-xs shadow-inner">
                {block.defaultParams?.seconds ?? 2}
              </span>
            ) : (
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={block.params?.seconds ?? 2}
                onChange={(e) => handleInputChange(e, "seconds")}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-12 text-center text-xs font-bold text-gray-800 bg-white rounded-full px-1.5 py-0.5 outline-none shadow-inner border border-purple-300"
              />
            )}
            <span>secs</span>
          </div>
        );

      case "repeat":
        return (
          <div className="flex items-center space-x-1.5">
            <span>Repeat animation</span>
            {isTemplate ? (
              <span className="bg-white text-yellow-700 font-bold px-2 py-0.5 rounded-full text-xs shadow-inner">
                {block.defaultParams?.times ?? 10}
              </span>
            ) : (
              <input
                type="number"
                min="1"
                value={block.params?.times ?? 10}
                onChange={(e) => handleInputChange(e, "times")}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-12 text-center text-xs font-bold text-gray-800 bg-white rounded-full px-1.5 py-0.5 outline-none shadow-inner border border-yellow-400"
              />
            )}
            <span>times</span>
          </div>
        );

      default:
        return <span>{block.label || block.type}</span>;
    }
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
      className={`group relative select-none rounded-md px-3 py-2 text-xs font-semibold shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing border ${
        color.bg
      } ${color.border} ${color.text} ${
        isDragging ? "opacity-40 scale-95" : "hover:shadow-lg"
      } ${isTemplate ? "hover:scale-105" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">{renderContent()}</div>

        {/* Delete button when in MidArea */}
        {!isTemplate && onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Remove block"
            className="ml-2 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:bg-opacity-20 rounded-full w-5 h-5 flex items-center justify-center font-bold text-sm"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

function getCategoryForType(type) {
  if (type.startsWith("when_")) return "events";
  if (
    type === "move_steps" ||
    type === "turn_right" ||
    type === "turn_left" ||
    type === "goto_xy"
  )
    return "motion";
  if (type === "say_for" || type === "think_for") return "looks";
  if (type === "repeat") return "control";
  return "motion";
}
