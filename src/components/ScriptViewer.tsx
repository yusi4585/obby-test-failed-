import React, { useState } from 'react';
import { LuauScript } from '../types/roblox';
import { Check, Copy, Download, FileCode, Layers, ShieldCheck } from 'lucide-react';
import { triggerFileDownload } from '../utils/robloxExport';

interface Props {
  scripts: LuauScript[];
}

export const ScriptViewer: React.FC<Props> = ({ scripts }) => {
  const [selectedScriptId, setSelectedScriptId] = useState<string>(scripts[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const activeScript = scripts.find((s) => s.id === selectedScriptId) || scripts[0];

  const handleCopy = () => {
    if (!activeScript) return;
    navigator.clipboard.writeText(activeScript.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    if (!activeScript) return;
    triggerFileDownload(`${activeScript.name}.luau`, activeScript.code, 'text/plain');
  };

  if (!activeScript) {
    return (
      <div className="p-8 text-center text-slate-500">
        No Luau scripts generated for this game.
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-[#141721] rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Script Tree / File List Sidebar */}
      <div className="w-full lg:w-72 bg-[#191d2a] border-b lg:border-b-0 lg:border-r border-slate-800 p-3 flex flex-col shrink-0">
        <div className="flex items-center gap-2 px-2 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Layers className="w-4 h-4 text-red-500" />
          Roblox Luau Scripts ({scripts.length})
        </div>

        <div className="space-y-1 overflow-y-auto max-h-48 lg:max-h-none flex-1 mt-1 pr-1">
          {scripts.map((script) => {
            const isSelected = script.id === activeScript.id;
            return (
              <button
                key={script.id}
                onClick={() => setSelectedScriptId(script.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition flex flex-col gap-1 ${
                  isSelected
                    ? 'bg-red-500/15 border border-red-500/40 text-red-300 font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 truncate">
                    <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-red-400' : 'text-slate-400'}`} />
                    <span className="truncate">{script.name}.luau</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900/60 text-slate-400 font-mono">
                    {script.type}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate pl-5">
                  {script.path}
                </div>
              </button>
            );
          })}
        </div>

        {/* Luau Engine Badge */}
        <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5 px-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Luau Type-Checked & Sandboxed</span>
        </div>
      </div>

      {/* Code Viewer Panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f1118]">
        {/* Code Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#181b26] border-b border-slate-800">
          <div className="flex flex-col">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <span className="text-red-400 font-mono">{activeScript.name}.luau</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Target: {activeScript.target}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
              {activeScript.description}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
              title="Copy script code"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadSingle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
              title="Download this script file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save .luau</span>
            </button>
          </div>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="flex-1 p-4 font-mono text-xs overflow-auto leading-relaxed bg-[#0e1017] text-slate-200">
          <pre className="relative whitespace-pre-wrap font-mono">
            {activeScript.code}
          </pre>
        </div>
      </div>
    </div>
  );
};
