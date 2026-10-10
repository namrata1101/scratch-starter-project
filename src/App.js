import React from "react";
import { ScratchProvider } from "./context/ScratchContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

export default function App() {
  return (
    <ScratchProvider>
      <div className="h-screen flex flex-col font-sans bg-gray-100 overflow-hidden">
        {/* Top Navigation Bar with Controls & Hero Feature */}
        <Navbar />

        {/* Main Application Body */}
        <div className="flex-1 flex flex-row overflow-hidden">
          {/* Left Panel: Blocks Palette + Script Workspace */}
          <div className="flex-1 flex flex-row bg-white border-r border-gray-200 overflow-hidden">
            <Sidebar />
            <MidArea />
          </div>

          {/* Right Panel: Interactive Playground Stage + Sprite Management */}
          <div
            style={{ width: "520px" }}
            className="flex-none flex flex-col bg-white overflow-hidden shadow-lg z-10"
          >
            <PreviewArea />
          </div>
        </div>
      </div>
    </ScratchProvider>
  );
}
