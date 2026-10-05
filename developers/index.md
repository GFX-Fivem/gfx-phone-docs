---
title: Developers
nav_order: 3
has_children: true
description: "Integrate your FiveM scripts with GFX Phone: server and client exports, events, and the custom apps SDK for building your own phone apps."
---

# GFX Phone for Developers

[GFX Phone](https://gfxscripts.com/phone) exposes a Lua API so your resources can work with the phone:
give SIM cards, look up who owns a number, send mail, create invoices and dispatch calls, push ID
cards, react to calls in your voice script, and build complete phone apps of your own.

| Guide | |
|---|---|
| [Server exports](server-exports.md) | Identity, SIM cards, calls, device, mail, bills, emergency services, ID cards, housing, apps |
| [Client exports](client-exports.md) | Signal, Wi-Fi, battery, voice quality, music |
| [Events](events.md) | Server and client events to listen to or trigger |
| [Custom apps](custom-apps/) | Your own phone app: JavaScript SDK, notifications, widgets, payments |

## Calling an export

```lua
local phone = exports['gfx-phone']
local number = phone:GetPhoneNumber(source)
```

Every export answers `nil` until the server owner has finished the
[setup wizard](../server-owners/setup-wizard.md) - the phone runs nothing before that. Check for `nil`
if your resource can start on a server where the phone is not set up yet.
