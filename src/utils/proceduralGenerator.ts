import { GameGenre, RobloxGame, RobloxLighting, RobloxPart, LuauScript } from '../types/roblox';

/**
 * Determine genre from prompt keywords
 */
export function detectGenre(prompt: string): GameGenre {
  const p = prompt.toLowerCase();
  if (p.includes('obby') || p.includes('parkour') || p.includes('tower') || p.includes('checkpoint')) {
    return 'obby';
  }
  if (p.includes('tycoon') || p.includes('factory') || p.includes('dropper') || p.includes('farm') || p.includes('business')) {
    return 'tycoon';
  }
  if (p.includes('zombie') || p.includes('survival') || p.includes('wave') || p.includes('apocalypse') || p.includes('defend')) {
    return 'survival';
  }
  if (p.includes('pet') || p.includes('simulator') || p.includes('clicker') || p.includes('egg') || p.includes('hatch') || p.includes('rebirth')) {
    return 'simulator';
  }
  if (p.includes('sword') || p.includes('pvp') || p.includes('battle') || p.includes('fight') || p.includes('arena') || p.includes('gladiator')) {
    return 'arena';
  }
  if (p.includes('horror') || p.includes('escape') || p.includes('scary') || p.includes('dark') || p.includes('monster') || p.includes('flee')) {
    return 'horror';
  }
  if (p.includes('race') || p.includes('racing') || p.includes('kart') || p.includes('vehicle')) {
    return 'racing';
  }
  return 'obby';
}

/**
 * Generate complete Roblox game procedurally based on user prompt & detected genre
 */
export function generateProceduralRobloxGame(prompt: string): RobloxGame {
  const genre = detectGenre(prompt);
  const cleanPrompt = prompt.trim();
  const id = 'blox_' + Math.random().toString(36).substring(2, 9);
  const now = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  switch (genre) {
    case 'tycoon':
      return createTycoonGame(id, cleanPrompt, now);
    case 'survival':
      return createSurvivalGame(id, cleanPrompt, now);
    case 'simulator':
      return createSimulatorGame(id, cleanPrompt, now);
    case 'arena':
      return createArenaGame(id, cleanPrompt, now);
    case 'horror':
      return createHorrorGame(id, cleanPrompt, now);
    case 'racing':
      return createRacingGame(id, cleanPrompt, now);
    case 'obby':
    default:
      return createObbyGame(id, cleanPrompt, now);
  }
}

// -----------------------------------------------------------------------------
// OBBY / PARKOUR GENERATOR
// -----------------------------------------------------------------------------
function createObbyGame(id: string, prompt: string, date: string): RobloxGame {
  const isLava = prompt.toLowerCase().includes('lava') || prompt.toLowerCase().includes('fire') || prompt.toLowerCase().includes('hell');
  const isNeon = prompt.toLowerCase().includes('neon') || prompt.toLowerCase().includes('cyber') || prompt.toLowerCase().includes('synth');
  const isRainbow = prompt.toLowerCase().includes('rainbow') || prompt.toLowerCase().includes('color');

  const title = isLava
    ? '🔥 Lava Inferno: 15-Stage Mega Obby'
    : isNeon
    ? '⚡ Cyberpunk Neon Runner Obby'
    : isRainbow
    ? '🌈 Rainbow Tower of Hell Obby'
    : '🏆 Ultimate Parkour Adventure Obby';

  const parts: RobloxPart[] = [];
  let partIndex = 1;

  // Baseplate
  parts.push({
    id: `part_${partIndex++}`,
    name: 'Baseplate',
    type: 'Part',
    size: [512, 4, 512],
    position: [0, -10, 0],
    color: isLava ? '#1a0505' : '#2d3748',
    material: 'Plastic',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'baseplate',
  });

  // Spawn Platform
  parts.push({
    id: `part_${partIndex++}`,
    name: 'SpawnIsland',
    type: 'SpawnLocation',
    size: [24, 2, 24],
    position: [0, 1, 0],
    color: '#00A2FF',
    material: 'SmoothPlastic',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'spawn',
  });

  // Welcome Sign / Arch
  parts.push({
    id: `part_${partIndex++}`,
    name: 'StartArchLeft',
    type: 'Part',
    size: [2, 10, 2],
    position: [-6, 6, 8],
    color: '#FFD700',
    material: 'Neon',
    transparency: 0,
    anchored: true,
    canCollide: true,
  });
  parts.push({
    id: `part_${partIndex++}`,
    name: 'StartArchRight',
    type: 'Part',
    size: [2, 10, 2],
    position: [6, 6, 8],
    color: '#FFD700',
    material: 'Neon',
    transparency: 0,
    anchored: true,
    canCollide: true,
  });
  parts.push({
    id: `part_${partIndex++}`,
    name: 'StartArchTop',
    type: 'Part',
    size: [14, 2, 2],
    position: [0, 11, 8],
    color: '#FFD700',
    material: 'Neon',
    transparency: 0,
    anchored: true,
    canCollide: true,
  });

  // Generate 8 Diverse Stages
  let currentZ = 20;
  let currentY = 1;
  const stageCount = 8;

  const stageThemes = [
    { name: 'Floating Stepping Stones', color: '#48BB78', type: 'steps' },
    { name: 'Lava Kill-Brick Jump', color: '#E53E3E', type: 'lava_jump' },
    { name: 'Narrow Beam Tightrope', color: '#ED8936', type: 'tightrope' },
    { name: 'Neon Spinners & Jump Pads', color: '#9F7AEA', type: 'jump_pad' },
    { name: 'Zig-Zag Truss Bridge', color: '#38B2AC', type: 'zigzag' },
    { name: 'Lava Grid Matrix', color: '#F56565', type: 'lava_matrix' },
    { name: 'Ascending Staircase of Doom', color: '#ECC94B', type: 'stairs' },
    { name: 'Final Speed Dash & Trophy', color: '#667EEA', type: 'finish' },
  ];

  for (let s = 1; s <= stageCount; s++) {
    const theme = stageThemes[s - 1];

    // Checkpoint Platform
    parts.push({
      id: `part_${partIndex++}`,
      name: `Checkpoint_Stage_${s}`,
      type: 'Part',
      size: [12, 2, 12],
      position: [0, currentY, currentZ],
      color: '#00E676',
      material: 'Neon',
      transparency: 0.1,
      anchored: true,
      canCollide: true,
      tag: 'checkpoint',
      checkpointNumber: s,
      tooltip: `Stage ${s}: ${theme.name}`,
    });

    // Checkpoint Flag Pole
    parts.push({
      id: `part_${partIndex++}`,
      name: `FlagPole_${s}`,
      type: 'Part',
      size: [0.8, 8, 0.8],
      position: [-4.5, currentY + 4, currentZ - 4.5],
      color: '#CBD5E0',
      material: 'Metal',
      transparency: 0,
      anchored: true,
      canCollide: false,
    });
    parts.push({
      id: `part_${partIndex++}`,
      name: `FlagCloth_${s}`,
      type: 'Part',
      size: [3, 2, 0.2],
      position: [-3, currentY + 7, currentZ - 4.5],
      color: '#38A169',
      material: 'SmoothPlastic',
      transparency: 0,
      anchored: true,
      canCollide: false,
    });

    currentZ += 12;

    // Build specific stage obstacles
    if (theme.type === 'steps') {
      for (let i = 0; i < 5; i++) {
        const xOffset = i % 2 === 0 ? -3 : 3;
        currentZ += 8;
        currentY += 1;
        parts.push({
          id: `part_${partIndex++}`,
          name: `Step_${s}_${i + 1}`,
          type: 'Part',
          size: [5, 1.5, 5],
          position: [xOffset, currentY, currentZ],
          color: theme.color,
          material: 'SmoothPlastic',
          transparency: 0,
          anchored: true,
          canCollide: true,
        });

        // Add a collectible coin on step 3
        if (i === 2) {
          parts.push({
            id: `part_${partIndex++}`,
            name: `Coin_Stage_${s}`,
            type: 'Part',
            shape: 'Cylinder',
            size: [1.8, 0.4, 1.8],
            position: [xOffset, currentY + 2.5, currentZ],
            color: '#FFD700',
            material: 'Neon',
            transparency: 0,
            anchored: true,
            canCollide: false,
            tag: 'coin',
            coinValue: 10,
          });
        }
      }
    } else if (theme.type === 'lava_jump') {
      // Long safe platform with red neon kill bricks
      currentZ += 6;
      parts.push({
        id: `part_${partIndex++}`,
        name: `LavaRunway_${s}`,
        type: 'Part',
        size: [8, 1.5, 36],
        position: [0, currentY, currentZ + 15],
        color: '#4A5568',
        material: 'Cobblestone',
        transparency: 0,
        anchored: true,
        canCollide: true,
      });

      // 4 Lava neon hurdles
      for (let k = 0; k < 4; k++) {
        parts.push({
          id: `part_${partIndex++}`,
          name: `LavaBar_${s}_${k + 1}`,
          type: 'Part',
          size: [8, 1.2, 1.5],
          position: [0, currentY + 1.2, currentZ + 5 + k * 8],
          color: '#FF1100',
          material: 'Neon',
          transparency: 0,
          anchored: true,
          canCollide: true,
          tag: 'lava',
          tooltip: 'Touch = Instant Death!',
        });
      }
      currentZ += 36;
    } else if (theme.type === 'tightrope') {
      currentZ += 4;
      parts.push({
        id: `part_${partIndex++}`,
        name: `Tightrope_${s}`,
        type: 'Part',
        size: [1.5, 1, 32],
        position: [0, currentY, currentZ + 14],
        color: '#D69E2E',
        material: 'Wood',
        transparency: 0,
        anchored: true,
        canCollide: true,
      });
      // Floating Coin in the middle
      parts.push({
        id: `part_${partIndex++}`,
        name: `Coin_Rope_${s}`,
        type: 'Part',
        shape: 'Cylinder',
        size: [1.8, 0.4, 1.8],
        position: [0, currentY + 2.5, currentZ + 14],
        color: '#FFD700',
        material: 'Neon',
        transparency: 0,
        anchored: true,
        canCollide: false,
        tag: 'coin',
        coinValue: 25,
      });
      currentZ += 32;
    } else if (theme.type === 'jump_pad') {
      currentZ += 6;
      parts.push({
        id: `part_${partIndex++}`,
        name: `JumpPadLauncher_${s}`,
        type: 'Part',
        size: [6, 1.5, 6],
        position: [0, currentY, currentZ],
        color: '#00FFCC',
        material: 'Neon',
        transparency: 0,
        anchored: true,
        canCollide: true,
        tag: 'jump_pad',
        tooltip: 'Super Jump Pad: Launches you upward!',
      });
      // High destination platform
      currentY += 12;
      currentZ += 18;
      parts.push({
        id: `part_${partIndex++}`,
        name: `HighLandingPad_${s}`,
        type: 'Part',
        size: [10, 1.5, 10],
        position: [0, currentY, currentZ],
        color: '#9F7AEA',
        material: 'SmoothPlastic',
        transparency: 0,
        anchored: true,
        canCollide: true,
      });
    } else if (theme.type === 'zigzag') {
      for (let zIndex = 0; zIndex < 4; zIndex++) {
        currentZ += 7;
        const xPos = zIndex % 2 === 0 ? -4 : 4;
        parts.push({
          id: `part_${partIndex++}`,
          name: `ZigZag_${s}_${zIndex}`,
          type: 'Part',
          size: [6, 1.2, 4],
          position: [xPos, currentY, currentZ],
          color: zIndex % 2 === 0 ? '#38B2AC' : '#4FD1C5',
          material: 'SmoothPlastic',
          transparency: 0,
          anchored: true,
          canCollide: true,
        });
      }
      currentZ += 4;
    } else if (theme.type === 'lava_matrix') {
      currentZ += 6;
      // 3x3 checkered floor with safe green tiles and red kill tiles
      for (let row = 0; row < 3; row++) {
        for (let col = -1; col <= 1; col++) {
          const isDanger = (row + col) % 2 === 0;
          parts.push({
            id: `part_${partIndex++}`,
            name: isDanger ? `LavaTile_${s}_${row}_${col}` : `SafeTile_${s}_${row}_${col}`,
            type: 'Part',
            size: [4.5, 1.2, 7],
            position: [col * 5, currentY, currentZ + row * 8],
            color: isDanger ? '#FF1100' : '#48BB78',
            material: isDanger ? 'Neon' : 'SmoothPlastic',
            transparency: 0,
            anchored: true,
            canCollide: true,
            tag: isDanger ? 'lava' : undefined,
          });
        }
      }
      currentZ += 28;
    } else if (theme.type === 'stairs') {
      for (let st = 0; st < 6; st++) {
        currentY += 1.8;
        currentZ += 5;
        parts.push({
          id: `part_${partIndex++}`,
          name: `Stair_${s}_${st}`,
          type: 'Part',
          size: [8, 1.2, 4],
          position: [0, currentY, currentZ],
          color: '#D69E2E',
          material: 'WoodPlanks',
          transparency: 0,
          anchored: true,
          canCollide: true,
        });
      }
      currentZ += 6;
    } else if (theme.type === 'finish') {
      // Speed dash strip
      currentZ += 6;
      parts.push({
        id: `part_${partIndex++}`,
        name: `SpeedStrip_${s}`,
        type: 'Part',
        size: [8, 1, 24],
        position: [0, currentY, currentZ + 10],
        color: '#00F0FF',
        material: 'Neon',
        transparency: 0.1,
        anchored: true,
        canCollide: true,
        tag: 'speed_pad',
        tooltip: 'Speed Pad: 2x WalkSpeed boost!',
      });
      currentZ += 26;

      // Winner Trophy Island!
      parts.push({
        id: `part_${partIndex++}`,
        name: 'WinnerIsland',
        type: 'Part',
        size: [32, 3, 32],
        position: [0, currentY + 1, currentZ + 16],
        color: '#FFD700',
        material: 'Cobblestone',
        transparency: 0,
        anchored: true,
        canCollide: true,
        tag: 'finish',
      });

      // Giant Golden Trophy Cup
      parts.push({
        id: `part_${partIndex++}`,
        name: 'TrophyPedestal',
        type: 'Part',
        size: [8, 4, 8],
        position: [0, currentY + 4, currentZ + 16],
        color: '#B7791F',
        material: 'Metal',
        transparency: 0,
        anchored: true,
        canCollide: true,
      });
      parts.push({
        id: `part_${partIndex++}`,
        name: 'GoldenTrophyCup',
        type: 'Part',
        shape: 'Cylinder',
        size: [6, 7, 6],
        position: [0, currentY + 9, currentZ + 16],
        color: '#FFEA00',
        material: 'Neon',
        transparency: 0,
        anchored: true,
        canCollide: true,
        tag: 'finish',
        tooltip: 'TOUCH TO WIN! Grants 500 Coins + Winner Badge!',
      });
    }
  }

  // Scripts
  const scripts: LuauScript[] = [
    {
      id: 'script_leaderstats',
      name: 'Leaderstats',
      path: 'ServerScriptService/Leaderstats',
      target: 'ServerScriptService',
      type: 'Script',
      description: 'Creates player stage & coin leaderstats upon joining and handles data persistence',
      code: `--[[
    BloxCraft AI - Obby Leaderstats Handler
    Maintains Stage & Coin values shown on Roblox TopBar
--]]
local Players = game:GetService("Players")

local function onPlayerAdded(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local stage = Instance.new("IntValue")
    stage.Name = "Stage"
    stage.Value = 1
    stage.Parent = leaderstats

    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 0
    coins.Parent = leaderstats

    player.CharacterAdded:Connect(function(char)
        task.wait(0.1)
        local hum = char:WaitForChild("Humanoid", 5)
        local hrp = char:WaitForChild("HumanoidRootPart", 5)
        if not hum or not hrp then return end

        -- Teleport to current saved stage checkpoint
        local cpNumber = stage.Value
        local map = workspace:FindFirstChild("GameMap") or workspace
        local cpPart = map:FindFirstChild("Checkpoint_Stage_" .. cpNumber)
        if cpPart and cpNumber > 1 then
            hrp.CFrame = cpPart.CFrame + Vector3.new(0, 3.5, 0)
        end
    end)
end

Players.PlayerAdded:Connect(onPlayerAdded)
for _, player in ipairs(Players:GetPlayers()) do
    onPlayerAdded(player)
end
`,
    },
    {
      id: 'script_gamemanager',
      name: 'GameManager',
      path: 'ServerScriptService/GameManager',
      target: 'ServerScriptService',
      type: 'Script',
      description: 'Handles lava collisions, checkpoint progression, coins, and speed/jump pads',
      code: `--[[
    BloxCraft AI - Obby Game Manager
    Handles hazards, checkpoints, and interactive gameplay objects
--]]
local CollectionService = game:GetService("CollectionService")
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")

local remotes = ReplicatedStorage:WaitForChild("Remotes")
local coinEvent = remotes:WaitForChild("CoinCollected")
local checkpointEvent = remotes:WaitForChild("CheckpointReached")

-- 1. Lava / Kill Bricks
for _, lavaPart in ipairs(CollectionService:GetTagged("lava")) do
    lavaPart.Touched:Connect(function(hit)
        local hum = hit.Parent and hit.Parent:FindFirstChild("Humanoid")
        if hum and hum.Health > 0 then
            hum.Health = 0 -- Instant death
        end
    end)
end

-- 2. Checkpoints
for _, cpPart in ipairs(CollectionService:GetTagged("checkpoint")) do
    cpPart.Touched:Connect(function(hit)
        local player = Players:GetPlayerFromCharacter(hit.Parent)
        if not player then return end

        local leaderstats = player:FindFirstChild("leaderstats")
        if not leaderstats then return end

        local stageStat = leaderstats:FindFirstChild("Stage")
        local coinsStat = leaderstats:FindFirstChild("Coins")
        local cpNum = cpPart:GetAttribute("CheckpointNumber") or tonumber(cpPart.Name:match("%d+"))

        if stageStat and cpNum and cpNum > stageStat.Value then
            stageStat.Value = cpNum
            if coinsStat then coinsStat.Value = coinsStat.Value + 15 end
            checkpointEvent:FireClient(player, cpNum)
        end
    end)
end

-- 3. Coin Pickups
for _, coin in ipairs(CollectionService:GetTagged("coin")) do
    local isDebounce = false
    coin.Touched:Connect(function(hit)
        if isDebounce then return end
        local player = Players:GetPlayerFromCharacter(hit.Parent)
        if not player then return end

        isDebounce = true
        local leaderstats = player:FindFirstChild("leaderstats")
        if leaderstats and leaderstats:FindFirstChild("Coins") then
            local val = coin:GetAttribute("CoinValue") or 10
            leaderstats.Coins.Value = leaderstats.Coins.Value + val
            coinEvent:FireClient(player, val)
        end

        -- Animate hide & respawn
        coin.Transparency = 1
        task.wait(15)
        coin.Transparency = 0
        isDebounce = false
    end)
end

-- 4. Jump Pads
for _, pad in ipairs(CollectionService:GetTagged("jump_pad")) do
    pad.Touched:Connect(function(hit)
        local hrp = hit.Parent and hit.Parent:FindFirstChild("HumanoidRootPart")
        if hrp then
            hrp.AssemblyLinearVelocity = Vector3.new(hrp.AssemblyLinearVelocity.X, 90, hrp.AssemblyLinearVelocity.Z)
        end
    end)
end

-- 5. Speed Boost Pads
for _, pad in ipairs(CollectionService:GetTagged("speed_pad")) do
    pad.Touched:Connect(function(hit)
        local hum = hit.Parent and hit.Parent:FindFirstChild("Humanoid")
        if hum and hum.WalkSpeed < 32 then
            hum.WalkSpeed = 36
            task.delay(4, function()
                if hum then hum.WalkSpeed = 16 end
            end)
        end
    end)
end
`,
    },
    {
      id: 'script_playercontroller',
      name: 'PlayerController',
      path: 'StarterPlayerScripts/PlayerController',
      target: 'StarterPlayerScripts',
      type: 'LocalScript',
      description: 'Client sprint with Shift key, double jump, and movement effects',
      code: `--[[
    BloxCraft AI - Client Player Controller
    Provides sprint mechanics (Left Shift) and camera feedback
--]]
local UserInputService = game:GetService("UserInputService")
local Players = game:GetService("Players")

local player = Players.LocalPlayer
local char = player.Character or player.CharacterAdded:Wait()
local humanoid = char:WaitForChild("Humanoid")

player.CharacterAdded:Connect(function(newChar)
    char = newChar
    humanoid = newChar:WaitForChild("Humanoid")
end)

local NORMAL_SPEED = 16
local SPRINT_SPEED = 26

UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    if input.KeyCode == Enum.KeyCode.LeftShift or input.KeyCode == Enum.KeyCode.RightShift then
        if humanoid and humanoid.Health > 0 then
            humanoid.WalkSpeed = SPRINT_SPEED
        end
    end
end)

UserInputService.InputEnded:Connect(function(input)
    if input.KeyCode == Enum.KeyCode.LeftShift or input.KeyCode == Enum.KeyCode.RightShift then
        if humanoid and humanoid.Health > 0 then
            humanoid.WalkSpeed = NORMAL_SPEED
        end
    end
end)
`,
    },
    {
      id: 'script_hudcontroller',
      name: 'HUDController',
      path: 'StarterGui/HUDController',
      target: 'StarterGui',
      type: 'LocalScript',
      description: 'Creates beautiful custom Roblox ScreenGui for Stage, Coins, and Reset button',
      code: `--[[
    BloxCraft AI - HUD Controller
    Builds on-screen Stage counter, Coins display, and Notification banner
--]]
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")

local player = Players.LocalPlayer
local pGui = player:WaitForChild("PlayerGui")

local remotes = ReplicatedStorage:WaitForChild("Remotes")
local coinEvent = remotes:WaitForChild("CoinCollected")
local checkpointEvent = remotes:WaitForChild("CheckpointReached")

local screenGui = script.Parent
if not screenGui:IsA("ScreenGui") then
    screenGui = Instance.new("ScreenGui")
    screenGui.Name = "BloxCraftHUD"
    screenGui.ResetOnSpawn = false
    screenGui.Parent = pGui
end

-- Top Bar Container
local topBar = Instance.new("Frame")
topBar.Size = UDim2.new(0, 320, 0, 50)
topBar.Position = UDim2.new(0.5, -160, 0, 15)
topBar.BackgroundColor3 = Color3.fromRGB(24, 26, 32)
topBar.BorderSizePixel = 0
topBar.Parent = screenGui

local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0, 12)
corner.Parent = topBar

local stroke = Instance.new("UIStroke")
stroke.Color = Color3.fromRGB(60, 65, 80)
stroke.Thickness = 1.5
stroke.Parent = topBar

-- Stage Label
local stageLabel = Instance.new("TextLabel")
stageLabel.Size = UDim2.new(0.5, 0, 1, 0)
stageLabel.Position = UDim2.new(0, 0, 0, 0)
stageLabel.BackgroundTransparency = 1
stageLabel.Text = "⛳ Stage: 1"
stageLabel.TextColor3 = Color3.fromRGB(0, 230, 118)
stageLabel.Font = Enum.Font.FredokaOne
stageLabel.TextSize = 20
stageLabel.Parent = topBar

-- Coin Label
local coinLabel = Instance.new("TextLabel")
coinLabel.Size = UDim2.new(0.5, 0, 1, 0)
coinLabel.Position = UDim2.new(0.5, 0, 0, 0)
coinLabel.BackgroundTransparency = 1
coinLabel.Text = "🪙 Coins: 0"
coinLabel.TextColor3 = Color3.fromRGB(255, 215, 0)
coinLabel.Font = Enum.Font.FredokaOne
coinLabel.TextSize = 20
coinLabel.Parent = topBar

-- Listen to leaderstats
local leaderstats = player:WaitForChild("leaderstats", 10)
if leaderstats then
    local stageStat = leaderstats:WaitForChild("Stage", 5)
    local coinsStat = leaderstats:WaitForChild("Coins", 5)
    if stageStat then
        stageStat.Changed:Connect(function(v) stageLabel.Text = "⛳ Stage: " .. v end)
    end
    if coinsStat then
        coinsStat.Changed:Connect(function(v) coinLabel.Text = "🪙 Coins: " .. v end)
    end
end
`,
    },
    {
      id: 'script_gameconfig',
      name: 'GameConfig',
      path: 'ReplicatedStorage/GameConfig',
      target: 'ReplicatedStorage',
      type: 'ModuleScript',
      description: 'Shared constants, stages metadata, and shop items configuration',
      code: `local GameConfig = {
    GameName = "${title}",
    Version = "1.0.0",
    TotalStages = 8,
    StartingCoins = 0,
    CoinsPerCheckpoint = 15,
    WinnerRewardCoins = 500,
    ShopItems = {
        { Id = "speed_coil", Name = "Speed Coil", Price = 100, SpeedMultiplier = 1.5 },
        { Id = "gravity_coil", Name = "Gravity Coil", Price = 250, GravityMultiplier = 0.5 },
        { Id = "rainbow_trail", Name = "Rainbow Trail", Price = 500, Cosmetic = true },
    }
}

return GameConfig
`,
    },
  ];

  const lighting: RobloxLighting = {
    clockTime: isLava ? 19.5 : isNeon ? 22 : 14.5,
    brightness: isNeon ? 1.5 : 2.5,
    ambient: isLava ? '#4a1515' : isNeon ? '#1a1033' : '#6b7280',
    outdoorAmbient: isLava ? '#ff3b30' : isNeon ? '#7928ca' : '#9ca3af',
    fogEnd: isLava ? 180 : isNeon ? 250 : 600,
    fogColor: isLava ? '#3d0a0a' : isNeon ? '#110726' : '#bfdbfe',
    technology: 'ShadowMap',
    exposureCompensation: 0.1,
    sunRays: true,
    bloom: isNeon || isLava,
    colorCorrection: {
      brightness: 0.05,
      contrast: isNeon ? 0.25 : 0.1,
      saturation: isRainbow || isNeon ? 0.35 : 0.15,
      tintColor: isLava ? '#ffebeb' : '#ffffff',
    },
  };

  return {
    id,
    prompt,
    title,
    description: `An exhilarating 8-stage Roblox parkour obstacle course with custom checkpoints, kill hazards, coin pickups, jump boosters, and a grand victory trophy island.`,
    genre: 'obby',
    version: '1.0.0',
    author: 'BloxCraft AI Studio',
    createdAt: date,
    gameplay: {
      walkSpeed: 16,
      jumpPower: 50,
      maxHealth: 100,
      respawnTime: 2,
      cameraMode: 'Classic',
      gravity: 196.2,
      currencyName: 'Coins',
      objective: 'Reach the Golden Trophy at Stage 8 without falling into the void!',
      difficulty: 'Medium',
    },
    lighting,
    parts,
    scripts,
    stats: {
      totalParts: parts.length,
      totalStagesOrZones: stageCount,
      estimatedPlayTimeMinutes: 12,
      recommendedPlayers: '1 - 20 Players',
    },
    features: [
      'Multi-stage checkpoint auto-save system',
      'Realistic Roblox studs & brick physics',
      'Instant-kill neon lava hazards',
      'High-propulsion Jump Launchers & Speed Strips',
      'Animated Coin pickup mechanics with respawn timers',
      'Client sprint controller (Left Shift)',
      'Custom Fredoka rounded ScreenGui HUD',
      'Golden Trophy celebration island',
    ],
  };
}

// -----------------------------------------------------------------------------
// TYCOON GENERATOR
// -----------------------------------------------------------------------------
function createTycoonGame(id: string, prompt: string, date: string): RobloxGame {
  const title = '🏭 Modern Factory Tycoon: Automation Empire';
  const parts: RobloxPart[] = [];
  let partIndex = 1;

  // Baseplate
  parts.push({
    id: `part_${partIndex++}`,
    name: 'Baseplate',
    type: 'Part',
    size: [512, 4, 512],
    position: [0, -2, 0],
    color: '#2D3748',
    material: 'Plastic',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'baseplate',
  });

  // Tycoon Plot Floor
  parts.push({
    id: `part_${partIndex++}`,
    name: 'TycoonPlotFloor',
    type: 'Part',
    size: [80, 1.5, 80],
    position: [0, 0, 0],
    color: '#4A5568',
    material: 'SmoothPlastic',
    transparency: 0,
    anchored: true,
    canCollide: true,
  });

  // Spawn Pad
  parts.push({
    id: `part_${partIndex++}`,
    name: 'TycoonSpawn',
    type: 'SpawnLocation',
    size: [8, 1, 8],
    position: [0, 1, -30],
    color: '#3182CE',
    material: 'Neon',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'spawn',
  });

  // Conveyor Belt
  parts.push({
    id: `part_${partIndex++}`,
    name: 'MainConveyor',
    type: 'Part',
    size: [6, 1.5, 48],
    position: [0, 1.5, 0],
    color: '#1A202C',
    material: 'DiamondPlate',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'conveyor',
  });

  // Collector Furnace at the end of conveyor
  parts.push({
    id: `part_${partIndex++}`,
    name: 'CollectorFurnace',
    type: 'Part',
    size: [8, 6, 8],
    position: [0, 3.5, 24],
    color: '#DD6B20',
    material: 'Metal',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'collector',
    tooltip: 'Furnace Collector: Converts raw ores into Cash!',
  });

  // Dropper 1: Starter Copper Dropper
  parts.push({
    id: `part_${partIndex++}`,
    name: 'DropperStand_1',
    type: 'Part',
    size: [2, 10, 2],
    position: [0, 6, -20],
    color: '#718096',
    material: 'Metal',
    transparency: 0,
    anchored: true,
    canCollide: true,
  });
  parts.push({
    id: `part_${partIndex++}`,
    name: 'StarterDropperTube',
    type: 'Part',
    size: [4, 3, 4],
    position: [0, 11, -20],
    color: '#B7791F',
    material: 'Neon',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'dropper',
    coinValue: 5,
    tooltip: 'Starter Dropper: Generates +$5 Copper Ores every 2s',
  });

  // Dropper 2: Silver Dropper
  parts.push({
    id: `part_${partIndex++}`,
    name: 'DropperStand_2',
    type: 'Part',
    size: [2, 10, 2],
    position: [0, 6, -10],
    color: '#718096',
    material: 'Metal',
    transparency: 0,
    anchored: true,
    canCollide: true,
  });
  parts.push({
    id: `part_${partIndex++}`,
    name: 'SilverDropperTube',
    type: 'Part',
    size: [4, 3, 4],
    position: [0, 11, -10],
    color: '#E2E8F0',
    material: 'Neon',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'dropper',
    coinValue: 15,
  });

  // Dropper 3: Gold Dropper
  parts.push({
    id: `part_${partIndex++}`,
    name: 'DropperStand_3',
    type: 'Part',
    size: [2, 10, 2],
    position: [0, 6, 0],
    color: '#718096',
    material: 'Metal',
    transparency: 0,
    anchored: true,
    canCollide: true,
  });
  parts.push({
    id: `part_${partIndex++}`,
    name: 'GoldDropperTube',
    type: 'Part',
    size: [4, 3, 4],
    position: [0, 11, 0],
    color: '#ECC94B',
    material: 'Neon',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'dropper',
    coinValue: 40,
  });

  // Interactive Buy Buttons on the floor
  const buttons = [
    { name: 'Buy Silver Dropper', price: 150, pos: [-15, 1, -10], color: '#E2E8F0', item: 'SilverDropper' },
    { name: 'Buy Gold Dropper', price: 500, pos: [-15, 1, 0], color: '#ECC94B', item: 'GoldDropper' },
    { name: 'Buy Laser Upgrader', price: 800, pos: [15, 1, -10], color: '#9F7AEA', item: 'Upgrader' },
    { name: 'Buy Security Walls', price: 1200, pos: [15, 1, 0], color: '#38A169', item: 'Walls' },
    { name: 'Buy Speed Coil Dispenser', price: 2000, pos: [15, 1, 15], color: '#E53E3E', item: 'SpeedCoil' },
  ];

  buttons.forEach((b) => {
    parts.push({
      id: `part_${partIndex++}`,
      name: b.name.replace(/\s+/g, ''),
      type: 'Part',
      shape: 'Cylinder',
      size: [6, 1, 6],
      position: [b.pos[0], b.pos[1], b.pos[2]],
      color: b.color,
      material: 'Neon',
      transparency: 0.1,
      anchored: true,
      canCollide: true,
      tag: 'buy_button',
      price: b.price,
      itemReward: b.item,
      tooltip: `${b.name} - Price: $${b.price}`,
    });
  });

  // Laser Upgrader Arch over conveyor
  parts.push({
    id: `part_${partIndex++}`,
    name: 'UpgraderArchLeft',
    type: 'Part',
    size: [1.5, 8, 1.5],
    position: [-4.5, 5, 10],
    color: '#9F7AEA',
    material: 'Neon',
    transparency: 0,
    anchored: true,
    canCollide: true,
  });
  parts.push({
    id: `part_${partIndex++}`,
    name: 'UpgraderArchRight',
    type: 'Part',
    size: [1.5, 8, 1.5],
    position: [4.5, 5, 10],
    color: '#9F7AEA',
    material: 'Neon',
    transparency: 0,
    anchored: true,
    canCollide: true,
  });
  parts.push({
    id: `part_${partIndex++}`,
    name: 'LaserBeam',
    type: 'Part',
    size: [8, 0.4, 0.4],
    position: [0, 4.5, 10],
    color: '#D53F8C',
    material: 'Neon',
    transparency: 0.2,
    anchored: true,
    canCollide: false,
    tooltip: 'Laser Upgrader: Multiplies ore value x2!',
  });

  // Surrounding Walls
  parts.push({
    id: `part_${partIndex++}`,
    name: 'FactoryBackWall',
    type: 'Part',
    size: [80, 16, 2],
    position: [0, 8, -40],
    color: '#2B6CB0',
    material: 'SmoothPlastic',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'wall',
  });
  parts.push({
    id: `part_${partIndex++}`,
    name: 'FactoryLeftWall',
    type: 'Part',
    size: [2, 16, 80],
    position: [-40, 8, 0],
    color: '#2B6CB0',
    material: 'SmoothPlastic',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'wall',
  });
  parts.push({
    id: `part_${partIndex++}`,
    name: 'FactoryRightWall',
    type: 'Part',
    size: [2, 16, 80],
    position: [40, 8, 0],
    color: '#2B6CB0',
    material: 'SmoothPlastic',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'wall',
  });

  // Cash Vault / ATM Box
  parts.push({
    id: `part_${partIndex++}`,
    name: 'CashATM',
    type: 'Part',
    size: [4, 7, 3],
    position: [-25, 4.5, -28],
    color: '#38A169',
    material: 'Metal',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tooltip: 'Bank Vault: Step on to claim accumulated profits!',
  });

  const scripts: LuauScript[] = [
    {
      id: 'script_tycoon_leaderstats',
      name: 'Leaderstats',
      path: 'ServerScriptService/Leaderstats',
      target: 'ServerScriptService',
      type: 'Script',
      description: 'Manages player Cash and Rebirths stats',
      code: `local Players = game:GetService("Players")

local function onPlayerAdded(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local cash = Instance.new("IntValue")
    cash.Name = "Cash"
    cash.Value = 100 -- Starting bonus
    cash.Parent = leaderstats

    local rebirths = Instance.new("IntValue")
    rebirths.Name = "Rebirths"
    rebirths.Value = 0
    rebirths.Parent = leaderstats
end

Players.PlayerAdded:Connect(onPlayerAdded)
`,
    },
    {
      id: 'script_tycoon_manager',
      name: 'TycoonManager',
      path: 'ServerScriptService/TycoonManager',
      target: 'ServerScriptService',
      type: 'Script',
      description: 'Controls ore dropping loop, conveyor belt physics, and button purchases',
      code: `--[[
    BloxCraft AI - Factory Tycoon Core Loop
    Handles Droppers, Conveyor momentum, and Buy Buttons
--]]
local CollectionService = game:GetService("CollectionService")
local Players = game:GetService("Players")
local Debris = game:GetService("Debris")

-- 1. Dropper Spawning Loop
task.spawn(function()
    while true do
        task.wait(2.2)
        for _, dropper in ipairs(CollectionService:GetTagged("dropper")) do
            local ore = Instance.new("Part")
            ore.Name = "Ore"
            ore.Shape = Enum.PartType.Ball
            ore.Size = Vector3.new(1.8, 1.8, 1.8)
            ore.Position = dropper.Position - Vector3.new(0, 2.5, 0)
            ore.Color = dropper.Color
            ore.Material = Enum.Material.Neon
            ore.Anchored = false
            ore.CanCollide = true
            ore:SetAttribute("Value", dropper:GetAttribute("CoinValue") or 10)
            ore.Parent = workspace
            Debris:AddItem(ore, 20)
        end
    end
end)

-- 2. Conveyor Belt Physics Velocity
for _, conveyor in ipairs(CollectionService:GetTagged("conveyor")) do
    conveyor.AssemblyLinearVelocity = Vector3.new(0, 0, 16)
end

-- 3. Collector Furnace Cash Conversion
for _, collector in ipairs(CollectionService:GetTagged("collector")) do
    collector.Touched:Connect(function(hit)
        if hit.Name == "Ore" then
            local val = hit:GetAttribute("Value") or 10
            hit:Destroy()

            -- Credit cash to nearest tycoon owner
            local players = Players:GetPlayers()
            if #players > 0 then
                local p = players[1]
                local ls = p:FindFirstChild("leaderstats")
                if ls and ls:FindFirstChild("Cash") then
                    ls.Cash.Value = ls.Cash.Value + val
                end
            end
        end
    end)
end

-- 4. Buy Buttons
for _, btn in ipairs(CollectionService:GetTagged("buy_button")) do
    local isDebounce = false
    btn.Touched:Connect(function(hit)
        if isDebounce then return end
        local player = Players:GetPlayerFromCharacter(hit.Parent)
        if not player then return end

        local ls = player:FindFirstChild("leaderstats")
        if not ls then return end
        local cashStat = ls:FindFirstChild("Cash")
        local price = btn:GetAttribute("Price") or 100

        if cashStat and cashStat.Value >= price then
            isDebounce = true
            cashStat.Value = cashStat.Value - price
            btn.Color = Color3.fromRGB(0, 255, 0)
            print("Purchased: " .. btn.Name)
            task.wait(1.5)
            btn.Color = Color3.fromRGB(150, 150, 150)
            btn.CanCollide = false
            btn.Transparency = 0.8
        end
    end)
end
`,
    },
  ];

  const lighting: RobloxLighting = {
    clockTime: 14.0,
    brightness: 2.2,
    ambient: '#4a5568',
    outdoorAmbient: '#a0aec0',
    fogEnd: 800,
    fogColor: '#e2e8f0',
    technology: 'Future',
    exposureCompensation: 0.1,
    sunRays: true,
    bloom: true,
    colorCorrection: {
      brightness: 0.05,
      contrast: 0.15,
      saturation: 0.2,
      tintColor: '#ffffff',
    },
  };

  return {
    id,
    prompt,
    title,
    description: `A fully automated industrial tycoon where you generate ores, convey them into high-temperature furnaces, earn cash, and purchase upgrades.`,
    genre: 'tycoon',
    version: '1.0.0',
    author: 'BloxCraft AI Studio',
    createdAt: date,
    gameplay: {
      walkSpeed: 16,
      jumpPower: 50,
      maxHealth: 100,
      respawnTime: 3,
      cameraMode: 'Classic',
      gravity: 196.2,
      currencyName: 'Cash',
      objective: 'Build the ultimate automated factory empire and maximize profit per second!',
      difficulty: 'Easy',
    },
    lighting,
    parts,
    scripts,
    stats: {
      totalParts: parts.length,
      totalStagesOrZones: 5,
      estimatedPlayTimeMinutes: 25,
      recommendedPlayers: '1 - 6 Players',
    },
    features: [
      'Multi-tiered ore droppers (Copper, Silver, Gold)',
      'High-velocity physical conveyor system',
      'Ore melting collector furnace with value calculation',
      'Interactive cylinder buy buttons with dynamic pricing',
      'Laser beam ore multiplier arch',
      'Full factory perimeter wall enclosure',
    ],
  };
}

// -----------------------------------------------------------------------------
// SURVIVAL / ZOMBIE OUTBREAK GENERATOR
// -----------------------------------------------------------------------------
function createSurvivalGame(id: string, prompt: string, date: string): RobloxGame {
  const title = '🧟 Zombie Outbreak: Fort Survival Wave Defense';
  const parts: RobloxPart[] = [];
  let partIndex = 1;

  // Baseplate (Post-apocalyptic scorched ground)
  parts.push({
    id: `part_${partIndex++}`,
    name: 'ScorchedEarth',
    type: 'Part',
    size: [512, 4, 512],
    position: [0, -2, 0],
    color: '#1A202C',
    material: 'Cobblestone',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'baseplate',
  });

  // Fort Outpost Concrete Slab
  parts.push({
    id: `part_${partIndex++}`,
    name: 'FortBunkerFloor',
    type: 'Part',
    size: [60, 2, 60],
    position: [0, 0, 0],
    color: '#4A5568',
    material: 'Metal',
    transparency: 0,
    anchored: true,
    canCollide: true,
  });

  // Player Spawn in bunker
  parts.push({
    id: `part_${partIndex++}`,
    name: 'BunkerSafeSpawn',
    type: 'SpawnLocation',
    size: [10, 1, 10],
    position: [0, 1.5, 0],
    color: '#38A169',
    material: 'Neon',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'spawn',
  });

  // Watchtower
  parts.push({
    id: `part_${partIndex++}`,
    name: 'TowerLeg_1',
    type: 'Part',
    size: [2, 24, 2],
    position: [-20, 12, -20],
    color: '#2D3748',
    material: 'Metal',
    transparency: 0,
    anchored: true,
    canCollide: true,
  });
  parts.push({
    id: `part_${partIndex++}`,
    name: 'TowerLeg_2',
    type: 'Part',
    size: [2, 24, 2],
    position: [-10, 12, -20],
    color: '#2D3748',
    material: 'Metal',
    transparency: 0,
    anchored: true,
    canCollide: true,
  });
  parts.push({
    id: `part_${partIndex++}`,
    name: 'SniperPlatform',
    type: 'Part',
    size: [16, 2, 16],
    position: [-15, 24, -20],
    color: '#718096',
    material: 'DiamondPlate',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tooltip: 'High Sniper Nest: Elevated vantage point for wave defense!',
  });

  // 4 Zombie Spawner Crypts around the perimeter
  const spawnerPos = [
    [0, 2, 70],
    [0, 2, -70],
    [70, 2, 0],
    [-70, 2, 0],
  ];

  spawnerPos.forEach((pos, idx) => {
    parts.push({
      id: `part_${partIndex++}`,
      name: `ZombieCryptSpawner_${idx + 1}`,
      type: 'Part',
      size: [12, 4, 12],
      position: [pos[0], pos[1], pos[2]],
      color: '#E53E3E',
      material: 'Neon',
      transparency: 0.1,
      anchored: true,
      canCollide: true,
      tag: 'spawner',
      tooltip: `Zombie Spawn Nest ${idx + 1}: Waves emerge from here!`,
    });
  });

  // Barricades
  const barricadeConfigs = [
    { pos: [0, 4, 28], size: [30, 6, 2] },
    { pos: [0, 4, -28], size: [30, 6, 2] },
    { pos: [28, 4, 0], size: [2, 6, 30] },
    { pos: [-28, 4, 0], size: [2, 6, 30] },
  ];

  barricadeConfigs.forEach((b, idx) => {
    parts.push({
      id: `part_${partIndex++}`,
      name: `WoodBarricade_${idx + 1}`,
      type: 'Part',
      size: [b.size[0], b.size[1], b.size[2]],
      position: [b.pos[0], b.pos[1], b.pos[2]],
      color: '#8C6239',
      material: 'WoodPlanks',
      transparency: 0,
      anchored: true,
      canCollide: true,
      tag: 'wall',
    });
  });

  // Ammo Supply Crate
  parts.push({
    id: `part_${partIndex++}`,
    name: 'AmmoSupplyCrate',
    type: 'Part',
    size: [5, 4, 5],
    position: [12, 2.5, 12],
    color: '#D69E2E',
    material: 'Wood',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'crate',
    tooltip: 'Ammo Cache: Touch to replenish magazines!',
  });

  // Health Station
  parts.push({
    id: `part_${partIndex++}`,
    name: 'MedStation',
    type: 'Part',
    size: [6, 1, 6],
    position: [-12, 1, 12],
    color: '#E53E3E',
    material: 'Neon',
    transparency: 0.2,
    anchored: true,
    canCollide: true,
    tooltip: 'Med-Bay: Restores 100% Health when standing here',
  });

  const scripts: LuauScript[] = [
    {
      id: 'script_survival_manager',
      name: 'WaveManager',
      path: 'ServerScriptService/WaveManager',
      target: 'ServerScriptService',
      type: 'Script',
      description: 'Manages wave timer, zombie spawn intervals, kills counter, and rewards',
      code: `--[[
    BloxCraft AI - Wave Defense & Zombie Spawner
--]]
local Players = game:GetService("Players")

local currentWave = 1
local zombiesRemaining = 0

local function onPlayerAdded(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local wave = Instance.new("IntValue")
    wave.Name = "Wave"
    wave.Value = currentWave
    wave.Parent = leaderstats

    local kills = Instance.new("IntValue")
    kills.Name = "Kills"
    kills.Value = 0
    kills.Parent = leaderstats
end

Players.PlayerAdded:Connect(onPlayerAdded)
`,
    },
  ];

  const lighting: RobloxLighting = {
    clockTime: 0.5, // Midnight blood moon
    brightness: 1.2,
    ambient: '#3d0a0a',
    outdoorAmbient: '#5c1010',
    fogEnd: 160,
    fogColor: '#2b0505',
    technology: 'ShadowMap',
    exposureCompensation: -0.2,
    sunRays: false,
    bloom: true,
    colorCorrection: {
      brightness: -0.05,
      contrast: 0.35,
      saturation: -0.2,
      tintColor: '#ffcccc',
    },
  };

  return {
    id,
    prompt,
    title,
    description: `A tense, dark zombie survival game where you defend a fortified bunker against incoming undead hordes under an eerie blood moon.`,
    genre: 'survival',
    version: '1.0.0',
    author: 'BloxCraft AI Studio',
    createdAt: date,
    gameplay: {
      walkSpeed: 18,
      jumpPower: 50,
      maxHealth: 100,
      respawnTime: 4,
      cameraMode: 'Classic',
      gravity: 196.2,
      currencyName: 'Kills',
      objective: 'Survive the endless zombie waves, hold the barricades, and climb the kill leaderboards!',
      difficulty: 'Hard',
    },
    lighting,
    parts,
    scripts,
    stats: {
      totalParts: parts.length,
      totalStagesOrZones: 4,
      estimatedPlayTimeMinutes: 20,
      recommendedPlayers: '1 - 8 Players',
    },
    features: [
      'Multi-direction Zombie crypt spawner system',
      'Fortified bunker outpost with elevated sniper tower',
      'Repairable perimeter wooden barricades',
      'Tactical Ammo Crate & Health Regeneration Station',
      'Atmospheric Blood Moon night lighting with crimson fog',
    ],
  };
}

// -----------------------------------------------------------------------------
// PET SIMULATOR / MINING GENERATOR
// -----------------------------------------------------------------------------
function createSimulatorGame(id: string, prompt: string, date: string): RobloxGame {
  const title = '🐾 Cyber Pet Simulator: Biome Hatchery';
  const parts: RobloxPart[] = [];
  let partIndex = 1;

  // Baseplate
  parts.push({
    id: `part_${partIndex++}`,
    name: 'SimulatorBase',
    type: 'Part',
    size: [512, 4, 512],
    position: [0, -2, 0],
    color: '#38A169',
    material: 'Grass',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'baseplate',
  });

  // Spawn Pad
  parts.push({
    id: `part_${partIndex++}`,
    name: 'PetSpawn',
    type: 'SpawnLocation',
    size: [16, 1.5, 16],
    position: [0, 1, 0],
    color: '#FF69B4',
    material: 'Neon',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'spawn',
  });

  // 4 Egg Hatching Pedestals
  const eggPedestals = [
    { name: 'Common Pet Egg', price: 100, color: '#A0AEC0', pos: [-15, 2, 15] },
    { name: 'Rare Neon Egg', price: 500, color: '#00F0FF', pos: [-5, 2, 15] },
    { name: 'Epic Lava Dragon Egg', price: 2500, color: '#FF3300', pos: [5, 2, 15] },
    { name: 'Legendary Cyber Egg', price: 10000, color: '#FFD700', pos: [15, 2, 15] },
  ];

  eggPedestals.forEach((egg) => {
    // Pedestal
    parts.push({
      id: `part_${partIndex++}`,
      name: egg.name.replace(/\s+/g, '') + '_Base',
      type: 'Part',
      shape: 'Cylinder',
      size: [6, 2, 6],
      position: [egg.pos[0], egg.pos[1], egg.pos[2]],
      color: '#4A5568',
      material: 'SmoothPlastic',
      transparency: 0,
      anchored: true,
      canCollide: true,
    });
    // Egg
    parts.push({
      id: `part_${partIndex++}`,
      name: egg.name.replace(/\s+/g, ''),
      type: 'Part',
      shape: 'Ball',
      size: [4, 5.5, 4],
      position: [egg.pos[0], egg.pos[1] + 3.5, egg.pos[2]],
      color: egg.color,
      material: 'Neon',
      transparency: 0,
      anchored: true,
      canCollide: true,
      tag: 'buy_button',
      price: egg.price,
      tooltip: `${egg.name} - Price: ${egg.price} Coins`,
    });
  });

  // Coin Farming Biomes (Tiered Zones)
  const biomes = [
    { name: 'MeadowZone', pos: [0, 1, 60], size: [80, 1, 60], color: '#48BB78', mat: 'Grass' as const, val: 5 },
    { name: 'DesertZone', pos: [90, 1, 60], size: [80, 1, 60], color: '#D69E2E', mat: 'Plastic' as const, val: 25 },
    { name: 'VolcanoZone', pos: [-90, 1, 60], size: [80, 1, 60], color: '#9B2C2C', mat: 'Cobblestone' as const, val: 100 },
  ];

  biomes.forEach((b) => {
    parts.push({
      id: `part_${partIndex++}`,
      name: b.name,
      type: 'Part',
      size: [b.size[0], b.size[1], b.size[2]],
      position: [b.pos[0], b.pos[1], b.pos[2]],
      color: b.color,
      material: b.mat,
      transparency: 0,
      anchored: true,
      canCollide: true,
    });

    // Scatter 4 coin clusters per biome
    for (let c = 0; c < 4; c++) {
      const offsetX = (c % 2 === 0 ? -15 : 15) + (Math.random() * 4 - 2);
      const offsetZ = (c < 2 ? -15 : 15) + (Math.random() * 4 - 2);
      parts.push({
        id: `part_${partIndex++}`,
        name: `CoinPile_${b.name}_${c + 1}`,
        type: 'Part',
        shape: 'Cylinder',
        size: [3, 0.8, 3],
        position: [b.pos[0] + offsetX, b.pos[1] + 1.5, b.pos[2] + offsetZ],
        color: '#FFD700',
        material: 'Neon',
        transparency: 0,
        anchored: true,
        canCollide: false,
        tag: 'coin',
        coinValue: b.val,
      });
    }
  });

  const scripts: LuauScript[] = [
    {
      id: 'script_petsim_leaderstats',
      name: 'Leaderstats',
      path: 'ServerScriptService/Leaderstats',
      target: 'ServerScriptService',
      type: 'Script',
      description: 'Tracks player Coins, Gems, and Rebirths',
      code: `local Players = game:GetService("Players")

local function onPlayerAdded(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 100
    coins.Parent = leaderstats

    local gems = Instance.new("IntValue")
    gems.Name = "Gems"
    gems.Value = 10
    gems.Parent = leaderstats
end

Players.PlayerAdded:Connect(onPlayerAdded)
`,
    },
  ];

  const lighting: RobloxLighting = {
    clockTime: 12.0,
    brightness: 3.0,
    ambient: '#718096',
    outdoorAmbient: '#cbd5e0',
    fogEnd: 1200,
    fogColor: '#ebf8ff',
    technology: 'Future',
    exposureCompensation: 0.15,
    sunRays: true,
    bloom: true,
    colorCorrection: {
      brightness: 0.08,
      contrast: 0.2,
      saturation: 0.4,
      tintColor: '#ffffff',
    },
  };

  return {
    id,
    prompt,
    title,
    description: `A colorful pet hatching simulator with tiered farming zones (Meadow, Desert, Volcano) and vibrant neon pet eggs.`,
    genre: 'simulator',
    version: '1.0.0',
    author: 'BloxCraft AI Studio',
    createdAt: date,
    gameplay: {
      walkSpeed: 18,
      jumpPower: 50,
      maxHealth: 100,
      respawnTime: 2,
      cameraMode: 'Classic',
      gravity: 196.2,
      currencyName: 'Coins',
      objective: 'Collect coins in tiered biomes, hatch rare pets, and climb the leaderboard!',
      difficulty: 'Easy',
    },
    lighting,
    parts,
    scripts,
    stats: {
      totalParts: parts.length,
      totalStagesOrZones: 4,
      estimatedPlayTimeMinutes: 30,
      recommendedPlayers: '1 - 15 Players',
    },
    features: [
      '4 Collectible Pet Egg Pedestals (Common, Rare, Epic, Legendary)',
      '3 Distinct Tiered Biomes with scalable coin rewards',
      'Dynamic coin pile respawn timers',
      'High saturation vibrant cartoon lighting',
    ],
  };
}

// -----------------------------------------------------------------------------
// ARENA / SWORD PVP GENERATOR
// -----------------------------------------------------------------------------
function createArenaGame(id: string, prompt: string, date: string): RobloxGame {
  const title = '⚔️ Heights Battleground: Sword Arena PvP';
  const parts: RobloxPart[] = [];
  let partIndex = 1;

  // Main Arena Floating Island
  parts.push({
    id: `part_${partIndex++}`,
    name: 'ArenaBaseplate',
    type: 'Part',
    size: [120, 4, 120],
    position: [0, 0, 0],
    color: '#2B6CB0',
    material: 'SmoothPlastic',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'baseplate',
  });

  // Red Team Spawn
  parts.push({
    id: `part_${partIndex++}`,
    name: 'RedTeamSpawn',
    type: 'SpawnLocation',
    size: [16, 1.5, 16],
    position: [0, 2, -45],
    color: '#E53E3E',
    material: 'Neon',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'spawn',
  });

  // Blue Team Spawn
  parts.push({
    id: `part_${partIndex++}`,
    name: 'BlueTeamSpawn',
    type: 'SpawnLocation',
    size: [16, 1.5, 16],
    position: [0, 2, 45],
    color: '#3182CE',
    material: 'Neon',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'spawn',
  });

  // Central Sword Pedestal
  parts.push({
    id: `part_${partIndex++}`,
    name: 'CenterPedestal',
    type: 'Part',
    shape: 'Cylinder',
    size: [12, 3, 12],
    position: [0, 2, 0],
    color: '#D69E2E',
    material: 'Metal',
    transparency: 0,
    anchored: true,
    canCollide: true,
  });

  // Floating Mythic Sword Crystal
  parts.push({
    id: `part_${partIndex++}`,
    name: 'MythicSwordCrystal',
    type: 'Part',
    size: [2, 8, 2],
    position: [0, 7.5, 0],
    color: '#00F0FF',
    material: 'Neon',
    transparency: 0.1,
    anchored: true,
    canCollide: false,
    tooltip: 'Legendary Sword Pedestal: Touch to equip the Flaming Katana!',
  });

  // 4 Corner Cover Towers
  const corners = [
    [-35, -35],
    [35, -35],
    [-35, 35],
    [35, 35],
  ];

  corners.forEach(([cx, cz], idx) => {
    parts.push({
      id: `part_${partIndex++}`,
      name: `CoverTower_${idx + 1}`,
      type: 'Part',
      size: [8, 14, 8],
      position: [cx, 7, cz],
      color: '#4A5568',
      material: 'Cobblestone',
      transparency: 0,
      anchored: true,
      canCollide: true,
    });
  });

  const scripts: LuauScript[] = [
    {
      id: 'script_pvp_leaderstats',
      name: 'Leaderstats',
      path: 'ServerScriptService/Leaderstats',
      target: 'ServerScriptService',
      type: 'Script',
      description: 'Tracks Kills, Deaths, and K/D Ratio for competitive Roblox PvP',
      code: `local Players = game:GetService("Players")

local function onPlayerAdded(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local kills = Instance.new("IntValue")
    kills.Name = "Kills"
    kills.Value = 0
    kills.Parent = leaderstats

    local streak = Instance.new("IntValue")
    streak.Name = "Streak"
    streak.Value = 0
    streak.Parent = leaderstats
end

Players.PlayerAdded:Connect(onPlayerAdded)
`,
    },
  ];

  const lighting: RobloxLighting = {
    clockTime: 16.5, // Sunset golden hour
    brightness: 2.4,
    ambient: '#744210',
    outdoorAmbient: '#dd6b20',
    fogEnd: 800,
    fogColor: '#fed7aa',
    technology: 'ShadowMap',
    exposureCompensation: 0.1,
    sunRays: true,
    bloom: true,
    colorCorrection: {
      brightness: 0.05,
      contrast: 0.2,
      saturation: 0.3,
      tintColor: '#ffedd5',
    },
  };

  return {
    id,
    prompt,
    title,
    description: `A fast-paced arena battleground featuring classic sword fighting, balanced cover pillars, team spawns, and a mythic weapon centerpiece.`,
    genre: 'arena',
    version: '1.0.0',
    author: 'BloxCraft AI Studio',
    createdAt: date,
    gameplay: {
      walkSpeed: 20,
      jumpPower: 55,
      maxHealth: 100,
      respawnTime: 2,
      cameraMode: 'Classic',
      gravity: 196.2,
      currencyName: 'Kills',
      objective: 'Eliminate rivals, claim the central sword, and dominate the leaderboard!',
      difficulty: 'Medium',
    },
    lighting,
    parts,
    scripts,
    stats: {
      totalParts: parts.length,
      totalStagesOrZones: 3,
      estimatedPlayTimeMinutes: 15,
      recommendedPlayers: '2 - 16 Players',
    },
    features: [
      'Symmetrical competitive arena design',
      'Red vs Blue opposing team spawn zones',
      'Central legendary weapon pedestal',
      'Stone cover towers for tactical evasion',
      'Sunset golden hour atmospheric lighting',
    ],
  };
}

// -----------------------------------------------------------------------------
// HORROR / ESCAPE GENERATOR
// -----------------------------------------------------------------------------
function createHorrorGame(id: string, prompt: string, date: string): RobloxGame {
  const title = '🔦 The Dark Asylum: Chapter 1 Escape';
  const parts: RobloxPart[] = [];
  let partIndex = 1;

  // Dark ground
  parts.push({
    id: `part_${partIndex++}`,
    name: 'DarkGround',
    type: 'Part',
    size: [256, 2, 256],
    position: [0, -1, 0],
    color: '#0D0E12',
    material: 'Cobblestone',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'baseplate',
  });

  // Spawn room
  parts.push({
    id: `part_${partIndex++}`,
    name: 'AsylumSpawn',
    type: 'SpawnLocation',
    size: [10, 1, 10],
    position: [0, 1, 0],
    color: '#4A5568',
    material: 'WoodPlanks',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'spawn',
  });

  // Creepy Hallway Walls
  for (let h = 0; h < 6; h++) {
    const zPos = 15 + h * 16;
    parts.push({
      id: `part_${partIndex++}`,
      name: `HallwayWallLeft_${h}`,
      type: 'Part',
      size: [2, 14, 16],
      position: [-10, 7, zPos],
      color: '#1A202C',
      material: 'Cobblestone',
      transparency: 0,
      anchored: true,
      canCollide: true,
      tag: 'wall',
    });
    parts.push({
      id: `part_${partIndex++}`,
      name: `HallwayWallRight_${h}`,
      type: 'Part',
      size: [2, 14, 16],
      position: [10, 7, zPos],
      color: '#1A202C',
      material: 'Cobblestone',
      transparency: 0,
      anchored: true,
      canCollide: true,
      tag: 'wall',
    });

    // Flickering ceiling light
    parts.push({
      id: `part_${partIndex++}`,
      name: `FlickeringBulb_${h}`,
      type: 'Part',
      shape: 'Ball',
      size: [1.2, 1.2, 1.2],
      position: [0, 13.5, zPos],
      color: h % 2 === 0 ? '#FFE066' : '#FF4444',
      material: 'Neon',
      transparency: 0.1,
      anchored: true,
      canCollide: false,
    });
  }

  // Locked Exit Door at the end
  parts.push({
    id: `part_${partIndex++}`,
    name: 'HeavyLockedExitDoor',
    type: 'Part',
    size: [18, 14, 2],
    position: [0, 7, 115],
    color: '#742A2A',
    material: 'Metal',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'door',
    tooltip: 'Heavy Steel Door: Locked! Find the Silver Key to escape!',
  });

  const scripts: LuauScript[] = [
    {
      id: 'script_horror_flashlight',
      name: 'FlashlightManager',
      path: 'StarterPlayerScripts/Flashlight',
      target: 'StarterPlayerScripts',
      type: 'LocalScript',
      description: 'Equips player with custom dynamic flashlight beam in dark corridors',
      code: `local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")

local player = Players.LocalPlayer
local char = player.Character or player.CharacterAdded:Wait()
local hrp = char:WaitForChild("HumanoidRootPart")

local light = Instance.new("SpotLight")
light.Brightness = 4
light.Range = 45
light.Angle = 60
light.Face = Enum.NormalId.Front
light.Parent = hrp
`,
    },
  ];

  const lighting: RobloxLighting = {
    clockTime: 0.0, // Pitch black midnight
    brightness: 0.2,
    ambient: '#05070a',
    outdoorAmbient: '#0a0d14',
    fogEnd: 60,
    fogColor: '#05070a',
    technology: 'Future',
    exposureCompensation: -0.4,
    sunRays: false,
    bloom: false,
    colorCorrection: {
      brightness: -0.15,
      contrast: 0.4,
      saturation: -0.5,
      tintColor: '#a0aec0',
    },
  };

  return {
    id,
    prompt,
    title,
    description: `A spine-chilling horror escape where you must navigate pitch-black asylum hallways, evade unseen horrors, and unlock the final exit door.`,
    genre: 'horror',
    version: '1.0.0',
    author: 'BloxCraft AI Studio',
    createdAt: date,
    gameplay: {
      walkSpeed: 14,
      jumpPower: 45,
      maxHealth: 100,
      respawnTime: 5,
      cameraMode: 'LockFirstPerson',
      gravity: 196.2,
      currencyName: 'Keys',
      objective: 'Explore the asylum corridors with your flashlight and find the Silver Key to unlock the blast door!',
      difficulty: 'Hard',
    },
    lighting,
    parts,
    scripts,
    stats: {
      totalParts: parts.length,
      totalStagesOrZones: 3,
      estimatedPlayTimeMinutes: 18,
      recommendedPlayers: '1 - 4 Players',
    },
    features: [
      'Dense claustrophobic hallway layout with flickering lights',
      'Dynamic player spotlight flashlight system',
      'Locked heavy steel security door mechanic',
      'Pitch-black Future lighting technology with 60-stud fog',
    ],
  };
}

// -----------------------------------------------------------------------------
// RACING / SPEED RUN GENERATOR
// -----------------------------------------------------------------------------
function createRacingGame(id: string, prompt: string, date: string): RobloxGame {
  const title = '⚡ HyperSpeed Neon Velocity Dash';
  const parts: RobloxPart[] = [];
  let partIndex = 1;

  // Track floor
  parts.push({
    id: `part_${partIndex++}`,
    name: 'SpeedTrackFloor',
    type: 'Part',
    size: [32, 2, 280],
    position: [0, 0, 120],
    color: '#111827',
    material: 'SmoothPlastic',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'baseplate',
  });

  // Start Line
  parts.push({
    id: `part_${partIndex++}`,
    name: 'StartLineSpawn',
    type: 'SpawnLocation',
    size: [28, 1, 12],
    position: [0, 1.5, 0],
    color: '#00FFCC',
    material: 'Neon',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'spawn',
  });

  // Left & Right Glowing Neon Guard Rails
  parts.push({
    id: `part_${partIndex++}`,
    name: 'TrackRailLeft',
    type: 'Part',
    size: [2, 6, 280],
    position: [-16, 4, 120],
    color: '#EC4899',
    material: 'Neon',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'wall',
  });
  parts.push({
    id: `part_${partIndex++}`,
    name: 'TrackRailRight',
    type: 'Part',
    size: [2, 6, 280],
    position: [16, 4, 120],
    color: '#00F0FF',
    material: 'Neon',
    transparency: 0,
    anchored: true,
    canCollide: true,
    tag: 'wall',
  });

  // Speed Booster Pads along the course
  for (let b = 0; b < 6; b++) {
    const zPos = 30 + b * 40;
    parts.push({
      id: `part_${partIndex++}`,
      name: `SpeedPad_${b + 1}`,
      type: 'Part',
      size: [24, 0.4, 8],
      position: [0, 1.2, zPos],
      color: '#FFEA00',
      material: 'Neon',
      transparency: 0.1,
      anchored: true,
      canCollide: true,
      tag: 'speed_pad',
      tooltip: 'BOOST PAD: Accelerates you to 65 WalkSpeed!',
    });
  }

  // Finish Line Arch
  parts.push({
    id: `part_${partIndex++}`,
    name: 'FinishArch',
    type: 'Part',
    size: [32, 14, 4],
    position: [0, 8, 250],
    color: '#00FFCC',
    material: 'Neon',
    transparency: 0.2,
    anchored: true,
    canCollide: false,
    tag: 'finish',
  });

  const scripts: LuauScript[] = [
    {
      id: 'script_speed_leaderstats',
      name: 'Leaderstats',
      path: 'ServerScriptService/Leaderstats',
      target: 'ServerScriptService',
      type: 'Script',
      description: 'Tracks player best Lap Time and Total Distance',
      code: `local Players = game:GetService("Players")

local function onPlayerAdded(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local speed = Instance.new("IntValue")
    speed.Name = "Speed"
    speed.Value = 32
    speed.Parent = leaderstats

    local wins = Instance.new("IntValue")
    wins.Name = "Wins"
    wins.Value = 0
    wins.Parent = leaderstats
end

Players.PlayerAdded:Connect(onPlayerAdded)
`,
    },
  ];

  const lighting: RobloxLighting = {
    clockTime: 21.0,
    brightness: 1.8,
    ambient: '#1a1033',
    outdoorAmbient: '#4c1d95',
    fogEnd: 400,
    fogColor: '#0f051d',
    technology: 'ShadowMap',
    exposureCompensation: 0.2,
    sunRays: true,
    bloom: true,
    colorCorrection: {
      brightness: 0.05,
      contrast: 0.3,
      saturation: 0.4,
      tintColor: '#fdf2f8',
    },
  };

  return {
    id,
    prompt,
    title,
    description: `A blistering high-speed sprint track filled with neon booster pads, cyber guardrails, and timed finish line telemetry.`,
    genre: 'racing',
    version: '1.0.0',
    author: 'BloxCraft AI Studio',
    createdAt: date,
    gameplay: {
      walkSpeed: 32,
      jumpPower: 55,
      maxHealth: 100,
      respawnTime: 2,
      cameraMode: 'Follow',
      gravity: 196.2,
      currencyName: 'Wins',
      objective: 'Hit every boost pad, maintain maximum speed, and cross the neon finish line in record time!',
      difficulty: 'Medium',
    },
    lighting,
    parts,
    scripts,
    stats: {
      totalParts: parts.length,
      totalStagesOrZones: 5,
      estimatedPlayTimeMinutes: 10,
      recommendedPlayers: '1 - 12 Players',
    },
    features: [
      '280-stud neon sprint track with glowing perimeter rails',
      'Dynamic multi-stage speed boost launchers',
      'Finish line telemetry with celebration banner',
      'High-velocity camera follow perspective',
    ],
  };
}
