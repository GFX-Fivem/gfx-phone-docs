---
title: Custom Apps
parent: Developers
nav_order: 4
has_children: true
description: "Build your own FiveM phone apps for GFX Phone with HTML, React or Vue: JavaScript SDK, notifications, Lemon Pulse, widgets, camera, Lemon Pay payments."
---

# Custom Apps - Build Your Own FiveM Phone Apps

Any resource can add its own app to [GFX Phone](https://gfxscripts.com/phone). The app is a web page
your resource ships (plain HTML, React, Vue, Svelte...), shown on the phone screen. A small JavaScript
SDK gives the page the phone's features. Custom apps are free on every GFX Phone server.

## What your app can use

| Feature | SDK call | Permission |
|---|---|---|
| Push notifications | `GFXPhone.notify()` | `notifications` |
| Lemon Pulse activities | `GFXPhone.island.start()` | `island` |
| Home-screen widgets | `GFXPhone.widgets.update()` | - |
| Light / dark theme, accent, text size, RTL | `GFXPhone.applyTheme()` | - |
| Phone camera | `GFXPhone.camera.takePhoto()` | `camera` |
| Photo library | `GFXPhone.gallery.pick()` | `photos` |
| Passcode check | `GFXPhone.auth.verifyPasscode()` | `passcode` |
| Save / AutoFill passwords | `GFXPhone.passwords.save()` | `passwords` |
| Lemon Pay payments | `GFXPhone.pay()` | `payments` |
| Location and GPS waypoint | `GFXPhone.location.get()` | `location` |
| Contacts, messages, calls | `GFXPhone.contacts.pick()` | `contacts` |
| Share sheet | `GFXPhone.share()` | - |
| Signal, Wi-Fi, battery | `GFXPhone.network.status()` | - |
| Alerts, confirms, action sheets, toasts | `GFXPhone.ui.confirm()` | - |

## In 30 seconds

```lua
AddEventHandler('gfx-phone:client:customAppsReady', function()
    exports['gfx-phone']:AddCustomApp({
        id = 'myapp', label = 'My App', ui = 'ui/index.html', icon = 'ui/icon.png',
        defaultApp = true, permissions = { 'notifications' },
    })
end)
```

```html
<script src="https://cfx-nui-gfx-phone/web/build/sdk/gfx-phone-sdk.js"></script>
<script>
  GFXPhone.ready().then(() => {
    GFXPhone.applyTheme()
    GFXPhone.notify({ title: 'My App', body: 'Hello!' })
  })
</script>
```

Start with [Getting started](getting-started.md). A complete example resource (Tip Jar) is in the
[GitHub repository](https://github.com/GFX-Fivem/gfx-phone-docs/tree/main/examples/tip-jar), with the
SDK's [TypeScript types](https://github.com/GFX-Fivem/gfx-phone-docs/blob/main/sdk/gfx-phone-sdk.d.ts).
