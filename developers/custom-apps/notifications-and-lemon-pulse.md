---
title: "Notifications & Lemon Pulse"
parent: Custom Apps
grand_parent: Developers
nav_order: 5
description: "Push notifications, Lemon Pulse activities and app badges for FiveM phone apps on GFX Phone."
---
# Notifications, Lemon Pulse and Badges for FiveM Phone Apps

Custom apps on [GFX Phone](https://gfxscripts.com/phone) get the same notification system and Lemon
Pulse as the phone's own apps.

## Push notifications

Permission: `notifications`.

```js
GFXPhone.notify({
  title: 'Order ready',
  body: 'Pick it up at the counter.',
  id: 'order-42',          // same id replaces the earlier notification
  group: 'orders',         // notifications of one group stack together
  image: 'https://...',    // optional picture (https or your own files)
  data: { orderId: 42 },   // back as the `intent` when the player taps it
})
```

From Lua: `exports['gfx-phone']:SendCustomAppNotification('myapp', { title, body, data })` (client) or
`SendCustomAppNotification(src, 'myapp', n)` (server).

Notifications follow the player's settings: Settings > your app > Notifications, Do Not Disturb, the
lock screen's privacy. Tapping one opens your app; the page gets the `intent` event with your `data`:

```js
GFXPhone.on('intent', (data) => {
  if (data.orderId) showOrder(data.orderId)
})
```

## Lemon Pulse activities

**Lemon Pulse** is the live area around the camera at the top of the GFX Phone screen: it grows to
show what is going on right now - a call, a timer, music, a delivery - and the player can expand it.

Permission: `island`. Up to 2 activities per app.

```js
await GFXPhone.island.start('timer', {
  leading: { icon: 'app' },          // 'app' = your icon, or an image URL, and/or a short text
  trailing: '04:59',                 // short text (12), or { text, color, progress }
  title: 'Cooking',
  subtitle: 'Pasta - 5 minutes',
  progress: 0.2,                     // 0-1 bar on the expanded island
  tint: '#ff9f0a',
  buttons: [{ id: 'stop', label: 'Stop', style: 'destructive' }],
})

await GFXPhone.island.update('timer', { trailing: '03:12', progress: 0.36 })
await GFXPhone.island.end('timer')

GFXPhone.on('islandAction', ({ key, button }) => {
  if (key === 'timer' && button === 'stop') GFXPhone.island.end('timer')
})
```

Lua: `StartCustomAppIsland(id, key, activity)`, `UpdateCustomAppIsland(...)`,
`EndCustomAppIsland(id, key)`, and `onIslandAction(key, button)` in the registration.

The buttons show when the player expands the activity. Tapping the activity itself opens your app with
the intent `{ island: key }`.

## App icon badge

```js
GFXPhone.setBadge(3)   // 0 clears it
```

Lua: `SetCustomAppBadge(id, n)`.
