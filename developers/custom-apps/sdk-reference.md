---
title: "SDK Reference"
parent: Custom Apps
grand_parent: Developers
nav_order: 3
description: "window.GFXPhone reference: context, theme, events, every method, sheets and error codes of the GFX Phone JavaScript SDK."
---
# GFX Phone SDK Reference (`window.GFXPhone`)

The JavaScript SDK connects your custom app's page to the [GFX Phone](https://gfxscripts.com/phone).
Load it from the phone:

```html
<script src="https://cfx-nui-gfx-phone/web/build/sdk/gfx-phone-sdk.js"></script>
```

TypeScript: copy [`sdk/gfx-phone-sdk.d.ts`](https://github.com/GFX-Fivem/gfx-phone-docs/blob/main/sdk/gfx-phone-sdk.d.ts) into your project. Plain
ES2019, no dependencies.

Every call returns a Promise. A refused call rejects with an `Error` whose `code` says why.

## Start-up

| Call | Result |
|------|--------|
| `GFXPhone.ready()` | Call first. Resolves with the [context](#context). |
| `GFXPhone.getContext()` | The context again. |
| `GFXPhone.context` | The latest context (`null` before `ready()`). |
| `GFXPhone.resource` | Your resource's name, for your own NUI callbacks. |
| `GFXPhone.configure({ phoneResource })` | Only if the phone resource is not called `gfx-phone`. Before `ready()`. |

## Context

```js
{
  app: { id, name },
  active,                               // your app is the one on screen
  theme: {
    mode: 'light' | 'dark', accent, material, fontFamily, textScale, reduceMotion,
    colors: { label, labelSecondary, labelTertiary, background, groupedBackground, fill, separator, tint, blue },
  },
  locale: { language, rtl, dateLocale, currency: { symbol } },
  device: { width: 384, height: 832, safeTop: 54, safeBottom: 34, frameWidth },
  network: { online, service, wifi, wifiName, signal, airplane, noSim },
  battery: { level, charging, lowPower },
}
```

`GFXPhone.on('context', fn)` fires (at most every 250 ms) when any of it changes.

## Theme

`GFXPhone.applyTheme(el?)` (default `<html>`) sets:

- CSS variables from `theme.colors`: `--gfx-label`, `--gfx-label-secondary`, `--gfx-label-tertiary`,
  `--gfx-background`, `--gfx-grouped-background`, `--gfx-fill`, `--gfx-separator`, `--gfx-tint`, `--gfx-blue`
- `--gfx-text-scale` (multiply your font sizes by it)
- `color-scheme`, `data-theme="light|dark"`, `lang`, `dir="rtl"` for Arabic

Call it after `ready()` and on every `context` event.

## Events

| Event | Data |
|-------|------|
| `context` | the new context |
| `open` | the page is connected |
| `foreground` / `background` | your app came on screen / left it (another app, home, lock) |
| `intent` | why it opened: a notification's `data`, `{ widget }`, `{ island }`, `OpenCustomApp`'s intent |
| `message` | `{ action, data }` from `SendCustomAppMessage` |
| `islandAction` | `{ key, button }` |

`GFXPhone.on(event, fn)` returns an unsubscribe function; `GFXPhone.off(event, fn)` also works.

## Methods

| Call | Result |
|------|--------|
| `close()` | back to the home screen |
| `openApp(id)` | opens another installed app |
| `setBadge(n)` | the red count on your icon (0 clears) |
| `send(action, data)` | your client `onMessage`'s return value |
| `state.get(key)` / `state.set(key, value)` | values kept while the game runs (64 KB per app) |
| `notify({ title, body?, id?, image?, group?, data? })` | `{ id }` |
| `island.start(key, activity)` / `island.update(key, activity)` / `island.end(key)` | see [Lemon Pulse](notifications-and-lemon-pulse.md) |
| `widgets.update(widget, data)` | see [Widgets](widgets.md) |
| `network.status()` / `battery.status()` | as in the context |
| `camera.takePhoto()` | `{ url }` - the phone's Camera over your app, shot uploaded |
| `gallery.pick({ max? })` | `[{ url }]`, up to 10 |
| `auth.verifyPasscode()` | `true` when the player entered their passcode (also when they have none), `false` on Cancel |
| `passwords.save({ username, password, label? })` | `true` when saved to the Passwords app |
| `passwords.autofill()` | `{ username, password }` - one of the logins saved for your app |
| `pay({ amount, label, ref? })` / `pay({ paymentId })` | `{ id, amount, balance }` - see [Payments](payments.md) |
| `location.get()` | `{ x, y, z, street, zone }` |
| `location.setWaypoint(x, y)` | sets the map waypoint |
| `contacts.pick()` | `{ name, number }` |
| `contacts.message(number, text?)` | opens Messages with the text in the composer (the player sends it) |
| `contacts.call(number, name?)` | `true` when the player confirmed and the call started |
| `share({ text?, url?, image? })` | `true` when shared (Messages or Copy); LemonDrop to nearby phones is offered too |
| `ui.alert({ title, message?, button? })` | resolves when dismissed |
| `ui.confirm({ title, message?, confirm?, cancel?, destructive? })` | `true` / `false` |
| `ui.actionSheet({ title?, message?, options: [{ id, label, style? }] })` | chosen `id` or `null` |
| `ui.toast(text)` | a short message over your app |
| `ui.setStatusBar('dark' \| 'light' \| null)` | status bar icon colour (`null` = automatic) |

## Sheets

Camera, gallery, passcode, passwords, pay, location, contacts, call, share and the `ui.*` dialogs are
**sheets the phone draws**. They open only while your app is on screen and the phone is unlocked
(else `notActive`), one at a time (else `busy`), and close with `cancelled` when the player leaves
your app. They wait for the player (no timeout); `pay` gives up after 120 s and every other call
after 15 s.

## Error codes

| Code | When |
|------|------|
| `timeout` | no answer in time |
| `unknownMethod` | the phone does not know this call (an older phone version) |
| `unavailable` | your app is not registered / the feature is off on this server |
| `notPermitted` | the permission is missing from your registration |
| `notActive` | a sheet was asked while your app was not on screen |
| `busy` | another sheet is open |
| `rateLimited` | too many calls |
| `tooLarge` | the request is over 64 KB |
| `invalid` | bad parameters |
| `cancelled` | the player closed the sheet |
| `denied` | location refused or Location Services off |
| `notFound` | AutoFill: no login saved for your app |
| `noMoney`, `overLimit`, `refused`, `failed` | payments |

## Automatic behaviour

- **Typing:** while a text field in your page has focus, the phone keeps the keyboard, so the player
  does not walk.
- **Keys:** Escape (put the phone away) and Backspace outside a text field (back) go to the phone.
- **Zoom:** when the phone's scale does not reach into your frame (it differs between CEF builds), the
  SDK zooms your page to the phone's layout width, and again on every resize.
