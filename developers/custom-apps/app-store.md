---
title: "Apps Store Listing"
parent: Custom Apps
grand_parent: Developers
nav_order: 8
description: "List and sell your custom app in the GFX Phone Apps store."
---
# Listing Your App in the GFX Phone Apps Store

Instead of putting your app on every home screen, you can list it in the phone's Apps store: players
find it, tap **GET** (or buy it) and can delete it later.

```lua
exports['gfx-phone']:AddCustomApp({
    id = 'pocketnotes',
    label = 'Pocket Notes',
    subtitle = 'Notes that follow you',
    description = 'Quick notes, checklists and reminders.',
    developer = 'Example Studio',
    version = '1.2.0',
    ageRating = '4+',
    category = 'utility',               -- social, utility, finance, media, game
    ui = 'ui/index.html',
    icon = 'ui/icon.png',
    defaultApp = false,                 -- = Apps store listing
    price = 4.99,                       -- server registration only
})
```

- **Free listing:** register with `defaultApp = false` (client or server).
- **Paid listing:** register on the server with a `price`. The server owner can override it in
  `Config.AppStore.Prices` / `Subscriptions` (admin panel > Apps store) - the config wins.
- Buying goes through the same Lemon Pay sheet as the built-in apps; ownership, redownloads,
  downloads and star ratings work the same way.
- An app registered only on the client is listed free and its downloads are not counted.

`subtitle` and `description` can be given per language: `{ en = '...', de = '...' }`.
