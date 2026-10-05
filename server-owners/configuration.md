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
| `Config.Calls` | Voice resource, video calls, speaker |
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
