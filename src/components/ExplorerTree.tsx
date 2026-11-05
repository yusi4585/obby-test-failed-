import React, { useState } from 'react';
import { RobloxGame, RobloxPart } from '../types/roblox';
import {
  Box,
  ChevronDown,
  ChevronRight,
  Code,
  Folder,
  Globe,
  Layers,
  Lightbulb,
  Radio,
  Sliders,
  Sun,
  User,
} from 'lucide-react';

interface Props {
  game: RobloxGame;
  selectedPartId: string | null;
  onSelectPart: (partId: string | null) => void;
  onSelectScript?: (scriptId: string) => void;
}

export const ExplorerTree: React.FC<Props> = ({
  game,
  selectedPartId,
  onSelectPart,
}) => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({
    workspace: true,
    map: true,
    lighting: true,
    serverScriptService: true,
    starterPlayer: true,
    replicatedStorage: false,
    starterGui: false,
  });

  const toggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col h-full bg-[#181c28] border-r border-slate-800 select-none text-xs text-slate-300 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#1b2030] border-b border-slate-800 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-red-500" />
          Explorer
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
          {game.parts.length} Inst
        </span>
      </div>

      <div className="p-2 space-y-0.5 font-sans">
        {/* Workspace Node */}
        <div>
          <div
            onClick={() => toggle('workspace')}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-slate-800/60 cursor-pointer text-slate-200 font-semibold"
          >
            {expanded.workspace ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Workspace</span>
          </div>

          {expanded.workspace && (
            <div className="ml-4 pl-2 border-l border-slate-800/80 space-y-0.5 mt-0.5">
              {/* GameMap Folder */}
              <div>
                <div
                  onClick={() => toggle('map')}
                  className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-800/60 cursor-pointer text-slate-300"
                >
                  {expanded.map ? (
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                  )}
                  <Folder className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-medium">GameMap</span>
                  <span className="text-[10px] text-slate-500 font-mono">({game.parts.length})</span>
                </div>

                {expanded.map && (
                  <div className="ml-3 pl-2 border-l border-slate-800/80 space-y-0.5 max-h-56 overflow-y-auto">
                    {game.parts.map((part) => {
                      const isSelected = selectedPartId === part.id;
                      return (
                        <div
                          key={part.id}
                          onClick={() => onSelectPart(part.id)}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition text-[11px] truncate ${
                            isSelected
                              ? 'bg-blue-600/20 text-blue-300 font-semibold border-l-2 border-blue-500'
                              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                          }`}
                        >
                          <Box
                            className="w-3 h-3 shrink-0"
                            style={{ color: part.color }}
                          />
                          <span className="truncate">{part.name}</span>
                          {part.tag && (
                            <span className="ml-auto text-[9px] px-1 rounded bg-slate-900/60 text-slate-500">
                              {part.tag}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Lighting Node */}
        <div>
          <div
            onClick={() => toggle('lighting')}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-slate-800/60 cursor-pointer text-slate-200 font-semibold"
          >
            {expanded.lighting ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Lighting</span>
          </div>

          {expanded.lighting && (
            <div className="ml-4 pl-2 border-l border-slate-800/80 space-y-0.5 text-[11px] text-slate-400">
              <div className="px-2 py-0.5">Atmosphere</div>
              <div className="px-2 py-0.5">Skybox</div>
              <div className="px-2 py-0.5">ColorCorrection</div>
              {game.lighting.sunRays && <div className="px-2 py-0.5">SunRaysEffect</div>}
              {game.lighting.bloom && <div className="px-2 py-0.5">BloomEffect</div>}
            </div>
          )}
        </div>

        {/* ServerScriptService */}
        <div>
          <div
            onClick={() => toggle('serverScriptService')}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-slate-800/60 cursor-pointer text-slate-200 font-semibold"
          >
            {expanded.serverScriptService ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
            <Code className="w-3.5 h-3.5 text-emerald-400" />
            <span>ServerScriptService</span>
          </div>

          {expanded.serverScriptService && (
            <div className="ml-4 pl-2 border-l border-slate-800/80 space-y-0.5 text-[11px] text-slate-400">
              {game.scripts
                .filter((s) => s.target === 'ServerScriptService')
                .map((s) => (
                  <div key={s.id} className="px-2 py-0.5 flex items-center gap-1 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{s.name}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* ReplicatedStorage */}
        <div>
          <div
            onClick={() => toggle('replicatedStorage')}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-slate-800/60 cursor-pointer text-slate-200 font-semibold"
          >
            {expanded.replicatedStorage ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
            <Folder className="w-3.5 h-3.5 text-cyan-400" />
            <span>ReplicatedStorage</span>
          </div>

          {expanded.replicatedStorage && (
            <div className="ml-4 pl-2 border-l border-slate-800/80 space-y-0.5 text-[11px] text-slate-400">
              <div className="px-2 py-0.5 text-slate-300">Remotes (Events)</div>
              {game.scripts
                .filter((s) => s.target === 'ReplicatedStorage')
                .map((s) => (
                  <div key={s.id} className="px-2 py-0.5 text-slate-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{s.name}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* StarterPlayer */}
        <div>
          <div
            onClick={() => toggle('starterPlayer')}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-slate-800/60 cursor-pointer text-slate-200 font-semibold"
          >
            {expanded.starterPlayer ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
            <User className="w-3.5 h-3.5 text-purple-400" />
            <span>StarterPlayer</span>
          </div>

          {expanded.starterPlayer && (
            <div className="ml-4 pl-2 border-l border-slate-800/80 space-y-0.5 text-[11px] text-slate-400">
              <div className="px-2 py-0.5 text-slate-300">StarterPlayerScripts</div>
              {game.scripts
                .filter((s) => s.target === 'StarterPlayerScripts')
                .map((s) => (
                  <div key={s.id} className="ml-2 px-2 py-0.5 text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>{s.name}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
