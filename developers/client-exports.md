---
title: Client Exports
parent: Developers
nav_order: 2
description: "GFX Phone client exports for FiveM: signal bars, coverage, Wi-Fi, battery, voice quality for radio filters, music headphones and custom apps."
---

# Client Exports

All exports are on `exports['gfx-phone']` and run on the **client**. They answer `nil` until the
phone's setup wizard is finished.

## Phone state

| Export | Returns |
|---|---|
| `GetSignalBars()` | 0-4 cellular bars where the player stands (`nil` before the first read) |
| `GetCoverageAt(x, y)` | 0-4 bars at a point (the coverage map drawn in the admin panel) |
| `GetWifi()` | The Wi-Fi network the phone is on, or `nil` |
| `GetEffectiveSignal()` | Bars after Wi-Fi and the device's own state (airplane mode, switched off...) |
| `GetVoiceQuality()` | 0-1 call quality - feed it to your voice script's radio filter |
| `GetBattery()` | 0-100 |
| `IsPhoneDead()` | `true` while the battery is empty |
| `SetMusicHeadphones(available, output?)` | Headphones for the Music app; `output` = `'speaker'` \| `'headphones'` |

```lua
-- A HUD showing the phone's signal and battery.
CreateThread(function()
    while true do
        local bars = exports['gfx-phone']:GetEffectiveSignal() or 0
        local battery = exports['gfx-phone']:GetBattery() or 100
        SendNUIMessage({ action = 'phoneStatus', bars = bars, battery = battery })
        Wait(2000)
    end
end)
```

## Custom apps

`AddCustomApp`, `RemoveCustomApp`, `SendCustomAppMessage`, `SendCustomAppNotification`,
`SetCustomAppBadge`, `StartCustomAppIsland`, `UpdateCustomAppIsland`, `EndCustomAppIsland`,
`UpdateCustomAppWidget`, `OpenCustomApp`, `IsCustomAppOpen` - see
[Custom app exports](custom-apps/lua-api.md).

## Opening an app

Trigger `gfx-phone:client:openApp` to open the phone straight on any app, with an optional intent:

```lua
TriggerEvent('gfx-phone:client:openApp', 'messages', { threadNumber = '5550123' })
```
