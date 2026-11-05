import React from 'react';
import { RobloxGame, RobloxPart } from '../types/roblox';
import { Box, CheckSquare, Info, Palette, Sliders, Square, Tag, Zap } from 'lucide-react';

interface Props {
  game: RobloxGame;
  selectedPartId: string | null;
  onUpdateGame?: (updated: RobloxGame) => void;
}

export const PropertiesInspector: React.FC<Props> = ({
  game,
  selectedPartId,
}) => {
  const selectedPart = game.parts.find((p) => p.id === selectedPartId);

  return (
    <div className="flex flex-col h-full bg-[#181c28] border-l border-slate-800 select-none text-xs text-slate-300 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#1b2030] border-b border-slate-800 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
          Properties Inspector
        </span>
        <span className="text-[10px] text-slate-400 font-mono">
          {selectedPart ? selectedPart.type : 'Game Settings'}
        </span>
      </div>

      <div className="p-3 space-y-4">
        {selectedPart ? (
          /* Part Properties */
          <div className="space-y-3">
            {/* Identity Group */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Instance
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-slate-800">
                <span className="text-slate-400">Name</span>
                <span className="col-span-2 font-mono text-slate-200 truncate">{selectedPart.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-slate-800">
                <span className="text-slate-400">ClassName</span>
                <span className="col-span-2 font-mono text-slate-200">{selectedPart.type}</span>
              </div>
            </div>

            {/* Transform */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Transform (Vector3)
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-slate-800">
                <span className="text-slate-400">Position</span>
                <span className="col-span-2 font-mono text-slate-200 text-[11px]">
                  {selectedPart.position.map((n) => n.toFixed(1)).join(', ')}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-slate-800">
                <span className="text-slate-400">Size</span>
                <span className="col-span-2 font-mono text-slate-200 text-[11px]">
                  {selectedPart.size.map((n) => n.toFixed(1)).join(' × ')}
                </span>
              </div>
            </div>

            {/* Appearance */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Appearance
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-slate-800">
                <span className="text-slate-400">Color</span>
                <div className="col-span-2 flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border border-white/20 shadow-sm"
                    style={{ backgroundColor: selectedPart.color }}
                  />
                  <span className="font-mono text-slate-200">{selectedPart.color}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-slate-800">
                <span className="text-slate-400">Material</span>
                <span className="col-span-2 font-mono text-slate-200">{selectedPart.material}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-slate-800">
                <span className="text-slate-400">Transparency</span>
                <span className="col-span-2 font-mono text-slate-200">
                  {selectedPart.transparency.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Collision & Behavior */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Collision & Physics
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-slate-800">
                <span className="text-slate-400">Anchored</span>
                <span className="col-span-2 font-mono text-slate-200">
                  {selectedPart.anchored ? 'true' : 'false'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-slate-800">
                <span className="text-slate-400">CanCollide</span>
                <span className="col-span-2 font-mono text-slate-200">
                  {selectedPart.canCollide ? 'true' : 'false'}
                </span>
              </div>
            </div>

            {/* Tag / CollectionService */}
            {selectedPart.tag && (
              <div className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Tag className="w-3.5 h-3.5" />
                  Roblox CollectionService Tag
                </div>
                <div className="text-[11px] font-mono text-slate-300">
                  Tag: <span className="text-amber-300 font-bold">{selectedPart.tag}</span>
                </div>
                {selectedPart.tooltip && (
                  <p className="text-[11px] text-slate-400 mt-1 italic">
                    {selectedPart.tooltip}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Game Global Settings */
          <div className="space-y-4">
            <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-[11px] text-blue-300">
              Select any 3D part in the viewport or Explorer to view individual properties, or inspect global place settings below.
            </div>

            {/* Gameplay Tuning */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Player Gameplay Config
              </div>

              <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-slate-800">
                <span className="text-slate-400">WalkSpeed</span>
                <span className="col-span-2 font-mono text-slate-200 font-bold">
                  {game.gameplay.walkSpeed} studs/s
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-slate-800">
                <span className="text-slate-400">JumpPower</span>
                <span className="col-span-2 font-mono text-slate-200 font-bold">
                  {game.gameplay.jumpPower} studs
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-slate-800">
                <span className="text-slate-400">MaxHealth</span>
                <span className="col-span-2 font-mono text-slate-200 font-bold">
                  {game.gameplay.maxHealth} HP
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-slate-800">
                <span className="text-slate-400">Gravity</span>
                <span className="col-span-2 font-mono text-slate-200 font-bold">
                  {game.gameplay.gravity} studs/s²
                </span>
              </div>
            </div>

            {/* Lighting Tuning */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                Roblox Lighting Service
              </div>

              <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-slate-800">
                <span className="text-slate-400">Technology</span>
                <span className="col-span-2 font-mono text-purple-300 font-semibold">
                  {game.lighting.technology}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-slate-800">
                <span className="text-slate-400">ClockTime</span>
                <span className="col-span-2 font-mono text-slate-200 font-bold">
                  {game.lighting.clockTime}:00
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-slate-800">
                <span className="text-slate-400">Brightness</span>
                <span className="col-span-2 font-mono text-slate-200 font-bold">
                  {game.lighting.brightness}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1 items-center border-b border-slate-800">
                <span className="text-slate-400">FogEnd</span>
                <span className="col-span-2 font-mono text-slate-200 font-bold">
                  {game.lighting.fogEnd} studs
                </span>
              </div>
            </div>

            {/* Objective */}
            <div className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                Game Objective
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {game.gameplay.objective}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
