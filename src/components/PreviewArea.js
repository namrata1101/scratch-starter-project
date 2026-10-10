import React, { useState, useRef, useEffect } from "react";
import { useScratch } from "../context/ScratchContext";
import CatSprite from "./CatSprite";
import Icon from "./Icon";

const STAGE_WIDTH = 480;
const STAGE_HEIGHT = 360;

const COLOR_OPTIONS = [
  { label: "Orange", hex: "#FFAB19" },
  { label: "Blue", hex: "#4C97FF" },
  { label: "Purple", hex: "#9966FF" },
  { label: "Green", hex: "#2ECC71" },
  { label: "Pink", hex: "#FF6680" },
  { label: "Cyan", hex: "#00D2D3" },
];

export default function PreviewArea() {
  const {
    sprites,
    activeSpriteId,
    activeSprite,
    setActiveSpriteId,
    updateSprite,
    addSprite,
    deleteSprite,
    isPlaying,
    playAll,
    stopAll,
    collisionNotification,
    runSingleSprite,
  } = useScratch();

  const stageRef = useRef(null);
  const [draggingSpriteId, setDraggingSpriteId] = useState(null);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  // Handle Dragging Sprite on Stage
  const handleStageMouseDown = (e, spriteId) => {
    e.stopPropagation();
    setActiveSpriteId(spriteId);
    setDraggingSpriteId(spriteId);
  };

  const handleStageMouseMove = (e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();

    // Scale factors in case stage is resized or scaled
    const scaleX = STAGE_WIDTH / rect.width;
    const scaleY = STAGE_HEIGHT / rect.height;

    const mousePixelX = (e.clientX - rect.left) * scaleX;
    const mousePixelY = (e.clientY - rect.top) * scaleY;

    const scratchX = Math.max(
      -230,
      Math.min(230, Math.round(mousePixelX - STAGE_WIDTH / 2))
    );
    const scratchY = Math.max(
      -170,
      Math.min(170, Math.round(STAGE_HEIGHT / 2 - mousePixelY))
    );

    setMouseCoords({ x: scratchX, y: scratchY });
  };

  useEffect(() => {
    if (!draggingSpriteId) return;

    const handleGlobalMouseMove = (e) => {
      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const scaleX = STAGE_WIDTH / rect.width;
      const scaleY = STAGE_HEIGHT / rect.height;

      const mousePixelX = (e.clientX - rect.left) * scaleX;
      const mousePixelY = (e.clientY - rect.top) * scaleY;

      const scratchX = Math.max(
        -230,
        Math.min(230, Math.round(mousePixelX - STAGE_WIDTH / 2))
      );
      const scratchY = Math.max(
        -170,
        Math.min(170, Math.round(STAGE_HEIGHT / 2 - mousePixelY))
      );

      setMouseCoords({ x: scratchX, y: scratchY });
      updateSprite(draggingSpriteId, { x: scratchX, y: scratchY });
    };

    const handleGlobalMouseUp = () => {
      setDraggingSpriteId(null);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [draggingSpriteId, updateSprite]);

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 border-l border-gray-200 select-none">
      {/* 1. Stage Header */}
      <div className="bg-white px-3 py-2 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={playAll}
            disabled={isPlaying}
            title="Start"
            className="w-7 h-7 rounded-full bg-green-500 hover:bg-green-600 active:scale-95 flex items-center justify-center text-white shadow-sm transition-all"
          >
            <Icon name="flag" size={13} className="text-white" />
          </button>
          <button
            onClick={stopAll}
            disabled={!isPlaying}
            title="Stop"
            className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-all ${
              isPlaying
                ? "bg-red-500 hover:bg-red-600 active:scale-95 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Icon name="stop" size={11} className="fill-current" />
          </button>
        </div>

        {/* Live mouse position */}
        <div className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
          x: {mouseCoords.x} y: {mouseCoords.y}
        </div>
      </div>

      {/* 2. Interactive Stage Canvas */}
      <div className="p-3 flex items-center justify-center bg-gray-100">
        <div
          ref={stageRef}
          onMouseMove={handleStageMouseMove}
          className="relative bg-white rounded-lg shadow-inner border border-gray-300 overflow-hidden cursor-crosshair"
          style={{
            width: `${STAGE_WIDTH}px`,
            height: `${STAGE_HEIGHT}px`,
            maxWidth: "100%",
          }}
        >
          {/* Subtle Stage Grid Axes */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="w-full h-px bg-gray-400 absolute top-1/2 transform -translate-y-1/2" />
            <div className="h-full w-px bg-gray-400 absolute left-1/2 transform -translate-x-1/2" />
          </div>

          {/* Collision Spark Marker Overlay on Stage */}
          {collisionNotification && collisionNotification.x !== undefined && (
            <div
              className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${STAGE_WIDTH / 2 + collisionNotification.x}px`,
                top: `${STAGE_HEIGHT / 2 - collisionNotification.y}px`,
              }}
            >
              <div className="w-16 h-16 rounded-full bg-yellow-400 opacity-60 animate-ping" />
              <span className="absolute inset-0 flex items-center justify-center text-2xl animate-bounce">
                💥
              </span>
            </div>
          )}

          {/* Collision Notification Banner Overlay */}
          {collisionNotification && (
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-40 bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-white font-extrabold text-xs px-4 py-2 rounded-full shadow-2xl flex items-center space-x-2 animate-bounce border-2 border-white">
              <span>⚡</span>
              <span>
                COLLISION! Swapped animations between {collisionNotification.sprite1} and {collisionNotification.sprite2}!
              </span>
              <span>⚡</span>
            </div>
          )}

          {/* Render All Sprites */}
          {sprites.map((sprite) => {
            if (!sprite.visible) return null;

            // Coordinate conversion
            const pixelX = STAGE_WIDTH / 2 + sprite.x;
            const pixelY = STAGE_HEIGHT / 2 - sprite.y;
            const isSelected = sprite.id === activeSpriteId;

            return (
              <div
                key={sprite.id}
                onMouseDown={(e) => handleStageMouseDown(e, sprite.id)}
                onClick={() => {
                  setActiveSpriteId(sprite.id);
                  runSingleSprite(sprite.id);
                }}
                className={`absolute select-none cursor-move transition-all duration-75 ${
                  isSelected ? "z-20 filter drop-shadow-md" : "z-10"
                }`}
                style={{
                  left: `${pixelX}px`,
                  top: `${pixelY}px`,
                  transform: `translate(-50%, -50%) rotate(${
                    sprite.direction - 90
                  }deg) scale(${sprite.size / 100})`,
                  transformOrigin: "center center",
                }}
              >
                {/* Speech / Thought Bubble */}
                {sprite.sayMessage && (
                  <div
                    style={{
                      transform: `rotate(${-(sprite.direction - 90)}deg)`,
                      transformOrigin: "bottom center",
                    }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 z-30 pointer-events-none"
                  >
                    {sprite.sayType === "say" ? (
                      <div className="relative bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-2xl shadow-xl border-2 border-gray-400 whitespace-nowrap min-w-max">
                        {sprite.sayMessage}
                        {/* Speech Bubble Tail */}
                        <div
                          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0"
                          style={{
                            borderLeft: "6px solid transparent",
                            borderRight: "6px solid transparent",
                            borderTop: "8px solid white",
                          }}
                        />
                      </div>
                    ) : (
                      <div className="relative bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-3xl shadow-xl border-2 border-gray-400 whitespace-nowrap min-w-max">
                        {sprite.sayMessage}
                        {/* Thought Bubble Dots */}
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-white rounded-full border border-gray-400" />
                        <div className="absolute -bottom-4 left-1/3 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full border border-gray-400" />
                      </div>
                    )}
                  </div>
                )}

                {/* Sprite Graphic */}
                <div
                  className={`p-1 rounded-lg transition-all ${
                    isSelected ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-white" : ""
                  }`}
                >
                  <CatSprite color={sprite.costumeColor} width={76} height={80} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Active Sprite Inspector & Controller */}
      {activeSprite && (
        <div className="bg-white p-3 border-y border-gray-200">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Sprite Inspector
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div>
              <label className="text-gray-500 font-medium block mb-0.5">Name</label>
              <input
                type="text"
                value={activeSprite.name}
                onChange={(e) => updateSprite(activeSprite.id, { name: e.target.value })}
                className="w-full bg-gray-100 border border-gray-300 rounded px-2 py-1 font-semibold text-gray-800"
              />
            </div>
            <div>
              <label className="text-gray-500 font-medium block mb-0.5">x</label>
              <input
                type="number"
                value={activeSprite.x}
                onChange={(e) =>
                  updateSprite(activeSprite.id, { x: Number(e.target.value) || 0 })
                }
                className="w-full bg-gray-100 border border-gray-300 rounded px-2 py-1 font-semibold text-gray-800"
              />
            </div>
            <div>
              <label className="text-gray-500 font-medium block mb-0.5">y</label>
              <input
                type="number"
                value={activeSprite.y}
                onChange={(e) =>
                  updateSprite(activeSprite.id, { y: Number(e.target.value) || 0 })
                }
                className="w-full bg-gray-100 border border-gray-300 rounded px-2 py-1 font-semibold text-gray-800"
              />
            </div>
            <div>
              <label className="text-gray-500 font-medium block mb-0.5">Direction</label>
              <input
                type="number"
                value={activeSprite.direction}
                onChange={(e) =>
                  updateSprite(activeSprite.id, { direction: Number(e.target.value) || 0 })
                }
                className="w-full bg-gray-100 border border-gray-300 rounded px-2 py-1 font-semibold text-gray-800"
              />
            </div>
          </div>

          {/* Color Palettes for Costume */}
          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs font-medium text-gray-500">Costume Color:</span>
            <div className="flex items-center space-x-1.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => updateSprite(activeSprite.id, { costumeColor: c.hex })}
                  title={c.label}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${
                    activeSprite.costumeColor === c.hex
                      ? "border-blue-600 scale-110 shadow"
                      : "border-white hover:scale-105"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Sprite List Manager */}
      <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Sprites ({sprites.length})
          </span>
          <button
            onClick={addSprite}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow transition-all"
            title="Create a new Sprite"
          >
            <Icon name="plus" size={11} className="text-white" />
            <span>Add Sprite</span>
          </button>
        </div>

        {/* Sprites Grid */}
        <div className="grid grid-cols-2 gap-2">
          {sprites.map((s) => {
            const isSelected = s.id === activeSpriteId;
            return (
              <div
                key={s.id}
                onClick={() => setActiveSpriteId(s.id)}
                className={`group relative p-2.5 rounded-lg border-2 cursor-pointer transition-all flex items-center space-x-2.5 ${
                  isSelected
                    ? "bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-300"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:shadow"
                }`}
              >
                {/* Thumbnail */}
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center p-1 border border-gray-200"
                  style={{ backgroundColor: "#F8FAFC" }}
                >
                  <CatSprite color={s.costumeColor} width={28} height={30} />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-800 truncate">
                    {s.name}
                  </h4>
                  <p className="text-[10px] text-gray-500">
                    x: {s.x}, y: {s.y}
                  </p>
                  <span className="text-[10px] text-blue-600 font-semibold">
                    {s.blocks.length} block{s.blocks.length === 1 ? "" : "s"}
                  </span>
                </div>

                {/* Delete Sprite Button */}
                {sprites.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSprite(s.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 p-1 rounded transition-opacity"
                    title="Delete sprite"
                  >
                    <Icon name="trash" size={12} className="fill-current" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
