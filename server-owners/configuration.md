---
title: Configuration
parent: Server Owners
nav_order: 8
description: "Configure GFX Phone: live settings in the admin panel and the config.lua sections (calls, messages, wallet, billing, services, garage, housing, coverage, Wi-Fi...)."
---

# Configuration

## In the admin panel (recommended)

Open **Configuration** in the [web](web-panel.md) or [in-game](in-game-panel.md) panel. Every setting
is grouped by app, described in your language and applied **live** - no restart. Panel changes are
saved in your database and win over `config.lua`.

Some useful places:

| Page / group | What you set there |
|---|---|
| App access | Switch any app off for every player (it leaves the home screen and the Apps store) |
| Apps store | One-time prices and subscriptions for apps, subscription period |
| Custom apps | Allow apps from other resources, the largest in-app payment |
| Currency | Symbol, format and decimals for every amount on the phone |
| Calls | Voice resource, speaker range, call quality |
| Ments badges | Badge requests, the badge shop, what it is paid with, prices ([details](#ments-badges)) |
| Coverage / Wi-Fi | Signal outside zones, hotspots, calls over Wi-Fi |
| Languages | Server language, add languages, change any text |

## config.lua

`config.lua` holds the defaults. It stays readable in the encrypted build so you can edit it. The main
sections:

| Section | Covers |
|---|---|
| `Config.Locale` | Server language (`en`, `tr`, `de`, `fr`, `pt`, `ar`, `nl`, `es`, `th`, `ro`, `cs`, `it`, `pl`) |
| `Config.Carrier`, `Config.NumberFormat` | Network name, how numbers are shown |
| `Config.Currency` | Money format |
| `Config.Account` | Lemon Account mode (`item` / `character`), e-mail domain |
| `Config.Device` | Phone item, battery, chargers, power bank, cases, cracks, water damage, LemonBuds |
| `Config.Sim` | SIM item, slots, SIM tray, number prefix and digits |
| `Config.Calls` | Voice resource, video calls, speaker, [special numbers](../developers/special-numbers.md) (lines a script answers) |
| `Config.Messages`, `Config.Mail`, `Config.Gif` | Messaging, mail, GIF search |
| `Config.Media` | Photo / video storage (Fivemanage) |
| `Config.Wallet`, `Config.Billing` | Lemon Pay, company accounts, billing script |
| `Config.Services` | Police / EMS / fire dispatch and calls |
| `Config.Garage`, `Config.CarKey`, `Config.Vehicles` | Garage, CarLink, vehicle keys scripts |
| `Config.Housing` | Home app and your housing script |
| `Config.Minit` | Renty car sharing |
| `Config.Taxi` | GoThere rides |
| `Config.Eatsy`, `Config.Crate` | Food delivery, shopping |
| `Config.Social`, `Config.Hush`, `Config.Spark`, `Config.Muse` | Social apps |
| `Config.JobIn`, `Config.News`, `Config.Events`, `Config.Adverts` | Jobs, news, events, adverts |
| `Config.Binix`, `Config.Critterra` | Trading, the creature game |
| `Config.IdCards` | ID card sources |
| `Config.Coverage`, `Config.Wifi` | Signal and Wi-Fi |
| `Config.Apps`, `Config.AppStore`, `Config.CustomApps` | App access, store prices, custom apps |
| `Config.Admin` | Admin groups, roles, web panel switches |

Each key is explained by the comment above it in `config.lua`.

## Ments badges

A badge shows next to a Ments username: **Verified** (the blue check), **Government**, **Press** or
**Business**. You can always give or take one in the admin panel (**Social profiles**). Players can
also get one from the menu on their own Ments profile (**Account badge**), in two ways:

- **Request** - the player picks a badge and writes why. The request waits on the panel's
  **Approvals** page. Approve it and the badge appears at once; reject it and your note is shown to
  the player.
- **Shop** - the player buys a badge at once. Only badges with a price above 0 are sold. The badge
  stays until an admin takes it away.

Set it in the panel (**Configuration > Ments badges**) or in `config.lua`:

```lua
Config.Social.Ments.Badges = {
    Requests = true,      -- players can request a badge (Approvals page)
    Shop = true,          -- players can buy a badge
    Currency = 'item',    -- 'money' | 'item' | 'export'
    Item = 'coin',        -- Currency 'item': the item spent, one per price unit
    Unit = 'Coins',       -- shown after the price ('item' / 'export')
    Export = { Resource = '', Get = '', Remove = '', Add = '' },
    Prices = { verified = 500, gov = 0, press = 1000, business = 1000 }, -- 0 = not for sale
}
```

What the shop takes (`Currency`):

| Value | Paid with |
|---|---|
| `money` | Bank money through Lemon Pay (shown on the player's statement). Prices use your [currency](#in-the-admin-panel-recommended) format |
| `item` | An inventory item such as donator coins (`Item`), taken through gfx-lib |
| `export` | The currency of another resource (a coin or points script), through its exports |

With `export`, the phone calls your script's exports by the names you set:

| Key | Called as | Must |
|---|---|---|
| `Get` | `exports[Resource]:Get(source)` | Return the player's balance |
| `Remove` | `exports[Resource]:Remove(source, amount)` | Take the amount (returning `false` = not paid) |
| `Add` | `exports[Resource]:Add(source, amount)` | Optional: give it back if the badge could not be set |

If the badge cannot be set after the player paid, the price is refunded (bank money, the item, or
your `Add` export).
