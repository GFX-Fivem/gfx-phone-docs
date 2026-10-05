---
title: "Getting Started"
parent: Custom Apps
grand_parent: Developers
nav_order: 1
description: "Build your first FiveM phone app for GFX Phone: resource layout, registration, the page, your own NUI callbacks and hot reload."
---
# Getting Started with GFX Phone Custom Apps (FiveM)

This guide takes you from an empty folder to your own app on the [GFX Phone](https://gfxscripts.com/phone)
home screen. You need a FiveM server running GFX Phone (QBCore, Qbox or ESX).

## 1. Create the resource

```
my-phone-app/
├── fxmanifest.lua
├── client.lua
└── ui/
    ├── index.html
    ├── app.js
    └── icon.png
```

```lua
-- fxmanifest.lua
fx_version 'cerulean'
game 'gta5'

client_script 'client.lua'

-- The phone loads the page in its own frame: list the files, no ui_page needed.
files {
    'ui/index.html',
    'ui/app.js',
    'ui/icon.png',
}

dependency 'gfx-phone'
```

## 2. Register the app

Register in `gfx-phone:client:customAppsReady`. It fires once the phone is set up on this server and
again every time `gfx-phone` restarts, so your app always comes back.

```lua
-- client.lua
AddEventHandler('gfx-phone:client:customAppsReady', function()
    local ok, err = exports['gfx-phone']:AddCustomApp({
        id = 'myapp',                     -- a-z, 0-9, _ (unique on the server)
        label = 'My App',                 -- or { en = 'My App', de = 'Meine App' }
        ui = 'ui/index.html',             -- a file of THIS resource
        icon = 'ui/icon.png',
        defaultApp = true,                -- on every phone; false = Apps store listing
        permissions = { 'notifications' },
    })
    if not ok then print('AddCustomApp failed: ' .. tostring(err)) end
end)
```

All fields: [Registration](registration.md).

## 3. Write the page

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://cfx-nui-gfx-phone/web/build/sdk/gfx-phone-sdk.js"></script>
    <style>
      body {
        margin: 0;
        padding: 60px 18px 40px;               /* clear of the status bar and the home bar */
        background: transparent;
        color: var(--gfx-label, #000);
        font: calc(15px * var(--gfx-text-scale, 1)) system-ui, sans-serif;
      }
    </style>
  </head>
  <body>
    <h1>My App</h1>
    <button id="hi">Say hi</button>
    <script src="app.js"></script>
  </body>
</html>
```

```js
// app.js
GFXPhone.ready().then(() => {
  GFXPhone.applyTheme()
  GFXPhone.on('context', () => GFXPhone.applyTheme())

  document.getElementById('hi').onclick = () =>
    GFXPhone.notify({ title: 'My App', body: 'Hello from a custom app!' })
})
```

`ensure my-phone-app` (after `gfx-phone`), open the phone and tap your icon.

## 4. Talk to your own Lua

Two ways, use either:

- **Your NUI callbacks**, exactly as in any NUI page - the frame's origin is your resource:

  ```js
  const res = await fetch(`https://${GFXPhone.resource}/buy`, { method: 'POST', body: JSON.stringify({ id: 1 }) })
  ```

- **`GFXPhone.send(action, data)`**, answered by `onMessage` in your registration:

  ```lua
  onMessage = function(action, data)
      if action == 'balance' then return { amount = 100 } end
  end,
  ```

From Lua to the page: `exports['gfx-phone']:SendCustomAppMessage('myapp', 'refresh', data)` ->
`GFXPhone.on('message', ({ action, data }) => ...)`.

## 5. Develop with hot reload

Point `ui` at your dev server and allow it on the phone:

```
set gfx-phone_dev 1
```

```lua
ui = 'http://localhost:5173/',
```

A dev server URL is refused while `gfx-phone_dev` is off, so it can never be left on in production
by accident.

## Screen, sizes and lifetime

- The phone screen is **384 x 832** CSS pixels. Keep content clear of the status bar / Lemon Pulse
  (54 px, `ctx.device.safeTop`) and the home indicator (34 px, `ctx.device.safeBottom`).
- Keep your page background transparent (or your own colour): `ground` in the registration shows
  under it while it loads.
- The page is unloaded when the player puts the phone away and loaded again when they reopen it -
  like a suspended phone app. Keep state in `GFXPhone.state`, your NUI callbacks or your server.
- FiveM's browser is Chromium 103: no `:has()`, no `color-mix()`, no container queries.

Next: [SDK reference](sdk-reference.md) · [Widgets](widgets.md) · [Payments](payments.md)
