---
title: Requirements
parent: Server Owners
nav_order: 1
description: "What a FiveM server needs to run GFX Phone: framework (QBCore, Qbox, ESX), gfx-lib, oxmysql, a supported inventory and outbound HTTPS."
---

# Requirements

| Requirement | Notes |
|---|---|
| **Framework** | QBCore, Qbox or ESX. |
| **gfx-lib** 1.7.2 or newer | The GFX Scripts bridge (framework, inventory, item metadata, notifications, admin checks). 1.7.0 still runs the phone. |
| **Database** | `oxmysql` (or another driver gfx-lib supports). |
| **Inventory** | Any inventory gfx-lib supports. With item metadata (ox, qb / ps / lj, qs, codem, tgiann, origen, core, ak47, aty...) every phone item is its own handset and SIM cards keep their numbers; other inventories get one handset per character. |
| **Outbound HTTPS** | The game server connects out to `phone.gfxscripts.com` for the web panel and licence checks. No open port, domain or certificate is needed on your side. |
| **Fivemanage account** (recommended) | Stores the photos and videos players take. Free tier available at [fivemanage.com](https://fivemanage.com). Without it the camera cannot save photos. |
| **GIPHY key** (optional) | GIF search in Messages. |

## Supported voice resources

Calls work with **pma-voice**, **mumble-voip**, **SaltyChat** and **YaCA**. The phone picks the one
that is running (`Config.Calls.Voice = 'auto'`), and the setup wizard shows which one it found.

## Before you start

- Have the **Tebex transaction id** of your GFX Phone purchase at hand (`tbx-...`). You use it to sign
  in to the web panel or to activate the full version in game.
- Decide whether you will use the **web panel**, the **in-game panel**, or both. Both open the same
  panel; see [Installation](installation.md).

Next: [Installation](installation.md)
