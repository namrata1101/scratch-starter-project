import React, { useState } from "react";
import { useScratch } from "../context/ScratchContext";
import BlockItem from "./BlockItem";
import Icon from "./Icon";

export default function MidArea() {
  const {
    activeSprite,
    activeSpriteId,
    addBlockToSprite,
    updateBlockParams,
    reorderBlocks,
    deleteBlock,
    clearBlocks,
    runSingleSprite,
    executeSingleBlock,
    isPlaying,
  } = useScratch();

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);
  const [isDragOverCanvas, setIsDragOverCanvas] = useState(false);

  if (!activeSprite) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-gray-50 text-gray-400">
        Select a sprite to edit scripts
      </div>
    );
  }

  // Handle Drag from Sidebar or Reorder within MidArea
  const handleDropOnCanvas = (e) => {
    e.preventDefault();
    setIsDragOverCanvas(false);
    setDropTargetIndex(null);

    const rawData = e.dataTransfer.getData("application/json");
    if (!rawData) return;

    try {
      const data = JSON.parse(rawData);
      if (data.source === "sidebar") {
        // Add new block to active sprite
        addBlockToSprite(activeSpriteId, data.blockType, data.defaultParams);
      } else if (data.source === "midarea" && data.index !== undefined) {
        // Reorder to the end
        if (draggedIndex !== null && draggedIndex !== activeSprite.blocks.length - 1) {
          reorderBlocks(activeSpriteId, draggedIndex, activeSprite.blocks.length - 1);
        }
      }
    } catch (err) {
      console.error("Drop error", err);
    }
    setDraggedIndex(null);
  };

  const handleDropOnBlock = (e, targetIdx) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverCanvas(false);
    setDropTargetIndex(null);

    const rawData = e.dataTransfer.getData("application/json");
    if (!rawData) return;

    try {
      const data = JSON.parse(rawData);
      if (data.source === "sidebar") {
        // Insert new block at specific target index
        addBlockToSprite(activeSpriteId, data.blockType, data.defaultParams, targetIdx);
      } else if (data.source === "midarea") {
        if (draggedIndex !== null && draggedIndex !== targetIdx) {
          reorderBlocks(activeSpriteId, draggedIndex, targetIdx);
        }
      }
    } catch (err) {
      console.error("Drop on block error", err);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="flex-1 h-full bg-gray-100 flex flex-col overflow-hidden relative">
      {/* Top Action Bar for Selected Sprite */}
      <div className="bg-white px-4 py-2.5 border-b border-gray-200 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center space-x-2">
          <span
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: activeSprite.costumeColor }}
          />
          <span className="font-bold text-sm text-gray-800">
            {activeSprite.name}’s Scripts
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {activeSprite.blocks.length} block{activeSprite.blocks.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => runSingleSprite(activeSpriteId)}
            disabled={isPlaying || activeSprite.blocks.length === 0}
            className={`flex items-center space-x-1 px-3 py-1 text-xs font-bold rounded shadow transition-all ${
              isPlaying || activeSprite.blocks.length === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
            }`}
            title="Run this sprite's script only"
          >
            <Icon name="play" size={12} className="text-white" />
            <span>Test Script</span>
          </button>

          <button
            onClick={() => clearBlocks(activeSpriteId)}
            disabled={activeSprite.blocks.length === 0}
            className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded border transition-all ${
              activeSprite.blocks.length === 0
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-gray-300 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-300 active:scale-95"
            }`}
            title="Clear all blocks in this script"
          >
            <Icon name="trash" size={11} className="fill-current" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Script Canvas Area (Drag-and-Drop Workspace) */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOverCanvas(true);
        }}
        onDragLeave={() => setIsDragOverCanvas(false)}
        onDrop={handleDropOnCanvas}
        className={`flex-1 overflow-y-auto p-4 transition-colors duration-150 ${
          isDragOverCanvas ? "bg-blue-50 bg-opacity-70 ring-2 ring-blue-400 ring-inset" : "bg-gray-100"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(203, 213, 225, 0.45) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      >
        {activeSprite.blocks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-white bg-opacity-60 m-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-3 shadow-inner">
              <Icon name="play" size={28} className="text-blue-500" />
            </div>
            <h3 className="font-bold text-gray-700 text-base mb-1">
              Workspace is empty
            </h3>
            <p className="text-xs text-gray-500 max-w-sm">
              Drag Motion, Looks, or Control blocks from the left sidebar here, or click on them to assemble your code stack!
            </p>
          </div>
        ) : (
          <div className="max-w-md space-y-1.5 pb-16">
            {activeSprite.blocks.map((block, idx) => (
              <div
                key={block.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDropTargetIndex(idx);
                }}
                onDrop={(e) => handleDropOnBlock(e, idx)}
                className="relative"
              >
                {/* Visual Drop Insertion Line */}
                {dropTargetIndex === idx && (
                  <div className="h-1 bg-blue-500 rounded-full mb-1 shadow-md animate-pulse" />
                )}

                <BlockItem
                  block={block}
                  isTemplate={false}
                  isDragging={draggedIndex === idx}
                  onClick={() => executeSingleBlock(activeSpriteId, block)}
                  onDragStart={(e) => {
                    setDraggedIndex(idx);
                    e.dataTransfer.setData(
                      "application/json",
                      JSON.stringify({
                        source: "midarea",
                        blockId: block.id,
                        index: idx,
                      })
                    );
                  }}
                  onParamChange={(key, val) =>
                    updateBlockParams(activeSpriteId, block.id, key, val)
                  }
                  onDelete={() => deleteBlock(activeSpriteId, block.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workspace Footer Info */}
      <div className="bg-white border-t border-gray-200 px-3 py-1.5 text-xs text-gray-500 flex items-center justify-between">
        <span>Click blocks to run individually • Drag to reorder</span>
        <span>Sprite ID: {activeSprite.id}</span>
      </div>
    </div>
  );
}
