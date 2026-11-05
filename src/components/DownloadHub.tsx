import React, { useState } from 'react';
import JSZip from 'jszip';
import { RobloxGame } from '../types/roblox';
import {
  generateCommandBarScript,
  generateRbxlxXml,
  generateRojoProjectJson,
  triggerFileDownload,
} from '../utils/robloxExport';
import {
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileArchive,
  FileCode,
  FolderTree,
  Laptop,
  PlayCircle,
  Share2,
  Sparkles,
} from 'lucide-react';

interface Props {
  game: RobloxGame;
}

export const DownloadHub: React.FC<Props> = ({ game }) => {
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // 1. Download .rbxlx Place file
  const handleDownloadRbxlx = () => {
    const xml = generateRbxlxXml(game);
    const cleanTitle = game.title.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_');
    triggerFileDownload(`${cleanTitle}.rbxlx`, xml, 'application/xml');
  };

  // 2. Download Command Bar .lua file
  const handleDownloadCommandLua = () => {
    const lua = generateCommandBarScript(game);
    const cleanTitle = game.title.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_');
    triggerFileDownload(`Install_${cleanTitle}_CommandBar.lua`, lua, 'text/plain');
  };

  // 3. Copy Command Bar script to clipboard
  const handleCopyCommand = () => {
    const lua = generateCommandBarScript(game);
    navigator.clipboard.writeText(lua);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2500);
  };

  // 4. Download Full Rojo Zip Project
  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const cleanTitle = game.title.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_');

      // Place file
      zip.file(`${cleanTitle}.rbxlx`, generateRbxlxXml(game));

      // Command Bar script
      zip.file(`install_command_bar.lua`, generateCommandBarScript(game));

      // Rojo config
      zip.file(`default.project.json`, generateRojoProjectJson(game));

      // Luau scripts folder structure
      const srcFolder = zip.folder('src')!;
      const serverFolder = srcFolder.folder('server')!;
      const clientFolder = srcFolder.folder('client')!;
      const sharedFolder = srcFolder.folder('shared')!;
      const guiFolder = srcFolder.folder('gui')!;

      game.scripts.forEach((script) => {
        if (script.target === 'ServerScriptService') {
          serverFolder.file(`${script.name}.server.luau`, script.code);
        } else if (script.target === 'StarterPlayerScripts') {
          clientFolder.file(`${script.name}.client.luau`, script.code);
        } else if (script.target === 'StarterGui') {
          guiFolder.file(`${script.name}.client.luau`, script.code);
        } else {
          sharedFolder.file(`${script.name}.luau`, script.code);
        }
      });

      // README Guide
      zip.file(
        'README.md',
        `# ${game.title}
Generated with BloxCraft AI Studio

## How to Play & Publish:
### Option 1: Direct Studio File (.rbxlx) - RECOMMENDED
1. Double-click '${cleanTitle}.rbxlx' to open it directly in Roblox Studio.
2. Press F5 (or click Play) to test the game locally.
3. In Roblox Studio menu, select: File -> 'Publish to Roblox As...'
4. Enter game name and configure avatar settings, then click 'Save'!

### Option 2: Command Bar Installer
1. Open any empty Roblox Studio baseplate.
2. Open View -> Command Bar at the bottom.
3. Paste the contents of 'install_command_bar.lua' and press Enter.

### Option 3: Rojo Sync
If you use Rojo in VSCode:
1. Run: rojo serve
2. In Studio, connect the Rojo plugin.

Game genre: ${game.genre}
Total parts: ${game.parts.length}
`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      triggerFileDownload(`${cleanTitle}_RobloxProject.zip`, blob, 'application/zip');
    } catch (err) {
      console.error('Failed to create zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#131620] rounded-xl border border-slate-800 overflow-y-auto p-4 sm:p-6 shadow-2xl">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
              <Download className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white font-['Fredoka']">
              Download & Export Game
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Choose your preferred format to load <span className="text-slate-200 font-semibold">{game.title}</span> directly into Roblox Studio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-red-900/20 transition cursor-pointer"
          >
            <FileArchive className="w-4 h-4" />
            {isZipping ? 'Packaging ZIP...' : 'Download Full Project (.ZIP)'}
          </button>
        </div>
      </div>

      {/* 3 Main Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Card 1: .RBXLX Place File (Primary) */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-b from-[#1b2030] to-[#161a27] border border-red-500/30 hover:border-red-500/60 transition shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-bl-xl uppercase tracking-wider">
            Most Popular
          </div>
          <div>
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4 border border-red-500/30">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-['Fredoka'] mb-1">
              Roblox Studio Place (.rbxlx)
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Native Roblox XML place file. Double-click to open immediately in Roblox Studio with all {game.parts.length} parts, lighting, and Luau scripts ready.
            </p>
          </div>

          <button
            onClick={handleDownloadRbxlx}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download .rbxlx File
          </button>
        </div>

        {/* Card 2: Command Bar Generator */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-[#171a26] border border-slate-800 hover:border-slate-700 transition shadow-lg">
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-['Fredoka'] mb-1">
              Studio Command Bar Script
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Instant 1-click Lua generator. Paste into Roblox Studio’s Command Bar (View → Command Bar) to spawn the entire game inside any existing place.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleCopyCommand}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition shadow cursor-pointer"
            >
              {copiedCommand ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span className="text-emerald-300">Script Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Command Bar Lua
                </>
              )}
            </button>
            <button
              onClick={handleDownloadCommandLua}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download .lua Script
            </button>
          </div>
        </div>

        {/* Card 3: Rojo Developer Project */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-[#171a26] border border-slate-800 hover:border-slate-700 transition shadow-lg">
          <div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-500/30">
              <FolderTree className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-['Fredoka'] mb-1">
              Rojo Project Bundle (.zip)
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              For professional Roblox developers using VSCode and Rojo. Includes <code className="text-slate-300">default.project.json</code> and separate <code className="text-slate-300">src/</code> folders.
            </p>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-md cursor-pointer"
          >
            <FileArchive className="w-4 h-4" />
            {isZipping ? 'Packaging...' : 'Download Rojo Zip'}
          </button>
        </div>
      </div>

      {/* Step-by-Step Publishing Tutorial */}
      <div className="bg-[#181c2b] border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white font-['Fredoka'] mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          How to Publish Your Game to Roblox in 60 Seconds:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold border border-red-500/40">
                1
              </span>
              <h4 className="text-sm font-semibold text-slate-200">Open in Studio</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download the <span className="text-slate-200 font-mono">.rbxlx</span> file above and double-click to launch it directly in Roblox Studio.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold border border-amber-500/40">
                2
              </span>
              <h4 className="text-sm font-semibold text-slate-200">Test Gameplay</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">F5</kbd> or click the green <strong>Play</strong> button in Studio to verify checkpoints, coins, and mechanics.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/40">
                3
              </span>
              <h4 className="text-sm font-semibold text-slate-200">Publish to Roblox</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              In the top menu, click <strong>File → Publish to Roblox As...</strong>, choose a name, and share your game link with friends!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
