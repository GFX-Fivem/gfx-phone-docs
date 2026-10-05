# GFX Phone Custom Apps SDK - Build Your Own FiveM Phone Apps

**Add your own app to [GFX Phone](https://gfxscripts.com/phone), the iOS-style phone for FiveM (QBCore, Qbox, ESX).**
Write the app as a normal web page (HTML, React, Vue, Svelte...), register it with one Lua export,
and it opens on the in-game phone with notifications, the Dynamic Island, home-screen widgets,
dark mode, the camera, Lemon Pay payments and more.

[![GFX Phone](https://img.shields.io/badge/GFX%20Phone-FiveM%20phone%20script-0a84ff)](https://gfxscripts.com/phone)
[![Live demo](https://img.shields.io/badge/Try%20it-live%20demo-34c759)](https://gfxscripts.com/phone)
[![Frameworks](https://img.shields.io/badge/QBCore%20%7C%20Qbox%20%7C%20ESX-supported-ff9f0a)](https://gfxscripts.com/phone)
[![License: MIT](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)

> This repository holds the **developer documentation, the JavaScript SDK and a complete example
> resource** for GFX Phone custom apps. The phone itself is available at
> **[gfxscripts.com/phone](https://gfxscripts.com/phone)** - try the live demo in your browser there.

---

## Contents

- [Why custom apps on GFX Phone](#why-custom-apps-on-gfx-phone)
- [Features your app can use](#features-your-app-can-use)
- [Quick start (5 minutes)](#quick-start-5-minutes)
- [Documentation](#documentation)
- [Example: Tip Jar](#example-tip-jar)
- [FAQ](#faq)
- [About GFX Phone](#about-gfx-phone)

## Why custom apps on GFX Phone

- **Any web stack.** Your app is your resource's own NUI page. Keep your build tools, your framework
  and your NUI callbacks - the phone shows the page in a sandboxed frame on its screen.
- **Native look for free.** The SDK hands your page the phone's theme (light / dark, accent colour,
  text size, language, right-to-left), so your app looks like it shipped with the phone.
- **Real phone features.** Push notifications, Dynamic Island live activities, home-screen widgets,
  camera and photo library, passcode checks, saved passwords, contacts, location and in-app payments
  are one SDK call each.
- **Secure by design.** Every sensitive step is a sheet the phone draws and the player confirms; money
  only moves on the server. See [Security](docs/security.md).
- **Free for every server.** Custom apps are part of every GFX Phone licence.

## Features your app can use

| Feature | SDK call | Permission |
|---|---|---|
| Push notifications | `GFXPhone.notify()` | `notifications` |
| Dynamic Island live activities (with buttons) | `GFXPhone.island.start()` | `island` |
| Home-screen widgets (4 templates) | `GFXPhone.widgets.update()` | - |
| Light / dark theme, accent, text size, RTL | `GFXPhone.applyTheme()` | - |
| Take a photo with the phone camera | `GFXPhone.camera.takePhoto()` | `camera` |
| Pick photos from the gallery | `GFXPhone.gallery.pick()` | `photos` |
| Verify the player's passcode | `GFXPhone.auth.verifyPasscode()` | `passcode` |
| Save / AutoFill passwords | `GFXPhone.passwords.save()` | `passwords` |
| Lemon Pay in-app payments | `GFXPhone.pay()` | `payments` |
| Player location + GPS waypoint | `GFXPhone.location.get()` | `location` |
| Pick a contact, text or call a number | `GFXPhone.contacts.pick()` | `contacts` |
| Share sheet (Messages, Copy, LemonDrop) | `GFXPhone.share()` | - |
| Signal, Wi-Fi, airplane mode, battery | `GFXPhone.network.status()` | - |
| Alerts, confirms, action sheets, toasts | `GFXPhone.ui.confirm()` | - |
| App Store listing with a price | `price` in the registration | - |

Full list: [SDK reference](docs/sdk-reference.md).

## Quick start (5 minutes)

**1. Your resource** (`fxmanifest.lua`) - list the page files, no `ui_page` needed:

```lua
fx_version 'cerulean'
game 'gta5'

client_script 'client.lua'
files { 'ui/**/*' }
dependency 'gfx-phone'
```

**2. Register the app** (`client.lua`) in the ready event, which fires once the phone is set up and
again after every phone restart:

```lua
AddEventHandler('gfx-phone:client:customAppsReady', function()
    exports['gfx-phone']:AddCustomApp({
        id = 'myapp',
        label = { en = 'My App', tr = 'Uygulamam' },
        ui = 'ui/index.html',
        icon = 'ui/icon.png',
        defaultApp = true,                       -- on every home screen
        permissions = { 'notifications', 'island', 'camera' },
        onMessage = function(action, data)       -- GFXPhone.send() from the page
            return { hello = GetPlayerName(PlayerId()) }
        end,
    })
end)
```

**3. Your page** (`ui/index.html`) - load the SDK from the phone and wait for it:

```html
<script src="https://cfx-nui-gfx-phone/web/build/sdk/gfx-phone-sdk.js"></script>
<script>
  GFXPhone.ready().then(async (ctx) => {
    GFXPhone.applyTheme()                         // phone colours as --gfx-* CSS variables
    GFXPhone.on('context', () => GFXPhone.applyTheme())
    const me = await GFXPhone.send('hello')
    GFXPhone.notify({ title: 'My App', body: `Welcome, ${me.hello}!` })
  })
</script>
```

`ensure` your resource after `gfx-phone` and open the phone - your app is on the home screen.
Step by step: [Getting started](docs/getting-started.md).

## Documentation

| Guide | What it covers |
|---|---|
| [Getting started](docs/getting-started.md) | Resource layout, registration, the first page, local development |
| [Registration](docs/registration.md) | Every `AddCustomApp` field, permissions, client vs server registration |
| [SDK reference](docs/sdk-reference.md) | `window.GFXPhone`: context, theme, events, every method and error code |
| [Lua API](docs/lua-api.md) | Client and server exports, events |
| [Notifications & Dynamic Island](docs/notifications-and-dynamic-island.md) | Push notifications, live activities, badges, intents |
| [Widgets](docs/widgets.md) | Home-screen widgets: templates, data, updates from Lua and the page |
| [Payments](docs/payments.md) | Lemon Pay: free amounts, server-created payments, refunds |
| [App Store](docs/app-store.md) | Listing your app, prices, downloads and ratings |
| [Security](docs/security.md) | The sandbox, the bridge, permissions, limits |
| [Troubleshooting](docs/troubleshooting.md) | Common problems and fixes |

TypeScript types: [`sdk/gfx-phone-sdk.d.ts`](sdk/gfx-phone-sdk.d.ts). The SDK script itself is served
by the phone (`https://cfx-nui-gfx-phone/web/build/sdk/gfx-phone-sdk.js`); a copy is in
[`sdk/`](sdk/) for reading.

## Example: Tip Jar

[`examples/tip-jar`](examples/tip-jar) is a complete resource you can drop into your server: a page
with a confirm sheet and a Lemon Pay payment, a server `onPayment` that credits the performer, a
Dynamic Island activity with a Stop button, a camera shot and a home-screen widget updated from Lua.

## FAQ

**Which frameworks are supported?**
GFX Phone runs on QBCore, Qbox and ESX. Custom apps do not depend on the framework: they talk to the
phone through the SDK and to your own resource through your NUI callbacks.

**Can I use React, Vue or Svelte?**
Yes. Build to static files, list them in `files { }` and point `ui` at your `index.html`. During
development you can even point it at your dev server (`http://localhost:5173/`) with
`set gfx-phone_dev 1`.

**Does it cost extra?**
No. Custom apps work on every GFX Phone server, free or paid licence.

**Can I sell my app inside the phone?**
Register it with `defaultApp = false` and a `price` on the server: the phone's App Store sells it
through Lemon Pay like the built-in apps. See [App Store](docs/app-store.md).

**Is my app's state kept when the phone is put away?**
The page is unloaded when the phone closes, like a real phone app being suspended. Keep state with
`GFXPhone.state`, your NUI callbacks or your server, and listen to the `open` / `foreground` events.

**Can one app break another, or the phone?**
No. Each page runs in its own sandboxed origin; the phone ignores everything from a frame except
validated SDK requests from that app's own frame.

## About GFX Phone

[GFX Phone](https://gfxscripts.com/phone) is a modern, iOS-style phone for FiveM roleplay servers:
calls and video calls, Messages, social apps, Lemon Pay banking, a vehicle and housing suite, an App
Store, Dynamic Island, widgets, 13 languages and a web admin panel. Made by
[GFX Scripts](https://gfxscripts.com).

- Product page and live demo: **[gfxscripts.com/phone](https://gfxscripts.com/phone)**
- Pricing: [gfxscripts.com/phone#pricing](https://gfxscripts.com/phone#pricing)
- Server owner portal: [phone.gfxscripts.com](https://phone.gfxscripts.com)

## License

The documentation, the SDK and the examples in this repository are MIT licensed - use them in your
own resources, free or paid. GFX Phone itself is a commercial resource:
[gfxscripts.com/phone](https://gfxscripts.com/phone).

---

**Keywords:** FiveM phone, FiveM phone script, FiveM custom phone apps, QBCore phone, Qbox phone,
ESX phone, FiveM NUI app, GTA V roleplay phone, iOS phone for FiveM, FiveM phone SDK, FiveM phone
widgets, FiveM Dynamic Island.
