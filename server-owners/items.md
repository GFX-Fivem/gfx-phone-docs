---
title: Inventory Items
parent: Server Owners
nav_order: 6
description: "GFX Phone inventory items (phone, SIM card, charger, power bank, cases) and how to add them to qb-inventory, ESX, ox_inventory, qs-inventory and others."
---

# Inventory Items

| Item (default name) | What it does | Setting |
|---|---|---|
| `phone` | The handset. With item metadata every phone item is its own phone (its own serial). | `Config.Device.PhoneItem` |
| `sim_card` | A SIM card with a phone number. Using it opens the SIM tray. | `Config.Sim.Item` |
| `phone_charger` | Charges the phone nearby. | `Config.Device` charger |
| `phone_powerbank` | Portable charging. | `Config.Device` power bank |
| `phone_waterproof_case` | Protects the phone from water. | `Config.Device` |
| `phone_case` | A protective case against cracks. | `Config.Device` |
| `lemonbuds` | Wireless earbuds for calls and music. | `Config.Device` |

The charger, power bank and cases are only needed when enabled. Item names can be changed in the
setup wizard's **Phone & SIM items** step or in **Configuration**.

## Adding the items to your inventory

| Your inventory | What to do |
|---|---|
| QBCore + qb-inventory / ps-inventory / lj-inventory | Nothing - added automatically on every start. |
| ESX with its own inventory (`items` table) | Added to the table automatically; restart the server once so ESX loads them. |
| ox_inventory (also Qbox), qs-inventory, codem, tgiann and others | These inventories only take items from their own file. The setup wizard shows a **ready-to-paste block** for your inventory's item file (for example `ox_inventory/data/items.lua`, `qs-inventory/shared/items.lua`). Paste it, restart the inventory and press **Re-check**. |

Item labels and descriptions follow your server language (`Config.Locale`).

## Item images

Item images are not shipped yet. Add `phone.png`, `sim_card.png` and so on to your inventory's image
folder, or keep the ones it already has.

## SIM tray

Using a SIM card item opens the phone with the SIM tray: the player drags the card into a slot. It is
on when `Config.Sim.TrayMinigame` is on and `Config.Sim.Slots` is 1 or 2. Set it to `false` for
"use = inserted".
