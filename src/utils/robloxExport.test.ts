import test from 'node:test';
import assert from 'node:assert/strict';
import {
  escapeXml,
  hexToColor3uint8,
  getMaterialToken,
  generateRbxlxXml,
  generateCommandBarScript,
  generateRojoProjectJson,
} from './robloxExport';
import { detectGenre, generateProceduralRobloxGame } from './proceduralGenerator';

test('escapeXml correctly escapes XML entities', () => {
  assert.equal(escapeXml('Hello & <World> "Test" \'Single\''), 'Hello &amp; &lt;World&gt; &quot;Test&quot; &apos;Single&apos;');
  assert.equal(escapeXml('Normal String 123'), 'Normal String 123');
});

test('hexToColor3uint8 converts hex colors to 32-bit uint', () => {
  // Pure Red: #FF0000 -> 0xFF0000 (16711680)
  assert.equal(hexToColor3uint8('#FF0000'), 16711680);
  // Pure Green: #00FF00 -> 0x00FF00 (65280)
  assert.equal(hexToColor3uint8('#00FF00'), 65280);
  // Pure Blue: #0000FF -> 0x0000FF (255)
  assert.equal(hexToColor3uint8('#0000FF'), 255);
});

test('getMaterialToken returns proper Roblox token values', () => {
  assert.equal(getMaterialToken('Plastic'), 256);
  assert.equal(getMaterialToken('SmoothPlastic'), 272);
  assert.equal(getMaterialToken('Neon'), 288);
  assert.equal(getMaterialToken('Grass'), 1280);
});

test('detectGenre accurately classifies user prompts', () => {
  assert.equal(detectGenre('lava obby with 15 stages'), 'obby');
  assert.equal(detectGenre('car factory tycoon with droppers'), 'tycoon');
  assert.equal(detectGenre('zombie survival wave defense in a bunker'), 'survival');
  assert.equal(detectGenre('hatch pet eggs and click coins'), 'simulator');
  assert.equal(detectGenre('sword arena pvp battleground'), 'arena');
  assert.equal(detectGenre('creepy horror escape asylum'), 'horror');
  assert.equal(detectGenre('speed runner neon sprint'), 'racing');
});

test('generateProceduralRobloxGame produces valid game object with parts and scripts', () => {
  const game = generateProceduralRobloxGame('lava obby with jump pads and coins');
  assert.ok(game.id.startsWith('blox_'));
  assert.equal(game.genre, 'obby');
  assert.ok(game.parts.length > 15, 'Should have created multiple 3D parts');
  assert.ok(game.scripts.length >= 3, 'Should have created server and client scripts');
  assert.ok(game.parts.some((p) => p.tag === 'checkpoint'));
  assert.ok(game.parts.some((p) => p.tag === 'lava'));
});

test('generateRbxlxXml outputs valid Roblox place XML structure', () => {
  const game = generateProceduralRobloxGame('tycoon with conveyors and furnace');
  const xml = generateRbxlxXml(game);

  assert.ok(xml.startsWith('<?xml version="1.0" encoding="utf-8"?>'));
  assert.ok(xml.includes('<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime"'));
  assert.ok(xml.includes('<Item class="Workspace" referent="RBX_WORKSPACE">'));
  assert.ok(xml.includes('<Item class="Lighting" referent="RBX_LIGHTING">'));
  assert.ok(xml.includes('<Item class="ServerScriptService" referent="RBX_SERVER_SCRIPT_SERVICE">'));
  assert.ok(xml.includes('<Item class="ReplicatedStorage" referent="RBX_REPLICATED_STORAGE">'));
  assert.ok(xml.includes('<CoordinateFrame name="CFrame">'));
});

test('generateCommandBarScript outputs valid Lua installer', () => {
  const game = generateProceduralRobloxGame('sword fight pvp arena');
  const lua = generateCommandBarScript(game);

  assert.ok(lua.includes('BloxCraft AI - Roblox Game Installer Script'));
  assert.ok(lua.includes('game:GetService("Workspace")'));
  assert.ok(lua.includes('game:GetService("CollectionService")'));
  assert.ok(lua.includes('JSONDecode'));
});

test('generateRojoProjectJson generates valid Rojo schema', () => {
  const game = generateProceduralRobloxGame('pet simulator');
  const jsonStr = generateRojoProjectJson(game);
  const parsed = JSON.parse(jsonStr);

  assert.equal(parsed.name, game.title);
  assert.equal(parsed.tree.ServerScriptService.$path, 'src/server');
  assert.equal(parsed.tree.ReplicatedStorage.$path, 'src/shared');
});
