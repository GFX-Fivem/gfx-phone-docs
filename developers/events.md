---
title: Events
parent: Developers
nav_order: 3
description: "GFX Phone events for FiveM scripts: calls and voice routing, SIM and device changes, invoices, dispatch, ID cards, housing sales and custom app payments."
---

# Events
{: .no_toc }

1. TOC
{:toc}

---

## Server events to listen to

Use `AddEventHandler` on the server.

| Event | Arguments | When |
|---|---|---|
| `gfx-phone:server:sessionChanged` | `src, { owner, accountId, deviceKey }` | The player's phone owner / account / handset changed |
| `gfx-phone:server:simChanged` | `src, list, active` | SIM cards inserted, removed or switched |
| `gfx-phone:server:deviceChanged` | `src, { battery, waterDamaged, cracks }` | Battery or damage changed |
| `gfx-phone:tally:issued` | `src, target, invoice` | An invoice was issued |
| `gfx-phone:services:callCreated` / `callAccepted` / `callClosed` / `profileSaved` | | Emergency services activity |
| `gfx-phone:idcards:shown` | `src, target, card` | `src` presented `card` to `target` |
| `gfx-phone:haven:sold` | `{ script, propertyId, price, buyer, seller?, mode }` | A property was bought through Home (route a realtor's cut from here) |
| `gfx-phone:server:customAppPayment` | `src, appId, payment` | A custom app payment was charged |

### Voice integration

For voice resources the phone does not support out of the box:

| Event | Arguments | When |
|---|---|---|
| `gfx-phone:server:callVoice` | `callId, a, b, joined` | Two parties of a call start / stop hearing each other (every pair of a conference call) |
| `gfx-phone:server:callMute` | `callId, src, muted` | A party muted / unmuted |
| `gfx-phone:server:callSpeaker` | `callId, src, on` | A party went on speaker / off |
| `gfx-phone:server:callRoute` | `callId, src, route` | Where a party hears the call: `buds`, `speaker`, `earpiece`, `off` (left the call) |

```lua
AddEventHandler('gfx-phone:server:callVoice', function(callId, a, b, joined)
    if joined then MyVoice.Link(a, b) else MyVoice.Unlink(a, b) end
end)
```

## Server events to trigger

| Event | Arguments | Does |
|---|---|---|
| `gfx-phone:server:repair` | `src` | Same as `RepairPhone(src)` |

## Client events to send from the server

| Event | Arguments | Does |
|---|---|---|
| `gfx-phone:client:files:add` | `{ id, kind = 'recording' \| 'document', name, text?, audio?, duration?, party? }` | Adds (or replaces, by id) a file in the player's Files app - e.g. a call recording made by your voice server |

```lua
TriggerClientEvent('gfx-phone:client:files:add', src, { id = 'lease-42', kind = 'document', name = 'Lease contract', text = 'Apartment 4B, 30 days.' })
```

## Client events to listen to

Use `AddEventHandler` on the client.

| Event | When |
|---|---|
| `gfx-phone:client:signalChanged` / `wifiChanged` / `effectiveSignal` / `voiceQuality` | Signal, Wi-Fi or call quality changed |
| `gfx-phone:client:batteryDead` | The battery ran out |
| `gfx-phone:client:cracked` / `waterDamaged` | The phone was damaged |
| `gfx-phone:client:customAppsReady` | Register your [custom app](custom-apps/) here |
| `gfx-phone:client:customAppState` | `id, state` - a custom app opened / came to front / went back / closed |

## Client events to trigger

| Event | Arguments | Does |
|---|---|---|
| `gfx-phone:client:openApp` | `appId, intent?` | Opens the phone straight on an app |
