import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

const ScratchContext = createContext(null);

export const BLOCK_DEFINITIONS = [
  // Events
  {
    type: "when_flag_clicked",
    category: "events",
    label: "When flag clicked",
    defaultParams: {},
  },
  {
    type: "when_sprite_clicked",
    category: "events",
    label: "When this sprite clicked",
    defaultParams: {},
  },
  // Motion
  {
    type: "move_steps",
    category: "motion",
    label: "Move",
    defaultParams: { steps: 10 },
  },
  {
    type: "turn_right",
    category: "motion",
    label: "Turn right",
    defaultParams: { degrees: 15 },
  },
  {
    type: "turn_left",
    category: "motion",
    label: "Turn left",
    defaultParams: { degrees: 15 },
  },
  {
    type: "goto_xy",
    category: "motion",
    label: "Go to x: y:",
    defaultParams: { x: 0, y: 0 },
  },
  // Looks
  {
    type: "say_for",
    category: "looks",
    label: "Say for seconds",
    defaultParams: { message: "Hello!", seconds: 2 },
  },
  {
    type: "think_for",
    category: "looks",
    label: "Think for seconds",
    defaultParams: { message: "Hmm...", seconds: 2 },
  },
  // Control
  {
    type: "repeat",
    category: "control",
    label: "Repeat animation",
    defaultParams: { times: 15 },
  },
];

const PRESET_COLORS = [
  "#FFAB19", // Classic Scratch Orange
  "#4C97FF", // Blue
  "#9966FF", // Purple
  "#2ECC71", // Emerald Green
  "#FF6680", // Pink/Rose
  "#00D2D3", // Cyan
];

const INITIAL_SPRITES = [
  {
    id: "sprite-1",
    name: "Character 1",
    costumeColor: "#FFAB19",
    x: -120,
    y: 0,
    direction: 90,
    size: 100,
    visible: true,
    sayMessage: "",
    sayType: "say",
    blocks: [
      { id: "b-1", type: "when_flag_clicked", params: {} },
      { id: "b-2", type: "move_steps", params: { steps: 10 } },
      { id: "b-3", type: "repeat", params: { times: 25 } },
    ],
  },
  {
    id: "sprite-2",
    name: "Character 2",
    costumeColor: "#4C97FF",
    x: 120,
    y: 0,
    direction: 90,
    size: 100,
    visible: true,
    sayMessage: "",
    sayType: "say",
    blocks: [
      { id: "b-4", type: "when_flag_clicked", params: {} },
      { id: "b-5", type: "move_steps", params: { steps: -10 } },
      { id: "b-6", type: "repeat", params: { times: 25 } },
    ],
  },
];

export function ScratchProvider({ children }) {
  const [sprites, setSprites] = useState(INITIAL_SPRITES);
  const [activeSpriteId, setActiveSpriteId] = useState("sprite-1");
  const [isPlaying, setIsPlaying] = useState(false);
  const [collisionNotification, setCollisionNotification] = useState(null);
  const [heroCollisionEnabled, setHeroCollisionEnabled] = useState(true);

  const isRunningRef = useRef(false);
  const spritesRef = useRef(sprites);
  spritesRef.current = sprites;

  const collisionCooldownRef = useRef(0);
  const activeBubbleTimers = useRef({});

  // Active sprite helper
  const activeSprite = sprites.find((s) => s.id === activeSpriteId) || sprites[0];

  // Helper to update a specific sprite
  const updateSprite = useCallback((id, updates) => {
    spritesRef.current = spritesRef.current.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    );
    setSprites([...spritesRef.current]);
  }, []);

  // Add new sprite
  const addSprite = useCallback(() => {
    const nextIndex = spritesRef.current.length + 1;
    const color = PRESET_COLORS[(spritesRef.current.length) % PRESET_COLORS.length];
    const newSprite = {
      id: `sprite-${Date.now()}`,
      name: `Character ${nextIndex}`,
      costumeColor: color,
      x: Math.round((Math.random() - 0.5) * 160),
      y: Math.round((Math.random() - 0.5) * 120),
      direction: 90,
      size: 100,
      visible: true,
      sayMessage: "",
      sayType: "say",
      blocks: [
        { id: `b-${Date.now()}-1`, type: "when_flag_clicked", params: {} },
        { id: `b-${Date.now()}-2`, type: "move_steps", params: { steps: 10 } },
        { id: `b-${Date.now()}-3`, type: "turn_right", params: { degrees: 15 } },
      ],
    };
    spritesRef.current = [...spritesRef.current, newSprite];
    setSprites([...spritesRef.current]);
    setActiveSpriteId(newSprite.id);
  }, []);

  // Delete sprite
  const deleteSprite = useCallback((id) => {
    if (spritesRef.current.length <= 1) return;
    const filtered = spritesRef.current.filter((s) => s.id !== id);
    spritesRef.current = filtered;
    setSprites([...filtered]);
    if (activeSpriteId === id) {
      setActiveSpriteId(filtered[0].id);
    }
  }, [activeSpriteId]);

  // Add block to sprite script
  const addBlockToSprite = useCallback((spriteId, blockType, defaultParams = {}, targetIndex = -1) => {
    const newBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: blockType,
      params: { ...defaultParams },
    };
    spritesRef.current = spritesRef.current.map((s) => {
      if (s.id !== spriteId) return s;
      const newBlocks = [...s.blocks];
      if (targetIndex >= 0 && targetIndex <= newBlocks.length) {
        newBlocks.splice(targetIndex, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }
      return { ...s, blocks: newBlocks };
    });
    setSprites([...spritesRef.current]);
  }, []);

  // Update block parameter
  const updateBlockParams = useCallback((spriteId, blockId, paramKey, paramValue) => {
    spritesRef.current = spritesRef.current.map((s) => {
      if (s.id !== spriteId) return s;
      return {
        ...s,
        blocks: s.blocks.map((b) =>
          b.id === blockId
            ? { ...b, params: { ...b.params, [paramKey]: paramValue } }
            : b
        ),
      };
    });
    setSprites([...spritesRef.current]);
  }, []);

  // Reorder blocks
  const reorderBlocks = useCallback((spriteId, fromIndex, toIndex) => {
    spritesRef.current = spritesRef.current.map((s) => {
      if (s.id !== spriteId) return s;
      const newBlocks = [...s.blocks];
      const [moved] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, moved);
      return { ...s, blocks: newBlocks };
    });
    setSprites([...spritesRef.current]);
  }, []);

  // Delete block
  const deleteBlock = useCallback((spriteId, blockId) => {
    spritesRef.current = spritesRef.current.map((s) => {
      if (s.id !== spriteId) return s;
      return { ...s, blocks: s.blocks.filter((b) => b.id !== blockId) };
    });
    setSprites([...spritesRef.current]);
  }, []);

  // Clear all blocks for sprite
  const clearBlocks = useCallback((spriteId) => {
    spritesRef.current = spritesRef.current.map((s) => {
      if (s.id !== spriteId) return s;
      return { ...s, blocks: [] };
    });
    setSprites([...spritesRef.current]);
  }, []);

  // Clear speech / thought bubble
  const clearSpeech = useCallback((spriteId) => {
    if (activeBubbleTimers.current[spriteId]) {
      clearTimeout(activeBubbleTimers.current[spriteId]);
      delete activeBubbleTimers.current[spriteId];
    }
    updateSprite(spriteId, { sayMessage: "" });
  }, [updateSprite]);

  // Set speech / thought bubble with duration
  const setSpeech = useCallback((spriteId, message, type = "say", seconds = 2) => {
    if (activeBubbleTimers.current[spriteId]) {
      clearTimeout(activeBubbleTimers.current[spriteId]);
    }
    updateSprite(spriteId, { sayMessage: message, sayType: type });
    activeBubbleTimers.current[spriteId] = setTimeout(() => {
      updateSprite(spriteId, { sayMessage: "" });
      delete activeBubbleTimers.current[spriteId];
    }, seconds * 1000);
  }, [updateSprite]);

  // Collision detection & Hero Feature Swap
  const checkCollisionsAndSwap = useCallback(() => {
    if (!heroCollisionEnabled) return;
    const currentSprites = spritesRef.current;
    if (currentSprites.length < 2) return;

    const now = Date.now();
    if (now - collisionCooldownRef.current < 1200) {
      return;
    }

    for (let i = 0; i < currentSprites.length; i++) {
      for (let j = i + 1; j < currentSprites.length; j++) {
        const s1 = currentSprites[i];
        const s2 = currentSprites[j];
        if (!s1.visible || !s2.visible) continue;

        // Calculate distance between centers
        const dx = s1.x - s2.x;
        const dy = s1.y - s2.y;
        const dist = Math.hypot(dx, dy);

        // Collision threshold (70px)
        if (dist < 70) {
          collisionCooldownRef.current = now;

          // Swap animations / scripts between s1 and s2 synchronously
          const copy = [...spritesRef.current];
          const idx1 = copy.findIndex((s) => s.id === s1.id);
          const idx2 = copy.findIndex((s) => s.id === s2.id);
          if (idx1 !== -1 && idx2 !== -1) {
            const tempBlocks = copy[idx1].blocks;
            copy[idx1] = { ...copy[idx1], blocks: copy[idx2].blocks };
            copy[idx2] = { ...copy[idx2], blocks: tempBlocks };
          }
          spritesRef.current = copy;
          setSprites([...copy]);

          // Show collision toast notification with collision position
          setCollisionNotification({
            sprite1: s1.name,
            sprite2: s2.name,
            x: Math.round((s1.x + s2.x) / 2),
            y: Math.round((s1.y + s2.y) / 2),
            timestamp: now,
          });

          // Auto-hide toast after 3.2 seconds
          setTimeout(() => {
            setCollisionNotification((current) =>
              current && current.timestamp === now ? null : current
            );
          }, 3200);

          return;
        }
      }
    }
  }, [heroCollisionEnabled]);

  // Sleep utility for async step delays
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Execute a single block for a sprite
  const executeBlock = async (spriteId, block) => {
    if (!isRunningRef.current) return false;

    const currentSprite = spritesRef.current.find((s) => s.id === spriteId);
    if (!currentSprite) return false;

    switch (block.type) {
      case "move_steps": {
        const steps = Number(block.params.steps) || 0;
        const rad = (currentSprite.direction - 90) * (Math.PI / 180);
        let newX = currentSprite.x + steps * Math.cos(rad);
        let newY = currentSprite.y - steps * Math.sin(rad);

        // Constrain to Scratch playground boundaries (-230 to 230, -170 to 170)
        newX = Math.max(-230, Math.min(230, Math.round(newX)));
        newY = Math.max(-170, Math.min(170, Math.round(newY)));

        updateSprite(spriteId, { x: newX, y: newY });
        checkCollisionsAndSwap();
        await sleep(50);
        break;
      }
      case "turn_right": {
        const degrees = Number(block.params.degrees) || 0;
        let newDir =
          (((currentSprite.direction + degrees + 180) % 360) + 360) % 360 - 180;
        updateSprite(spriteId, { direction: newDir });
        await sleep(50);
        break;
      }
      case "turn_left": {
        const degrees = Number(block.params.degrees) || 0;
        let newDir =
          (((currentSprite.direction - degrees + 180) % 360) + 360) % 360 - 180;
        updateSprite(spriteId, { direction: newDir });
        await sleep(50);
        break;
      }
      case "goto_xy": {
        const targetX = Math.max(-230, Math.min(230, Number(block.params.x) || 0));
        const targetY = Math.max(-170, Math.min(170, Number(block.params.y) || 0));
        updateSprite(spriteId, { x: targetX, y: targetY });
        checkCollisionsAndSwap();
        await sleep(60);
        break;
      }
      case "say_for": {
        const msg = block.params.message || "Hello!";
        const sec = Math.max(0.5, Number(block.params.seconds) || 2);
        setSpeech(spriteId, msg, "say", sec);
        await sleep(sec * 1000);
        break;
      }
      case "think_for": {
        const msg = block.params.message || "Hmm...";
        const sec = Math.max(0.5, Number(block.params.seconds) || 2);
        setSpeech(spriteId, msg, "think", sec);
        await sleep(sec * 1000);
        break;
      }
      default:
        break;
    }
    return true;
  };

  // Run script for a sprite
  const runSpriteScript = async (spriteId) => {
    const sprite = spritesRef.current.find((s) => s.id === spriteId);
    if (!sprite || !sprite.blocks || sprite.blocks.length === 0) return;

    let repeatTimes = 1;
    const repeatBlock = sprite.blocks.find((b) => b.type === "repeat");
    if (repeatBlock) {
      repeatTimes = Math.max(1, Number(repeatBlock.params.times) || 15);
    }

    for (let r = 0; r < repeatTimes; r++) {
      if (!isRunningRef.current) break;

      // Always read the latest blocks for this sprite (in case swapped during collision!)
      const latestSprite = spritesRef.current.find((s) => s.id === spriteId);
      if (!latestSprite) break;

      const currentRepeat = latestSprite.blocks.find((b) => b.type === "repeat");
      if (currentRepeat) {
        const newRepeat = Math.max(1, Number(currentRepeat.params.times) || 15);
        if (newRepeat > repeatTimes) repeatTimes = newRepeat;
      }

      const currentActions = latestSprite.blocks.filter(
        (b) => b.type !== "when_flag_clicked" && b.type !== "when_sprite_clicked" && b.type !== "repeat"
      );

      for (const block of currentActions) {
        if (!isRunningRef.current) break;
        await executeBlock(spriteId, block);
      }
    }
  };

  // Play All Sprites
  const playAll = useCallback(async () => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    setIsPlaying(true);

    const promises = spritesRef.current.map((sprite) =>
      runSpriteScript(sprite.id)
    );

    await Promise.all(promises);

    isRunningRef.current = false;
    setIsPlaying(false);
  }, []);

  // Stop All Animations
  const stopAll = useCallback(() => {
    isRunningRef.current = false;
    setIsPlaying(false);
    // Clear speech bubbles
    spritesRef.current = spritesRef.current.map((s) => ({ ...s, sayMessage: "" }));
    setSprites([...spritesRef.current]);
    Object.keys(activeBubbleTimers.current).forEach((key) => {
      clearTimeout(activeBubbleTimers.current[key]);
    });
    activeBubbleTimers.current = {};
  }, []);

  // Reset All to default starting state
  const resetAll = useCallback(() => {
    stopAll();
    spritesRef.current = spritesRef.current.map((s, idx) => ({
      ...s,
      x: idx === 0 ? -120 : idx === 1 ? 120 : 0,
      y: 0,
      direction: 90,
      sayMessage: "",
    }));
    setSprites([...spritesRef.current]);
  }, [stopAll]);

  // Click on a specific sprite to run its script
  const runSingleSprite = useCallback(async (spriteId) => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    setIsPlaying(true);
    await runSpriteScript(spriteId);
    isRunningRef.current = false;
    setIsPlaying(false);
  }, []);

  // Execute single block individually (for testing in MidArea)
  const executeSingleBlock = useCallback(async (spriteId, block) => {
    const wasRunning = isRunningRef.current;
    isRunningRef.current = true;
    await executeBlock(spriteId, block);
    if (!wasRunning) {
      isRunningRef.current = false;
    }
  }, []);

  // Load Collision Demo (Hero Feature Presets)
  const loadCollisionDemo = useCallback(() => {
    stopAll();
    const demoSprites = [
      {
        id: "sprite-1",
        name: "Character 1",
        costumeColor: "#FFAB19", // Orange Cat
        x: -120,
        y: 0,
        direction: 90,
        size: 100,
        visible: true,
        sayMessage: "",
        sayType: "say",
        blocks: [
          { id: "demo-b1", type: "when_flag_clicked", params: {} },
          { id: "demo-b2", type: "move_steps", params: { steps: 10 } },
          { id: "demo-b3", type: "repeat", params: { times: 25 } },
        ],
      },
      {
        id: "sprite-2",
        name: "Character 2",
        costumeColor: "#4C97FF", // Blue Cat
        x: 120,
        y: 0,
        direction: 90,
        size: 100,
        visible: true,
        sayMessage: "",
        sayType: "say",
        blocks: [
          { id: "demo-b4", type: "when_flag_clicked", params: {} },
          { id: "demo-b5", type: "move_steps", params: { steps: -10 } },
          { id: "demo-b6", type: "repeat", params: { times: 25 } },
        ],
      },
    ];
    spritesRef.current = demoSprites;
    setSprites(demoSprites);
    setActiveSpriteId("sprite-1");
    setCollisionNotification({
      sprite1: "Character 1",
      sprite2: "Character 2",
      message: "Hero Collision Demo Loaded! Press Play to watch them collide and swap scripts!",
      timestamp: Date.now(),
    });
    setTimeout(() => {
      setCollisionNotification(null);
    }, 4500);
  }, [stopAll]);

  return (
    <ScratchContext.Provider
      value={{
        sprites,
        activeSpriteId,
        activeSprite,
        isPlaying,
        collisionNotification,
        heroCollisionEnabled,
        setHeroCollisionEnabled,
        setActiveSpriteId,
        updateSprite,
        addSprite,
        deleteSprite,
        addBlockToSprite,
        updateBlockParams,
        reorderBlocks,
        deleteBlock,
        clearBlocks,
        executeBlock,
        executeSingleBlock,
        playAll,
        stopAll,
        resetAll,
        runSingleSprite,
        loadCollisionDemo,
      }}
    >
      {children}
    </ScratchContext.Provider>
  );
}

export function useScratch() {
  const context = useContext(ScratchContext);
  if (!context) {
    throw new Error("useScratch must be used within a ScratchProvider");
  }
  return context;
}
