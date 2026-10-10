import React, { useState } from "react";
import { useScratch, BLOCK_DEFINITIONS } from "../context/ScratchContext";
import BlockItem from "./BlockItem";
import Icon from "./Icon";

export default function Sidebar() {
  const { addBlockToSprite, activeSpriteId } = useScratch();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All", color: "bg-gray-500", dot: "bg-gray-400" },
    { id: "motion", label: "Motion", color: "bg-blue-500", dot: "bg-blue-500" },
    { id: "looks", label: "Looks", color: "bg-purple-500", dot: "bg-purple-500" },
    { id: "control", label: "Control", color: "bg-yellow-600", dot: "bg-yellow-600" },
    { id: "events", label: "Events", color: "bg-yellow-500", dot: "bg-yellow-500" },
  ];

  const handleDragStart = (e, block) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        source: "sidebar",
        blockType: block.type,
        defaultParams: block.defaultParams,
      })
    );
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleBlockClick = (block) => {
    addBlockToSprite(activeSpriteId, block.type, block.defaultParams);
  };

  const filteredBlocks =
    selectedCategory === "all"
      ? BLOCK_DEFINITIONS
      : BLOCK_DEFINITIONS.filter((b) => b.category === selectedCategory);

  return (
    <div className="w-64 flex-none h-full bg-gray-50 flex flex-col border-r border-gray-200 select-none">
      {/* Category Pills Header */}
      <div className="p-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Block Palette
        </div>
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? `${cat.color} text-white shadow`
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${cat.dot}`} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Blocks Palette List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Render sections or all blocks */}
        {["events", "motion", "looks", "control"].map((catName) => {
          if (selectedCategory !== "all" && selectedCategory !== catName) return null;
          const sectionBlocks = BLOCK_DEFINITIONS.filter((b) => b.category === catName);
          if (sectionBlocks.length === 0) return null;

          return (
            <div key={catName} className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-700 uppercase tracking-wider border-b pb-1 border-gray-200">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    catName === "events"
                      ? "bg-yellow-500"
                      : catName === "motion"
                      ? "bg-blue-500"
                      : catName === "looks"
                      ? "bg-purple-500"
                      : "bg-yellow-600"
                  }`}
                />
                <span>{catName}</span>
              </div>

              <div className="space-y-2 pl-1">
                {sectionBlocks.map((block) => (
                  <div key={block.type} className="transform transition-transform hover:-translate-y-0.5">
                    <BlockItem
                      block={block}
                      isTemplate={true}
                      onClick={() => handleBlockClick(block)}
                      onDragStart={(e) => handleDragStart(e, block)}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Helpful Hint Footer */}
      <div className="p-2.5 bg-blue-50 border-t border-blue-100 text-xs text-blue-700 text-center font-medium">
        💡 Drag blocks to Mid Area or click to add
      </div>
    </div>
  );
}
