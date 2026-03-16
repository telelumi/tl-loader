normale website JS Sachen hier
------------------------------
const tl_payload = `
-- LUA CODE START
print("QuickActions loaded")

-- dein ganzes QuickActions Script hier
-- ══════════════════════════════════════════════════════
--  TL QUICKACTIONS BAR  (external module)
--  Geladen via loadstring(game:HttpGet(...))
--  Benötigt: getgenv() mit ScreenGui, tw, Players, LocalPlayer, FW_W, getNearestPlayer
-- ══════════════════════════════════════════════════════

-- Outer-scope vars aus getgenv holen
local ScreenGui         = getgenv()._TL_ScreenGui
local tw                = getgenv()._TL_tw
local Players           = game:GetService("Players")
local LocalPlayer       = Players.LocalPlayer
local FW_W              = getgenv()._TL_FW_W or 230
local getNearestPlayer  = getgenv()._TL_getNearestPlayer
local tlLbl             = getgenv()._TL_tlLbl
local tlArrow           = getgenv()._TL_tlArrow
local tlHitbox          = getgenv()._TL_tlHitbox
local RunService        = game:GetService("RunService")
local TweenService      = game:GetService("TweenService")
local UserInputService  = game:GetService("UserInputService")

-- QA upvalues (exportiert nach dem Laden)
local qaStatusDot, qaStatusTxt

-- ══════════════════════════════════════════════════════
--  TL QUICKACTIONS  (style: qa_style_1_dark_glass)
-- ══════════════════════════════════════════════════════

-- ── Palette (1:1 aus HTML) ────────────────────────────
local P = {
    panel    = Color3.fromRGB( 12, 13, 20),   -- #0c0d14
    hdr      = Color3.fromRGB( 14, 15, 26),   -- #0e0f1a
    hdrBrd   = Color3.fromRGB( 60, 70,130),   -- rgba(60,70,130,.25)
    panelBrd = Color3.fromRGB( 70, 85,160),   -- rgba(70,85,160,.3)
    icoBox   = Color3.fromRGB(100,120,255),   -- rgba(100,120,255,.1)
    title    = Color3.fromRGB(200,204,235),   -- #c8cceb
    tgtBg    = Color3.fromRGB( 12, 14, 24),   -- rgba(12,14,24,.9)
    tgtBrd   = Color3.fromRGB( 45, 55,100),   -- rgba(45,55,100,.7)
    tgtTxt   = Color3.fromRGB( 96,112,154),   -- #60709a
    tgtDot   = Color3.fromRGB( 62,201,143),   -- #3ec98f
    card     = Color3.fromRGB( 19, 21, 34),   -- #131522
    cardHov  = Color3.fromRGB( 24, 26, 42),   -- #181a2a
    cardBrd  = Color3.fromRGB( 48, 56,105),   -- rgba(48,56,105,.5)
    cardBrdH = Color3.fromRGB(100,120,200),   -- rgba(100,120,200,.5)
    lblOff   = Color3.fromRGB( 96,112,154),   -- #60709a
    lblOn    = Color3.fromRGB(208,216,248),   -- #d0d8f8
    foot     = Color3.fromRGB( 13, 14, 24),   -- #0d0e18
    footBrd  = Color3.fromRGB( 38, 46, 85),   -- rgba(38,46,85,.8)
    stopBg   = Color3.fromRGB( 35, 10, 12),   -- rgba(35,10,12,.9)
    stopBrd  = Color3.fromRGB(180, 45, 45),   -- rgba(180,45,45,.4)
    stopTxt  = Color3.fromRGB(224, 72, 72),   -- #e04848
    badge    = Color3.fromRGB( 18, 20, 32),   -- rgba(18,20,32,.9)
    badgeTxt = Color3.fromRGB( 80, 96,122),   -- #50607a
}

-- ── Layout ────────────────────────────────────────────
local QA_W      = FW_W          -- panel width = statusbar width
local QA_PAD    = 10            -- .body padding / .foot margin
local QA_COLS   = 3
local QA_GAP    = 5             -- .grid gap
local QA_CW     = math.floor((QA_W - QA_PAD*2 - QA_GAP*2) / QA_COLS)
local QA_CH     = 72            -- card height (9+16+5+12+7+padding ~ 72px)
local HDR_H     = 38            -- .hdr height
local SEC_H     = 20            -- .sec-lbl row
local FOOT_H    = 30            -- .foot height
local SCROLL_MAX= 320

-- ── Action categories ─────────────────────────────────
local QA_CATS = {
    {
        label="Freaky", col=Color3.fromRGB(255, 80,144),
        actions={
            { key="bang",        label="Bang V2",     imageId="rbxassetid://72579312094126"  },
            { key="kiss",        label="Kiss",         imageId="rbxassetid://72579312094126"  },
            { key="licking",     label="Licking",      imageId="rbxassetid://72579312094126"  },
            { key="sucking",     label="Sucking",      imageId="rbxassetid://72579312094126"  },
            { key="suckit",      label="Suck It",      imageId="rbxassetid://72579312094126"  },
            { key="backshots",   label="Backshots",    imageId="rbxassetid://72579312094126"  },
            { key="layfuck",     label="Lay Fuck",     imageId="rbxassetid://72579312094126"  },
            { key="pussyspread", label="Pspread",      imageId="rbxassetid://72514560737644"  },
        }
    },
    {
        label="Annoying", col=Color3.fromRGB( 55,195,255),
        actions={
            { key="orbit",      label="Orbit TP",    imageId="rbxassetid://77458828386203"  },
            { key="spinning",   label="Spinning",     imageId="rbxassetid://77458828386203"  },
            { key="upsidedown", label="Upside Down", imageId="rbxassetid://77458828386203"  },
            { key="crossud",    label="Cross UD",    imageId="rbxassetid://77458828386203"  },
            { key="ghost",      label="Ghost",        imageId="rbxassetid://106434334096506" },

        }
    },
    {
        label="Roleplay", col=Color3.fromRGB(255,175, 55),
        actions={
            { key="soh",         label="On Head",    imageId="rbxassetid://86857269527024"  },
            { key="piggyback",   label="Piggyback",  imageId="rbxassetid://119518980113353" },
            { key="piggyback2",  label="Piggyback2", imageId="rbxassetid://119518980113353" },
            { key="backpack",    label="Backpack",   imageId="rbxassetid://135716031985311" },
            { key="friend",      label="Friend",     imageId="rbxassetid://79735988088948"  },
            { key="hug",         label="Hug",        imageId="rbxassetid://86857269527024"  },
            { key="hug2",        label="Hug 2",      imageId="rbxassetid://86857269527024"  },
            { key="carry",       label="Carry",      imageId="rbxassetid://86857269527024"  },
            { key="shouldersit", label="Shouldersit",imageId="rbxassetid://86857269527024"  },
        }
    },
    {
        label="ByteBreaker", col=Color3.fromRGB( 88,101,242),
        actions={
            { key="bb_attach",    label="BB Backshots", imageId="rbxassetid://72579312094126"  },
            { key="bb_orbit",     label="BB Orbit",     imageId="rbxassetid://77458828386203"  },
            { key="bb_copy",      label="BB Copy",      imageId="rbxassetid://106434334096506" },
            { key="bb_piggyback", label="BB Piggyback", imageId="rbxassetid://119518980113353" },
            { key="bb_piggyback2",label="BB Piggy 2",   imageId="rbxassetid://119518980113353" },
            { key="bb_carry",     label="BB Carry",     imageId="rbxassetid://86857269527024"  },
            { key="bb_carry2",    label="BB Carry 2",   imageId="rbxassetid://86857269527024"  },
            { key="bb_hug",       label="BB Hug",       imageId="rbxassetid://86857269527024"  },
            { key="bb_hug2",      label="BB Hug 2",     imageId="rbxassetid://86857269527024"  },
            { key="bb_layfuck",   label="BB LayFuck",   imageId="rbxassetid://72579312094126"  },
            { key="bb_licking",   label="BB Licking",   imageId="rbxassetid://72579312094126"  },
            { key="bb_bangv2",    label="BB BangV2",    imageId="rbxassetid://72579312094126"  },
            { key="bb_behind",    label="BB Behind",    imageId="rbxassetid://72579312094126"  },

            { key="bb_headsit",   label="BB Headsit",   imageId="rbxassetid://86857269527024"  },
            { key="bb_backforth", label="BB Backforth", imageId="rbxassetid://77458828386203"  },
        }
    },
}

-- flat list for cardRefs
local QA_ACTIONS = {}
for _, cat in ipairs(QA_CATS) do
    for _, a in ipairs(cat.actions) do
        a.catCol = cat.col; QA_ACTIONS[#QA_ACTIONS+1] = a
    end
end

-- ── State ─────────────────────────────────────────────
local qaBarOpen      = false
local qaActiveKey    = nil
local qaActiveTarget = nil
local qaCardRefs     = {}

-- ── Nearest player ────────────────────────────────────
function getNearestPlayer()
    local myRoot = getRootPart(); if not myRoot then return nil end
    local best, bestDist = nil, math.huge
    for _, pl in ipairs(Players:GetPlayers()) do
        if pl ~= LocalPlayer and pl.Character then
            local hrp = pl.Character:FindFirstChild("HumanoidRootPart")
            if hrp then
                local d = (hrp.Position - myRoot.Position).Magnitude
                if d < bestDist then bestDist = d; best = pl end
            end
        end
    end
    return best
end

-- ── Stop / Activate ───────────────────────────────────
local function stopQAAction()
    if _G.TLActionsStop then pcall(_G.TLActionsStop)
    elseif _G.TLActions  then pcall(function() _G.TLActions.stopAll() end) end
    pcall(function()
        if _act_following        then _act_stopFollow();   _act_following        = false end
        if _SOH and _SOH.active  then stopSitOnHead();     _SOH.active           = false end
        if ppActive              then stopPiggyback();      ppActive              = false end
        if _AF.pp2Active         then stopPiggyback2();     _AF.pp2Active         = false end
        if _AF.kissActive        then stopKiss();           _AF.kissActive        = false end
        if _AF.backpackActive    then stopBackpack();       _AF.backpackActive    = false end
        if _AF.orbitActive       then stopOrbit();          _AF.orbitActive       = false end
        if _AF.upsideDownActive  then stopUpsideDown();     _AF.upsideDownActive  = false end
        if _AF.crossUDActive     then stopCrossUD();        _AF.crossUDActive     = false end
        if _AF.friendActive      then stopFriend();         _AF.friendActive      = false end
        if _AF.spinningActive    then stopSpinning();       _AF.spinningActive    = false end
        if _AF.lickingActive     then stopLicking();        _AF.lickingActive     = false end
        if _AF.suckingActive     then stopSucking();        _AF.suckingActive     = false end
        if _AF.suckItActive      then stopSuckIt();         _AF.suckItActive      = false end
        if _AF.backshotsActive   then stopBackshots();      _AF.backshotsActive   = false end
        if _AF.layFuckActive     then stopLayFuck();        _AF.layFuckActive     = false end
        if _AF.facefuckActive    then stopFacefuck();       _AF.facefuckActive    = false end
        if _AF.pussySpreadActive then stopPussySpread();    _AF.pussySpreadActive = false end
        if _AF.hugActive         then stopHug();            _AF.hugActive         = false end
        if _AF.hug2Active        then stopHug2();           _AF.hug2Active        = false end
        if _AF.carryActive       then stopCarry();          _AF.carryActive       = false end
        if _AF.shoulderSitActive then stopShoulderSit();    _AF.shoulderSitActive = false end
        if _AF.bbActive          then stopBB();             _AF.bbActive          = false end
        if _AF.ghostActive       then stopGhost();          _AF.ghostActive       = false end
        pcall(safeStand)
    end)
    qaActiveKey = nil; qaActiveTarget = nil
end

local function activateQAAction(key)
    local target = getNearestPlayer()
    if not target then sendNotif("QuickActions","Kein Spieler in der Nähe!",2); return false end
    stopQAAction()
    qaActiveKey = key; qaActiveTarget = target
    task.spawn(function()
        task.wait(0.05)
        if key:sub(1,3)=="bb_" then startBB(target,key)
        elseif _G.TLActions    then _G.TLActions.start(key,target) end
    end)
    return true
end

-- ── Helper: mk functions ──────────────────────────────
local function mkF(parent, sz, pos, col, alpha, r)
    local f = Instance.new("Frame", parent)
    f.Size=sz; f.Position=pos; f.BackgroundColor3=col
    f.BackgroundTransparency=alpha; f.BorderSizePixel=0
    if r then local c=Instance.new("UICorner",f); c.CornerRadius=UDim.new(0,r) end
    return f
end
local function mkTxt(parent, sz, pos, text, font, tsz, col, xAlign)
    local l=Instance.new("TextLabel",parent)
    l.Size=sz; l.Position=pos; l.BackgroundTransparency=1; l.Text=text
    l.Font=font; l.TextSize=tsz; l.TextColor3=col
    l.TextXAlignment=xAlign or Enum.TextXAlignment.Left
    l.TextTruncate=Enum.TextTruncate.AtEnd
    return l
end
local function mkStroke(parent, thick, col, alpha)
    local s=Instance.new("UIStroke",parent)
    s.Thickness=thick; s.Color=col; s.Transparency=alpha
    s.ApplyStrokeMode=Enum.ApplyStrokeMode.Border; return s
end

-- ── .panel ────────────────────────────────────────────
local qaBar = mkF(ScreenGui,
    UDim2.new(0,QA_W,0,0),
    UDim2.new(1,FW_X_OFFSET,0.5,-400+FW_H),
    P.panel, 0, 14)
qaBar.Name="TLQuickActionsBar"
qaBar.AnchorPoint=Vector2.new(1,0)
qaBar.ClipsDescendants=true
qaBar.Visible=false; qaBar.ZIndex=9
mkStroke(qaBar, 1, P.panelBrd, 0.7)

-- ── .hdr ─────────────────────────────────────────────
local hdr = mkF(qaBar, UDim2.new(1,0,0,HDR_H), UDim2.new(0,0,0,0), P.hdr, 0, 14)
hdr.ZIndex=10
-- square off bottom corners of hdr
mkF(hdr, UDim2.new(1,0,0,14), UDim2.new(0,0,1,-14), P.hdr, 0, 0)
-- bottom border (.hdr border-bottom)
mkF(qaBar, UDim2.new(1,0,0,1), UDim2.new(0,0,0,HDR_H), P.hdrBrd, 0.75, 0).ZIndex=9

-- .hdr-ico (24×24, border-radius:6)
local icoBox = mkF(hdr, UDim2.new(0,24,0,24), UDim2.new(0,8,0.5,-12), P.icoBox, 0.9, 6)
mkStroke(icoBox, 1, P.icoBox, 0.8)
local icoLbl = mkTxt(icoBox, UDim2.new(1,0,1,0), UDim2.new(0,0,0,0),
    "▶", Enum.Font.GothamBold, 9, P.icoBox, Enum.TextXAlignment.Center)
icoLbl.ZIndex=12

-- .hdr-title
local titleLbl = mkTxt(hdr, UDim2.new(0,110,0,14), UDim2.new(0,38,0.5,-7),
    "Quick Actions", Enum.Font.GothamBold, 11, P.title)
titleLbl.ZIndex=12; titleLbl.TextXAlignment=Enum.TextXAlignment.Left

-- .tgt badge (right side)
local tgtBadge = mkF(hdr, UDim2.new(0,90,0,18), UDim2.new(1,-98,0.5,-9), P.tgtBg, 0.1, 20)
mkStroke(tgtBadge, 1, P.tgtBrd, 0.3); tgtBadge.ZIndex=11
local tgtDot = mkF(tgtBadge, UDim2.new(0,5,0,5), UDim2.new(0,6,0.5,-2), P.tgtDot, 0, 99)
tgtDot.ZIndex=13
local tgtNameLbl = mkTxt(tgtBadge, UDim2.new(1,-16,1,0), UDim2.new(0,14,0,0),
    "–", Enum.Font.Gotham, 8, P.tgtTxt, Enum.TextXAlignment.Left)
tgtNameLbl.ZIndex=12
-- tgt-dot pulse
task.spawn(function()
    while qaBar and qaBar.Parent do
        tw(tgtDot,0.8,{BackgroundTransparency=0.6}):Play(); task.wait(0.85)
        tw(tgtDot,0.8,{BackgroundTransparency=0}):Play();   task.wait(0.85)
    end
end)

-- ── .body (ScrollingFrame) ────────────────────────────
local BODY_TOP = HDR_H + 1
local INNER_W  = QA_W - QA_PAD*2

local qaScroll = Instance.new("ScrollingFrame", qaBar)
qaScroll.Position               = UDim2.new(0, QA_PAD, 0, BODY_TOP + QA_PAD)
qaScroll.BackgroundTransparency = 1; qaScroll.BorderSizePixel = 0
qaScroll.ScrollBarThickness     = 2
qaScroll.ScrollBarImageColor3   = P.panelBrd
qaScroll.ScrollBarImageTransparency = 0.5
qaScroll.ScrollingDirection     = Enum.ScrollingDirection.Y
qaScroll.CanvasSize             = UDim2.new(0,0,0,0)
qaScroll.ElasticBehavior        = Enum.ElasticBehavior.Never
qaScroll.ClipsDescendants       = true; qaScroll.ZIndex = 10

-- ── Card reset helper ─────────────────────────────────
local function resetAllCards()
    for _, r in ipairs(qaCardRefs) do pcall(function()
        tw(r.bg,  .12, {BackgroundColor3=P.card, BackgroundTransparency=0}):Play()
        tw(r.lbl, .12, {TextColor3=P.lblOff}):Play()
        tw(r.bar, .12, {BackgroundTransparency=1}):Play()
        r.stroke.Color=P.cardBrd; r.stroke.Transparency=0.5
    end) end
end

-- ── Build categories + cards ──────────────────────────
local curY = 0

for _, cat in ipairs(QA_CATS) do
    if curY > 0 then curY = curY + 4 end

    -- .sec-lbl row
    local secRow = mkF(qaScroll, UDim2.new(0,INNER_W,0,SEC_H),
        UDim2.new(0,0,0,curY), P.panel, 1, 0)
    secRow.ZIndex=11
    -- .sec-bar (3px pill)
    local secBar = mkF(secRow, UDim2.new(0,3,0,11), UDim2.new(0,0,0.5,-5), cat.col, 0.3, 99)
    secBar.ZIndex=12
    -- .sec-name
    local secName = mkTxt(secRow, UDim2.new(1,-36,1,0), UDim2.new(0,8,0,0),
        cat.label:upper(), Enum.Font.GothamBold, 8, cat.col)
    secName.ZIndex=12; secName.TextXAlignment=Enum.TextXAlignment.Left
    -- .lbl-badge
    local badge = mkF(secRow, UDim2.new(0,22,0,13), UDim2.new(1,-24,0.5,-6), P.badge, 0.1, 99)
    badge.ZIndex=12
    local badgeTxt = mkTxt(badge, UDim2.new(1,0,1,0), UDim2.new(0,0,0,0),
        tostring(#cat.actions), Enum.Font.GothamBold, 7, P.badgeTxt, Enum.TextXAlignment.Center)
    badgeTxt.ZIndex=13

    curY = curY + SEC_H + 5

    -- .grid cards
    local rowStartY = curY
    for ci, act in ipairs(cat.actions) do
        local col_i = (ci-1) % QA_COLS
        local row_i = math.floor((ci-1) / QA_COLS)
        local xPos  = col_i * (QA_CW + QA_GAP)
        local yPos  = rowStartY + row_i * (QA_CH + QA_GAP)

        -- .card  (#131522, border-radius:10)
        local bg = mkF(qaScroll, UDim2.new(0,QA_CW,0,QA_CH),
            UDim2.new(0,xPos,0,yPos), P.card, 0, 10)
        bg.ZIndex=11
        local stroke = mkStroke(bg, 1, P.cardBrd, 0.5)

        -- .card::after equivalent — 2px bottom bar, hidden until active
        local bar = mkF(bg, UDim2.new(0,QA_CW-12,0,2),
            UDim2.new(0,6,1,-2), cat.col, 1, 99)
        bar.ZIndex=13

        -- icon (30x30, full white, clearly visible)
        local icoL
        if act.imageId then
            icoL = Instance.new("ImageLabel", bg)
            icoL.Size=UDim2.new(0,30,0,30); icoL.Position=UDim2.new(0.5,-15,0,8)
            icoL.BackgroundTransparency=1; icoL.Image=act.imageId
            icoL.ImageColor3=Color3.new(1,1,1); icoL.ImageTransparency=0
            icoL.ScaleType=Enum.ScaleType.Fit; icoL.ZIndex=12
        else
            icoL = mkTxt(bg, UDim2.new(1,0,0,30), UDim2.new(0,0,0,8),
                act.icon, Enum.Font.GothamBold, 20, Color3.new(1,1,1), Enum.TextXAlignment.Center)
            icoL.ZIndex=12
        end

        -- label (9px GothamBlack, bright)
        local lbl = mkTxt(bg, UDim2.new(1,-2,0,12), UDim2.new(0,1,1,-14),
            act.label, Enum.Font.GothamBlack, 9, Color3.fromRGB(200,205,230), Enum.TextXAlignment.Center)
        lbl.ZIndex=12

        -- invisible hit button
        local btn = Instance.new("TextButton", bg)
        btn.Size=UDim2.new(1,0,1,0); btn.BackgroundTransparency=1
        btn.Text=""; btn.ZIndex=15; btn.Active=true

        local ci2 = #qaCardRefs+1
        qaCardRefs[ci2] = {bg=bg, lbl=lbl, bar=bar, stroke=stroke, key=act.key, col=cat.col}

        -- hover (.card:hover)
        btn.MouseEnter:Connect(function()
            if qaActiveKey==act.key then return end
            tw(bg, .1, {BackgroundColor3=P.cardHov}):Play()
            stroke.Color=P.cardBrdH; stroke.Transparency=0.5
        end)
        btn.MouseLeave:Connect(function()
            if qaActiveKey==act.key then return end
            tw(bg, .1, {BackgroundColor3=P.card}):Play()
            stroke.Color=P.cardBrd; stroke.Transparency=0.5
        end)

        -- click (.card.on)
        btn.MouseButton1Click:Connect(function()
            local wasActive = (qaActiveKey==act.key)
            resetAllCards()
            if wasActive then
                stopQAAction()
                if qaStatusTxt then qaStatusTxt.Text="Stopped"; qaStatusTxt.TextColor3=P.tgtTxt end
                if qaStatusDot then qaStatusDot.BackgroundColor3=P.tgtTxt end
            else
                local ok = activateQAAction(act.key)
                if ok ~= false then
                    -- .card.on styles
                    tw(bg,  .12, {BackgroundColor3=P.cardHov}):Play()
                    tw(lbl, .12, {TextColor3=P.lblOn}):Play()
                    tw(bar, .12, {BackgroundTransparency=0}):Play()
                    stroke.Color=cat.col; stroke.Transparency=0.6
                    task.spawn(function()
                        task.wait(0.2); pcall(function()
                            local tgt=qaActiveTarget
                            if qaStatusTxt then
                                qaStatusTxt.Text=act.label..(tgt and(" · "..tgt.Name)or"")
                                qaStatusTxt.TextColor3=cat.col
                            end
                            if qaStatusDot then qaStatusDot.BackgroundColor3=cat.col end
                        end)
                    end)
                else
                    if qaStatusTxt then qaStatusTxt.Text="⚠ Kein Ziel"; qaStatusTxt.TextColor3=P.stopTxt end
                    if qaStatusDot then qaStatusDot.BackgroundColor3=P.stopTxt end
                end
            end
        end)

        -- sucking: pause anim while held
        if act.key == "sucking" then
            btn.MouseButton1Down:Connect(function()
                if qaActiveKey=="sucking" and _AF and _AF.suckingActive then
                    pcall(function() if _G._TLSuckingTrack then _G._TLSuckingTrack:AdjustSpeed(0) end end)
                end
            end)
            btn.MouseButton1Up:Connect(function()
                if qaActiveKey=="sucking" and _AF and _AF.suckingActive then
                    pcall(function() if _G._TLSuckingTrack then _G._TLSuckingTrack:AdjustSpeed(1) end end)
                end
            end)
        end
    end

    local rows = math.ceil(#cat.actions / QA_COLS)
    curY = rowStartY + rows*(QA_CH+QA_GAP) + 6   -- .grid margin-bottom:10
end

-- finalise scroll
local TOTAL_H  = curY
local SCROLL_H = math.min(TOTAL_H, SCROLL_MAX)
qaScroll.Size       = UDim2.new(0, INNER_W, 0, SCROLL_H)
qaScroll.CanvasSize = UDim2.new(0, 0, 0, TOTAL_H)

-- ── .foot ─────────────────────────────────────────────
local FOOT_Y   = BODY_TOP + QA_PAD + SCROLL_H + 4
local FULL_H   = FOOT_Y + FOOT_H + QA_PAD

local foot = mkF(qaBar, UDim2.new(0,INNER_W,0,FOOT_H),
    UDim2.new(0,QA_PAD,0,FOOT_Y), P.foot, 0, 8)
foot.ZIndex=10; mkStroke(foot, 1, P.footBrd, 0.2)

-- .s-dot
qaStatusDot = mkF(foot, UDim2.new(0,5,0,5), UDim2.new(0,9,0.5,-2), P.tgtTxt, 0, 99)
qaStatusDot.ZIndex=12
task.spawn(function()
    while foot and foot.Parent do
        tw(qaStatusDot,0.7,{BackgroundTransparency=0.6}):Play(); task.wait(0.75)
        tw(qaStatusDot,0.7,{BackgroundTransparency=0}):Play();   task.wait(0.75)
    end
end)

-- .s-txt
qaStatusTxt = mkTxt(foot, UDim2.new(1,-58,1,0), UDim2.new(0,20,0,0),
    "Idle · Select an action", Enum.Font.Gotham, 8, P.tgtTxt)
qaStatusTxt.ZIndex=12

-- .stop-b
local stopBtn = Instance.new("TextButton", foot)
stopBtn.Size=UDim2.new(0,38,0,20); stopBtn.Position=UDim2.new(1,-42,0.5,-10)
stopBtn.BackgroundColor3=P.stopBg; stopBtn.BackgroundTransparency=0.1
stopBtn.BorderSizePixel=0; stopBtn.Text="STOP"
stopBtn.Font=Enum.Font.GothamBlack; stopBtn.TextSize=7
stopBtn.TextColor3=P.stopTxt; stopBtn.ZIndex=13; stopBtn.Active=true
do local c=Instance.new("UICorner",stopBtn); c.CornerRadius=UDim.new(0,5) end
mkStroke(stopBtn, 1, P.stopBrd, 0.6)
stopBtn.MouseEnter:Connect(function()
    tw(stopBtn,.1,{BackgroundColor3=Color3.fromRGB(55,14,18)}):Play()
end)
stopBtn.MouseLeave:Connect(function()
    tw(stopBtn,.1,{BackgroundColor3=P.stopBg}):Play()
end)
stopBtn.MouseButton1Click:Connect(function()
    resetAllCards(); stopQAAction()
    if qaStatusTxt then qaStatusTxt.Text="Stopped"; qaStatusTxt.TextColor3=P.tgtTxt end
    if qaStatusDot then qaStatusDot.BackgroundColor3=P.tgtTxt end
end)

-- ── Open / Close ──────────────────────────────────────
local qaBarTween = nil

local function openQABar()
    if qaBarTween then pcall(function() qaBarTween:Cancel() end); qaBarTween=nil end
    local np = getNearestPlayer()
    tgtNameLbl.Text = np and np.Name or "–"
    tgtDot.BackgroundColor3 = np and P.tgtDot or P.tgtTxt
    qaBarOpen=true; qaBar.Visible=true
    qaBar.Size=UDim2.new(0,QA_W,0,0)
    qaBarTween=tw(qaBar,.28,{Size=UDim2.new(0,QA_W,0,FULL_H)},
        Enum.EasingStyle.Quart,Enum.EasingDirection.Out)
    qaBarTween:Play()
    tlArrow.Text="▼"
end

local function closeQABar()
    if qaBarTween then pcall(function() qaBarTween:Cancel() end); qaBarTween=nil end
    qaBarOpen=false; tlArrow.Text="▶"
    qaBarTween=tw(qaBar,.2,{Size=UDim2.new(0,QA_W,0,0)},
        Enum.EasingStyle.Quart,Enum.EasingDirection.In)
    qaBarTween:Play()
    qaBarTween.Completed:Connect(function()
        if not qaBarOpen then qaBar.Visible=false end
    end)
end

tlHitbox.MouseButton1Click:Connect(function()
    if qaBarOpen then closeQABar() else openQABar() end
end)
tlHitbox.MouseEnter:Connect(function()
    tw(tlLbl,  .1,{ImageTransparency=0.3}):Play()
    tw(tlArrow,.1,{TextTransparency =0.3}):Play()
end)
tlHitbox.MouseLeave:Connect(function()
    tw(tlLbl,  .1,{ImageTransparency=0}):Play()
    tw(tlArrow,.1,{TextTransparency =0}):Play()
end)

tlArrow.Text="▶"

-- LUA CODE END
`;