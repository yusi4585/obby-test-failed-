import { RobloxGame, RobloxPart } from '../types/roblox';

/**
 * Escapes XML special characters for Roblox .rbxlx XML strings
 */
export function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Converts Hex color string (#RRGGBB) to 32-bit uint color representation used by Roblox
 */
export function hexToColor3uint8(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2) || 'FF', 16);
  const g = parseInt(cleanHex.substring(2, 4) || 'FF', 16);
  const b = parseInt(cleanHex.substring(4, 6) || 'FF', 16);
  // Roblox Color3uint8 format: 0xFF000000 | (r << 16) | (g << 8) | b
  return ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff);
}

/**
 * Map high-level materials to Roblox Material token numbers
 */
export function getMaterialToken(material: string): number {
  switch (material) {
    case 'Plastic':
      return 256;
    case 'SmoothPlastic':
      return 272;
    case 'Neon':
      return 288;
    case 'Wood':
      return 512;
    case 'WoodPlanks':
      return 528;
    case 'Cobblestone':
      return 784;
    case 'Brick':
      return 800;
    case 'Grass':
      return 1280;
    case 'Glass':
      return 1568;
    case 'DiamondPlate':
      return 1584;
    case 'Metal':
      return 1040;
    default:
      return 256;
  }
}

/**
 * Generates official Roblox Studio XML Place (.rbxlx) file content.
 * Double-clicking this file opens directly in Roblox Studio.
 */
export function generateRbxlxXml(game: RobloxGame): string {
  let refCounter = 100;
  const getRef = () => `RBX_${refCounter++}`;

  const partsXml = game.parts
    .map((part) => {
      const ref = getRef();
      const colorVal = hexToColor3uint8(part.color);
      const isSpawn = part.type === 'SpawnLocation' || part.tag === 'spawn';
      const className = isSpawn ? 'SpawnLocation' : 'Part';
      const [px, py, pz] = part.position;
      const [sx, sy, sz] = part.size;
      const rot = part.rotation || [0, 0, 0];
      const materialToken = getMaterialToken(part.material);

      return `
    <Item class="${className}" referent="${ref}">
      <Properties>
        <string name="Name">${escapeXml(part.name)}</string>
        <CoordinateFrame name="CFrame">
          <X>${px.toFixed(3)}</X>
          <Y>${py.toFixed(3)}</Y>
          <Z>${pz.toFixed(3)}</Z>
          <R00>1</R00><R01>0</R01><R02>0</R02>
          <R10>0</R10><R11>1</R11><R12>0</R12>
          <R20>0</R20><R21>0</R21><R22>1</R22>
        </CoordinateFrame>
        <Vector3 name="size">
          <X>${sx.toFixed(3)}</X>
          <Y>${sy.toFixed(3)}</Y>
          <Z>${sz.toFixed(3)}</Z>
        </Vector3>
        <Color3uint8 name="Color3uint8">${colorVal}</Color3uint8>
        <token name="Material">${materialToken}</token>
        <float name="Transparency">${part.transparency.toFixed(2)}</float>
        <bool name="Anchored">${part.anchored}</bool>
        <bool name="CanCollide">${part.canCollide}</bool>
        <bool name="CastShadow">true</bool>
        ${isSpawn ? '<bool name="Enabled">true</bool><int name="Duration">0</int>' : ''}
      </Properties>
    </Item>`;
    })
    .join('');

  // ServerScriptService Scripts
  const serverScripts = game.scripts.filter((s) => s.target === 'ServerScriptService');
  const serverScriptsXml = serverScripts
    .map((s) => {
      const ref = getRef();
      return `
      <Item class="Script" referent="${ref}">
        <Properties>
          <string name="Name">${escapeXml(s.name)}</string>
          <bool name="Disabled">false</bool>
          <ProtectedString name="Source"><![CDATA[${s.code}]]></ProtectedString>
        </Properties>
      </Item>`;
    })
    .join('');

  // ReplicatedStorage ModuleScripts & Remotes
  const repScripts = game.scripts.filter((s) => s.target === 'ReplicatedStorage');
  const repScriptsXml = repScripts
    .map((s) => {
      const ref = getRef();
      return `
      <Item class="ModuleScript" referent="${ref}">
        <Properties>
          <string name="Name">${escapeXml(s.name)}</string>
          <ProtectedString name="Source"><![CDATA[${s.code}]]></ProtectedString>
        </Properties>
      </Item>`;
    })
    .join('');

  // StarterPlayerScripts LocalScripts
  const clientScripts = game.scripts.filter((s) => s.target === 'StarterPlayerScripts');
  const clientScriptsXml = clientScripts
    .map((s) => {
      const ref = getRef();
      return `
        <Item class="LocalScript" referent="${ref}">
          <Properties>
            <string name="Name">${escapeXml(s.name)}</string>
            <bool name="Disabled">false</bool>
            <ProtectedString name="Source"><![CDATA[${s.code}]]></ProtectedString>
          </Properties>
        </Item>`;
    })
    .join('');

  // StarterGui LocalScripts / ScreenGuis
  const guiScripts = game.scripts.filter((s) => s.target === 'StarterGui');
  const guiScriptsXml = guiScripts
    .map((s) => {
      const ref = getRef();
      const childRef = getRef();
      return `
      <Item class="ScreenGui" referent="${ref}">
        <Properties>
          <string name="Name">${escapeXml(s.name)}Gui</string>
          <bool name="ResetOnSpawn">false</bool>
          <bool name="IgnoreGuiInset">true</bool>
        </Properties>
        <Item class="LocalScript" referent="${childRef}">
          <Properties>
            <string name="Name">${escapeXml(s.name)}</string>
            <ProtectedString name="Source"><![CDATA[${s.code}]]></ProtectedString>
          </Properties>
        </Item>
      </Item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="utf-8"?>
<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">
  <Meta name="ExplicitAutoJoints">true</Meta>
  <Item class="Workspace" referent="RBX_WORKSPACE">
    <Properties>
      <string name="Name">Workspace</string>
      <bool name="FilteringEnabled">true</bool>
      <float name="Gravity">${game.gameplay.gravity.toFixed(1)}</float>
    </Properties>
    ${partsXml}
  </Item>

  <Item class="Lighting" referent="RBX_LIGHTING">
    <Properties>
      <string name="Name">Lighting</string>
      <float name="ClockTime">${game.lighting.clockTime.toFixed(1)}</float>
      <float name="Brightness">${game.lighting.brightness.toFixed(1)}</float>
      <Color3uint8 name="Ambient">${hexToColor3uint8(game.lighting.ambient)}</Color3uint8>
      <Color3uint8 name="OutdoorAmbient">${hexToColor3uint8(game.lighting.outdoorAmbient)}</Color3uint8>
      <float name="FogEnd">${game.lighting.fogEnd.toFixed(0)}</float>
      <Color3uint8 name="FogColor">${hexToColor3uint8(game.lighting.fogColor)}</Color3uint8>
      <float name="ExposureCompensation">${game.lighting.exposureCompensation.toFixed(2)}</float>
    </Properties>
    ${
      game.lighting.sunRays
        ? `<Item class="SunRaysEffect" referent="RBX_SUNRAYS"><Properties><string name="Name">SunRays</string><float name="Intensity">0.15</float><float name="Spread">0.8</float></Properties></Item>`
        : ''
    }
    ${
      game.lighting.bloom
        ? `<Item class="BloomEffect" referent="RBX_BLOOM"><Properties><string name="Name">Bloom</string><float name="Intensity">0.5</float><float name="Size">24</float><float name="Threshold">1.8</float></Properties></Item>`
        : ''
    }
    <Item class="ColorCorrectionEffect" referent="RBX_COLOR_CORR">
      <Properties>
        <string name="Name">ColorCorrection</string>
        <float name="Brightness">${game.lighting.colorCorrection.brightness.toFixed(2)}</float>
        <float name="Contrast">${game.lighting.colorCorrection.contrast.toFixed(2)}</float>
        <float name="Saturation">${game.lighting.colorCorrection.saturation.toFixed(2)}</float>
      </Properties>
    </Item>
  </Item>

  <Item class="ReplicatedStorage" referent="RBX_REPLICATED_STORAGE">
    <Properties>
      <string name="Name">ReplicatedStorage</string>
    </Properties>
    <Item class="Folder" referent="RBX_REMOTES_FOLDER">
      <Properties><string name="Name">Remotes</string></Properties>
      <Item class="RemoteEvent" referent="RBX_REMOTE_COIN"><Properties><string name="Name">CoinCollected</string></Properties></Item>
      <Item class="RemoteEvent" referent="RBX_REMOTE_CHECKPOINT"><Properties><string name="Name">CheckpointReached</string></Properties></Item>
      <Item class="RemoteFunction" referent="RBX_REMOTE_SHOP"><Properties><string name="Name">BuyShopItem</string></Properties></Item>
    </Item>
    ${repScriptsXml}
  </Item>

  <Item class="ServerScriptService" referent="RBX_SERVER_SCRIPT_SERVICE">
    <Properties>
      <string name="Name">ServerScriptService</string>
    </Properties>
    ${serverScriptsXml}
  </Item>

  <Item class="StarterGui" referent="RBX_STARTER_GUI">
    <Properties>
      <string name="Name">StarterGui</string>
      <bool name="ResetPlayerGuiOnSpawn">false</bool>
    </Properties>
    ${guiScriptsXml}
  </Item>

  <Item class="StarterPlayer" referent="RBX_STARTER_PLAYER">
    <Properties>
      <string name="Name">StarterPlayer</string>
    </Properties>
    <Item class="StarterPlayerScripts" referent="RBX_STARTER_PLAYER_SCRIPTS">
      <Properties><string name="Name">StarterPlayerScripts</string></Properties>
      ${clientScriptsXml}
    </Item>
  </Item>
</roblox>`;
}

/**
 * Generates an all-in-one Lua installer script for Roblox Studio's Command Bar.
 * When pasted into Roblox Studio (View > Command Bar), it creates all instances,
 * builds parts, injects tags via CollectionService, and sets up scripts automatically.
 */
export function generateCommandBarScript(game: RobloxGame): string {
  const partsJson = JSON.stringify(
    game.parts.map((p) => ({
      name: p.name,
      type: p.type,
      size: p.size,
      pos: p.position,
      color: p.color,
      mat: p.material,
      anch: p.anchored,
      coll: p.canCollide,
      trans: p.transparency,
      tag: p.tag || '',
      cpNum: p.checkpointNumber || 0,
      coinVal: p.coinValue || 0,
      price: p.price || 0,
    }))
  );

  const scriptsData = JSON.stringify(
    game.scripts.map((s) => ({
      name: s.name,
      target: s.target,
      type: s.type,
      code: s.code,
    }))
  );

  return `--[[
================================================================================
  BloxCraft AI - Roblox Game Installer Script
  Game: ${game.title}
  Genre: ${game.genre.toUpperCase()} | Generated by AI
  
  HOW TO INSTALL:
  1. Open Roblox Studio and create a new Baseplate project (or open existing).
  2. In top ribbon, click 'View' tab -> Open 'Command Bar' (or press View > Command Bar).
  3. Paste this ENTIRE script into the Command Bar at the bottom and press Enter.
  4. Boom! Your game geometry, scripts, lighting & GUI will generate in 2 seconds!
================================================================================
--]]

local HttpService = game:GetService("HttpService")
local CollectionService = game:GetService("CollectionService")
local Workspace = game:GetService("Workspace")
local Lighting = game:GetService("Lighting")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")
local StarterPlayer = game:GetService("StarterPlayer")
local StarterGui = game:GetService("StarterGui")

print("🚀 [BloxCraft AI] Generating '${game.title}'...")

-- 1. Setup Map Folder in Workspace
local mapFolder = Workspace:FindFirstChild("GameMap")
if mapFolder then mapFolder:Destroy() end
mapFolder = Instance.new("Folder")
mapFolder.Name = "GameMap"
mapFolder.Parent = Workspace

-- Helper: Convert Hex string to Color3
local function hexToColor(hex)
    hex = hex:gsub("#","")
    local r = tonumber(hex:sub(1,2), 16) or 255
    local g = tonumber(hex:sub(3,4), 16) or 255
    local b = tonumber(hex:sub(5,6), 16) or 255
    return Color3.fromRGB(r, g, b)
end

-- 2. Build 3D World Parts
local rawParts = HttpService:JSONDecode([==[${partsJson}]==])
for _, p in ipairs(rawParts) do
    local part
    if p.type == "SpawnLocation" or p.tag == "spawn" then
        part = Instance.new("SpawnLocation")
        part.Duration = 0
        part.Enabled = true
    else
        part = Instance.new("Part")
    end

    part.Name = p.name
    part.Size = Vector3.new(p.size[1], p.size[2], p.size[3])
    part.Position = Vector3.new(p.pos[1], p.pos[2], p.pos[3])
    part.Color = hexToColor(p.color)
    pcall(function() part.Material = Enum.Material[p.mat] end)
    part.Anchored = p.anch
    part.CanCollide = p.coll
    part.Transparency = p.trans

    if p.tag and p.tag ~= "" then
        CollectionService:AddTag(part, p.tag)
        part:SetAttribute("BloxTag", p.tag)
        if p.cpNum > 0 then part:SetAttribute("CheckpointNumber", p.cpNum) end
        if p.coinVal > 0 then part:SetAttribute("CoinValue", p.coinVal) end
        if p.price > 0 then part:SetAttribute("Price", p.price) end
    end

    part.Parent = mapFolder
end

-- 3. Configure Lighting
Lighting.ClockTime = ${game.lighting.clockTime}
Lighting.Brightness = ${game.lighting.brightness}
Lighting.FogEnd = ${game.lighting.fogEnd}
Lighting.FogColor = hexToColor("${game.lighting.fogColor}")
Lighting.Ambient = hexToColor("${game.lighting.ambient}")
Lighting.OutdoorAmbient = hexToColor("${game.lighting.outdoorAmbient}")

-- 4. Setup ReplicatedStorage Remotes Folder
local remotes = ReplicatedStorage:FindFirstChild("Remotes")
if not remotes then
    remotes = Instance.new("Folder")
    remotes.Name = "Remotes"
    remotes.Parent = ReplicatedStorage
    
    local cEvent = Instance.new("RemoteEvent")
    cEvent.Name = "CoinCollected"
    cEvent.Parent = remotes

    local cpEvent = Instance.new("RemoteEvent")
    cpEvent.Name = "CheckpointReached"
    cpEvent.Parent = remotes

    local buyFunc = Instance.new("RemoteFunction")
    buyFunc.Name = "BuyShopItem"
    buyFunc.Parent = remotes
end

-- 5. Inject Game Luau Scripts
local rawScripts = HttpService:JSONDecode([==[${scriptsData}]==])
for _, s in ipairs(rawScripts) do
    local scriptInstance
    if s.type == "ModuleScript" then
        scriptInstance = Instance.new("ModuleScript")
    elseif s.type == "LocalScript" then
        scriptInstance = Instance.new("LocalScript")
    else
        scriptInstance = Instance.new("Script")
    end

    scriptInstance.Name = s.name
    scriptInstance.Source = s.code

    if s.target == "ServerScriptService" then
        scriptInstance.Parent = ServerScriptService
    elseif s.target == "ReplicatedStorage" then
        scriptInstance.Parent = ReplicatedStorage
    elseif s.target == "StarterPlayerScripts" then
        scriptInstance.Parent = StarterPlayer.StarterPlayerScripts
    elseif s.target == "StarterGui" then
        local sg = StarterGui:FindFirstChild(s.name .. "Gui")
        if not sg then
            sg = Instance.new("ScreenGui")
            sg.Name = s.name .. "Gui"
            sg.ResetOnSpawn = false
            sg.Parent = StarterGui
        end
        scriptInstance.Parent = sg
    end
end

print("✅ [BloxCraft AI] Game created successfully! Press 'Play' (F5) in Roblox Studio to test!")
`;
}

/**
 * Generates standard Rojo `default.project.json` for syncing project from disk.
 */
export function generateRojoProjectJson(game: RobloxGame): string {
  return JSON.stringify(
    {
      name: game.title,
      tree: {
        $className: 'DataModel',
        ServerScriptService: {
          $path: 'src/server',
        },
        ReplicatedStorage: {
          $path: 'src/shared',
        },
        StarterPlayer: {
          StarterPlayerScripts: {
            $path: 'src/client',
          },
        },
        StarterGui: {
          $path: 'src/gui',
        },
      },
    },
    null,
    2
  );
}

/**
 * Triggers a native browser file download
 */
export function triggerFileDownload(filename: string, content: string | Blob, mimeType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
