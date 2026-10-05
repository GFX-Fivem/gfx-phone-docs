---
title: "Security"
parent: Custom Apps
grand_parent: Developers
nav_order: 9
description: "How GFX Phone sandboxes custom apps: iframe sandbox, bridge checks, player consent and server-side money."
---
# Security Model of GFX Phone Custom Apps

Custom apps run other resources' code on the player's phone, so [GFX Phone](https://gfxscripts.com/phone)
treats every app page as untrusted.

## The sandbox

- The page runs in an iframe with `sandbox="allow-scripts allow-same-origin allow-forms"`: no pop-ups,
  no top-level navigation.
- Its origin is `https://cfx-nui-<your resource>` - a different origin from the phone. It can not read
  the phone's page, storage or other apps.
- The page must belong to the resource that registered it. Another resource's page is refused when
  registering (in Lua) and again by the phone. A dev server URL needs `set gfx-phone_dev 1`.

## The bridge

- The phone ignores NUI-style messages coming from any frame, so a page can not impersonate the game.
- The SDK bridge only answers its own frame, only from its exact origin, and only replies to that
  origin (never `*`).
- Every request is checked in order: the method exists, the app has the permission, the app is on
  screen (for sheets), rate limits (per frame and per method), 64 KB size limit. Text is clipped and
  never rendered as HTML; images only from https or the app's own files.

## Player consent

Camera, photos, passcode, passwords, payments, location, contacts, calls and sharing all open a sheet
the phone draws. The page can not see it or tap it; only the player answers. Location is asked once
per app and can be changed in Settings.

## Money

- Payments are charged on the server with the framework's bank account.
- The payment NUI callback needs a key only the phone's own page knows, so a frame calling the phone's
  callbacks directly is refused.
- Free amounts are capped by the server owner (`MaxPayment`); server-created payments are bound to one
  player and expire.
- `onPayment` returning `false` refunds at once.

## Server owner controls

- Admin panel > **Custom apps**: turn every custom app off, set the largest payment.
- Admin panel > **App access**: switch a single custom app off for everyone.

## Limits

64 custom apps per server, 2 island activities and 4 widgets per app, 64 KB per request and per app
state, 30 requests a second per frame; sheets and payments have their own lower limits.
