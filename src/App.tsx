import React, { useState } from 'react';
import { RobloxGame } from './types/roblox';
import { generateProceduralRobloxGame } from './utils/proceduralGenerator';
import { generateRbxlxXml, triggerFileDownload } from './utils/robloxExport';
import { RobloxViewport } from './components/RobloxViewport';
import { ExplorerTree } from './components/ExplorerTree';
import { PropertiesInspector } from './components/PropertiesInspector';
import { ScriptViewer } from './components/ScriptViewer';
import { DownloadHub } from './components/DownloadHub';
import {
  Code,
  Compass,
  Download,
  Flame,
  Gamepad2,
  HelpCircle,
  Laptop,
  Layers,
  Play,
  RotateCw,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';

const PRESETS = [
  { label: '🔥 Lava Obby 2026', prompt: 'A fiery lava obby with 8 stages, jump pads, speed strips, coins, and a golden trophy' },
  { label: '🏭 Tech Tycoon', prompt: 'An automated industrial factory tycoon with copper, silver, and gold droppers, conveyors, furnace collector, and wall upgrades' },
  { label: '🧟 Zombie Outbreak', prompt: 'A dark zombie survival wave defense game with a fortified bunker outpost, sniper tower, barricades, and blood moon lighting' },
  { label: '🐾 Cyber Pet Sim', prompt: 'A pet simulator with 4 egg hatching pedestals, tiered farming zones (Meadow, Desert, Volcano), and coins' },
  { label: '⚔️ Sword Arena', prompt: 'A competitive sword fighting arena with red vs blue team spawns, center mythic katana pedestal, and cover pillars' },
  { label: '⚡ Neon Speed Run', prompt: 'A high-speed cyber sprint track with glowing neon rails, accelerator booster pads, and a finish line' },
];

export default function App() {
  const [promptInput, setPromptInput] = useState('A fiery lava obby with 8 stages, jump pads, speed strips, coins, and a golden trophy');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'viewport' | 'scripts' | 'download' | 'overview'>('viewport');
  const [game, setGame] = useState<RobloxGame>(() =>
    generateProceduralRobloxGame('A fiery lava obby with 8 stages, jump pads, speed strips, coins, and a golden trophy')
  );
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [isPlayMode, setIsPlayMode] = useState(false);
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);

  // Core Prompt Generation Function
  const handleGenerateGame = async (customPrompt?: string) => {
    const targetPrompt = (customPrompt || promptInput).trim();
    if (!targetPrompt) return;

    setIsGenerating(true);
    setIsPlayMode(false);
    setSelectedPartId(null);
    setGenerationNotice('Synthesizing 3D world geometry, Luau scripts, and Roblox lighting...');

    try {
      // Call server backend for AI enhancement
      const res = await fetch('/api/generate-roblox-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: targetPrompt }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.game) {
          setGame(data.game);
          setGenerationNotice(
            data.isAiGenerated
              ? '✨ AI Synthesized custom Roblox game mechanics & world!'
              : '🚀 Procedural Roblox engine built all parts and scripts!'
          );
          setTimeout(() => setGenerationNotice(null), 3500);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend call failed, using client generator:', e);
    } finally {
      setIsGenerating(false);
    }

    // Client procedural fallback
    const fallbackGame = generateProceduralRobloxGame(targetPrompt);
    setGame(fallbackGame);
    setGenerationNotice('🚀 Procedural engine built all parts and scripts!');
    setTimeout(() => setGenerationNotice(null), 3000);
  };

  // Immediate Single-Prompt-to-Download Action
  const handleGenerateAndDownload = async () => {
    const targetPrompt = promptInput.trim();
    if (!targetPrompt) return;

    setIsGenerating(true);
    try {
      const generated = generateProceduralRobloxGame(targetPrompt);
      setGame(generated);

      const xml = generateRbxlxXml(generated);
      const cleanTitle = generated.title.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_');
      triggerFileDownload(`${cleanTitle}.rbxlx`, xml, 'application/xml');

      setGenerationNotice('✅ Game generated & .rbxlx downloaded immediately!');
      setTimeout(() => setGenerationNotice(null), 4000);
    } finally {
      setIsGenerating(false);
    }
  };

  // Direct 1-Click download for current game
  const handleQuickDownload = () => {
    const xml = generateRbxlxXml(game);
    const cleanTitle = game.title.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_');
    triggerFileDownload(`${cleanTitle}.rbxlx`, xml, 'application/xml');
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0e1017] text-slate-100 font-sans">
      {/* Top Studio Brand & Prompt Bar */}
      <header className="bg-[#141722] border-b border-slate-800 px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0 z-10 shadow-lg">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-red-900/30 transform -rotate-3">
              R
            </div>
            <div>
              <div className="font-black text-base tracking-tight text-white flex items-center gap-1.5 font-['Fredoka']">
                BloxCraft <span className="text-red-500">AI</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 font-mono font-normal">
                  STUDIO
                </span>
              </div>
              <div className="text-[10px] text-slate-400 -mt-0.5">
                Roblox Game Maker & Downloader
              </div>
            </div>
          </div>

          {/* Quick download button visible on mobile */}
          <button
            onClick={handleQuickDownload}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow transition"
          >
            <Download className="w-3.5 h-3.5" />
            .rbxlx
          </button>
        </div>

        {/* Central Single-Prompt Input Bar */}
        <div className="flex-1 max-w-3xl w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerateGame();
            }}
            className="relative flex items-center"
          >
            <div className="absolute left-3 text-slate-400 pointer-events-none">
              <Sparkles className="w-4 h-4 text-red-500" />
            </div>

            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Describe your dream Roblox game (e.g. Lava obby with falling platforms and speed coils)..."
              className="w-full pl-9 pr-36 py-2 bg-[#1b2030] border border-slate-700/80 hover:border-slate-600 focus:border-red-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition shadow-inner"
            />

            <div className="absolute right-1.5 flex items-center gap-1">
              <button
                type="submit"
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Building...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Top Right Quick Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Direct Generate & Download Button */}
          <button
            onClick={handleGenerateAndDownload}
            title="Generate and immediately download .rbxlx in 1 click"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Prompt to .rbxlx
          </button>

          {/* Quick Download .rbxlx */}
          <button
            onClick={handleQuickDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-950/30 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download .rbxlx
          </button>
        </div>
      </header>

      {/* Preset Prompt Chips Bar */}
      <div className="bg-[#121520] border-b border-slate-800/80 px-4 py-1.5 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
        <span className="text-slate-500 flex items-center gap-1 font-semibold shrink-0">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          Presets:
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setPromptInput(preset.prompt);
              handleGenerateGame(preset.prompt);
            }}
            className="px-2.5 py-1 rounded-md bg-[#191d2c] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition whitespace-nowrap cursor-pointer shrink-0"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Notification Toast */}
      {generationNotice && (
        <div className="bg-gradient-to-r from-red-600/90 to-amber-600/90 text-white text-xs px-4 py-1.5 font-medium flex items-center justify-between shrink-0 shadow">
          <span>{generationNotice}</span>
          <button
            onClick={() => setGenerationNotice(null)}
            className="text-white/80 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation Sub-Header */}
      <div className="bg-[#151924] border-b border-slate-800 px-4 py-2 flex items-center justify-between shrink-0">
        {/* View Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('viewport')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'viewport'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3D Viewport Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('scripts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'scripts'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Luau Scripts ({game.scripts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'download'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download & Export (.rbxlx / Rojo)</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Game Overview</span>
          </button>
        </div>

        {/* Sidebar Toggle Controls for Viewport */}
        {activeTab === 'viewport' && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <button
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className={`p-1.5 rounded border transition ${
                showLeftSidebar
                  ? 'bg-slate-800 border-slate-700 text-slate-200'
                  : 'bg-transparent border-slate-800 text-slate-500'
              }`}
              title="Toggle Explorer Sidebar"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className={`p-1.5 rounded border transition ${
                showRightSidebar
                  ? 'bg-slate-800 border-slate-700 text-slate-200'
                  : 'bg-transparent border-slate-800 text-slate-500'
              }`}
              title="Toggle Properties Sidebar"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Left Sidebar: Explorer Tree (Shown in Viewport Tab) */}
        {activeTab === 'viewport' && showLeftSidebar && (
          <div className="w-64 shrink-0 hidden md:block h-full">
            <ExplorerTree
              game={game}
              selectedPartId={selectedPartId}
              onSelectPart={(id) => setSelectedPartId(id)}
            />
          </div>
        )}

        {/* Center Canvas / Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full p-2 bg-[#0e1017]">
          {activeTab === 'viewport' && (
            <RobloxViewport
              game={game}
              selectedPartId={selectedPartId}
              onSelectPart={(id) => setSelectedPartId(id)}
              isPlayMode={isPlayMode}
              onTogglePlayMode={() => setIsPlayMode(!isPlayMode)}
            />
          )}

          {activeTab === 'scripts' && (
            <ScriptViewer scripts={game.scripts} />
          )}

          {activeTab === 'download' && (
            <DownloadHub game={game} />
          )}

          {activeTab === 'overview' && (
            <div className="h-full overflow-y-auto bg-[#141722] rounded-xl border border-slate-800 p-6 shadow-2xl space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">
                    Genre: {game.genre.toUpperCase()}
                  </span>
                  <h2 className="text-2xl font-black text-white mt-2 font-['Fredoka']">
                    {game.title}
                  </h2>
                  <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
                    {game.description}
                  </p>
                </div>
                <button
                  onClick={handleQuickDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download Place (.rbxlx)
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xs text-slate-400">Total 3D Parts</div>
                  <div className="text-2xl font-black text-white font-mono mt-1">
                    {game.parts.length}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xs text-slate-400">Stages / Zones</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                    {game.stats.totalStagesOrZones}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xs text-slate-400">Est. Playtime</div>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                    {game.stats.estimatedPlayTimeMinutes} min
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xs text-slate-400">Difficulty</div>
                  <div className="text-2xl font-black text-purple-400 font-mono mt-1">
                    {game.gameplay.difficulty}
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="bg-[#181c2b] p-5 rounded-2xl border border-slate-800">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Engineered Gameplay Features:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {game.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-slate-300 p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80"
                    >
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Properties Inspector (Shown in Viewport Tab) */}
        {activeTab === 'viewport' && showRightSidebar && (
          <div className="w-64 shrink-0 hidden lg:block h-full">
            <PropertiesInspector
              game={game}
              selectedPartId={selectedPartId}
            />
          </div>
        )}
      </div>
    </div>
  );
}
