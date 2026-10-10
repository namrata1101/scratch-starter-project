import React from "react";
import { useScratch } from "../context/ScratchContext";
import Icon from "./Icon";

export default function Navbar() {
  const {
    isPlaying,
    playAll,
    stopAll,
    resetAll,
    loadCollisionDemo,
    heroCollisionEnabled,
    setHeroCollisionEnabled,
  } = useScratch();

  return (
    <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md px-4 py-2.5 flex flex-wrap items-center justify-between z-20">
      {/* Left: Branding */}
      <div className="flex items-center space-x-3">
        <div className="bg-white p-1 rounded-lg shadow-sm flex items-center justify-center">
          <span className="text-xl font-extrabold text-blue-600 tracking-tight px-1">
            Scratch
          </span>
        </div>
        <div>
          <h1 className="text-sm font-bold leading-none tracking-wide text-white">
            Visual Code Editor
          </h1>
          <span className="text-xs text-blue-200">
            ReactJS Challenge • Motion, Looks & Hero Collision
          </span>
        </div>
      </div>

      {/* Center: Play, Stop, Reset Controls */}
      <div className="flex items-center space-x-2 my-1 sm:my-0">
        <button
          onClick={playAll}
          disabled={isPlaying}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs shadow-md transition-all ${
            isPlaying
              ? "bg-green-700 cursor-not-allowed opacity-75 ring-2 ring-green-300 animate-pulse"
              : "bg-green-500 hover:bg-green-600 active:scale-95"
          }`}
          title="Play All Sprites"
        >
          <Icon name="flag" size={14} className="text-white" />
          <span>{isPlaying ? "Running..." : "Play All"}</span>
        </button>

        <button
          onClick={stopAll}
          disabled={!isPlaying}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs shadow-md transition-all ${
            !isPlaying
              ? "bg-gray-400 bg-opacity-50 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 active:scale-95 text-white"
          }`}
          title="Stop All"
        >
          <Icon name="stop" size={12} className="text-white" />
          <span>Stop</span>
        </button>

        <button
          onClick={resetAll}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full font-bold text-xs bg-white bg-opacity-20 hover:bg-opacity-30 active:scale-95 shadow transition-all"
          title="Reset Sprites"
        >
          <Icon name="sync-alt" size={12} className="text-white" />
          <span>Reset</span>
        </button>
      </div>

      {/* Right: Hero Feature Controls */}
      <div className="flex items-center space-x-3">
        {/* Collision Demo Preset Button */}
        <button
          onClick={loadCollisionDemo}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-lg font-bold text-xs shadow hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          title="Load the 2-Character Collision Swap Demo from the assignment"
        >
          <Icon name="exchange-alt" size={13} className="text-gray-900" />
          <span>Load Collision Demo</span>
        </button>

        {/* Hero Feature Toggle */}
        <button
          onClick={() => setHeroCollisionEnabled(!heroCollisionEnabled)}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
            heroCollisionEnabled
              ? "bg-green-900 bg-opacity-40 border-green-300 text-green-200"
              : "bg-gray-800 bg-opacity-40 border-gray-400 text-gray-300"
          }`}
          title="Toggle Collision Animation Swap"
        >
          <span
            className={`w-2 h-2 rounded-full mr-1 ${
              heroCollisionEnabled ? "bg-green-400 animate-ping" : "bg-gray-400"
            }`}
          />
          <span>Hero Collision Swap: {heroCollisionEnabled ? "ON" : "OFF"}</span>
        </button>
      </div>
    </header>
  );
}
