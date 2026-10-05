# GFX Phone Documentation - FiveM Phone for QBCore, Qbox and ESX

**The official documentation of [GFX Phone](https://gfxscripts.com/phone), the modern iOS-style phone
for FiveM roleplay servers.** Installation and the admin panel for server owners, every export and
event for developers, and the SDK to build your own phone apps.

[![Read the docs](https://img.shields.io/badge/Read%20the-docs-0a84ff)](https://gfx-fivem.github.io/gfx-phone-docs/)
[![GFX Phone](https://img.shields.io/badge/GFX%20Phone-FiveM%20phone%20script-0a84ff)](https://gfxscripts.com/phone)
[![Live demo](https://img.shields.io/badge/Try%20it-live%20demo-34c759)](https://gfxscripts.com/phone)
[![Frameworks](https://img.shields.io/badge/QBCore%20%7C%20Qbox%20%7C%20ESX-supported-ff9f0a)](https://gfxscripts.com/phone)

### 📖 [Read the documentation → gfx-fivem.github.io/gfx-phone-docs](https://gfx-fivem.github.io/gfx-phone-docs/)

---

## For server owners

Install the phone and set it up from your browser or in game - no coding needed.

- [Requirements](https://gfx-fivem.github.io/gfx-phone-docs/server-owners/requirements.html) - framework, gfx-lib, database, inventory
- [Installation](https://gfx-fivem.github.io/gfx-phone-docs/server-owners/installation.html) - three steps from download to a running phone
- [Web admin panel](https://gfx-fivem.github.io/gfx-phone-docs/server-owners/web-panel.html) - manage your server at [phone.gfxscripts.com](https://phone.gfxscripts.com)
- [In-game admin panel](https://gfx-fivem.github.io/gfx-phone-docs/server-owners/in-game-panel.html) - `/phoneadmin`, roles, permissions
- [Setup wizard](https://gfx-fivem.github.io/gfx-phone-docs/server-owners/setup-wizard.html) - every step explained
- [Inventory items](https://gfx-fivem.github.io/gfx-phone-docs/server-owners/items.html) - qb-inventory, ESX, ox_inventory, qs-inventory and more
- [Free and full version](https://gfx-fivem.github.io/gfx-phone-docs/server-owners/free-and-full-version.html)
- [Configuration](https://gfx-fivem.github.io/gfx-phone-docs/server-owners/configuration.html) · [Commands and keys](https://gfx-fivem.github.io/gfx-phone-docs/server-owners/commands-and-keys.html)
- [Import from another phone](https://gfx-fivem.github.io/gfx-phone-docs/server-owners/importing-from-another-phone.html) - lb-phone, qs-smartphone, gksphone, qb-phone, NPWD...
- [Updating and console messages](https://gfx-fivem.github.io/gfx-phone-docs/server-owners/updating-and-console.html)

## For developers

- [Server exports](https://gfx-fivem.github.io/gfx-phone-docs/developers/server-exports.html) - SIM cards, calls, mail, invoices, dispatch, ID cards, housing...
- [Client exports](https://gfx-fivem.github.io/gfx-phone-docs/developers/client-exports.html) - signal, Wi-Fi, battery, voice quality
- [Events](https://gfx-fivem.github.io/gfx-phone-docs/developers/events.html) - calls and voice routing, SIM / device changes, invoices
- [Custom apps](https://gfx-fivem.github.io/gfx-phone-docs/developers/custom-apps/) - build your own phone app with HTML / React / Vue:
  notifications, Dynamic Island, home-screen widgets, camera, Lemon Pay payments

```lua
AddEventHandler('gfx-phone:client:customAppsReady', function()
    exports['gfx-phone']:AddCustomApp({
        id = 'myapp', label = 'My App', ui = 'ui/index.html',
        defaultApp = true, permissions = { 'notifications', 'island' },
    })
end)
```

## In this repository

| Folder | |
|---|---|
| [`server-owners/`](server-owners) | Installation and admin guides (the site's source) |
| [`developers/`](developers) | Exports, events and custom apps guides |
| [`examples/tip-jar`](examples/tip-jar) | A complete custom app resource: payments, Dynamic Island, camera, widget |
| [`sdk/`](sdk) | The custom app SDK script and its TypeScript types |

## About GFX Phone

[GFX Phone](https://gfxscripts.com/phone) brings a full smartphone to FiveM: calls and video calls,
Messages, social apps, Lemon Pay banking, vehicles and housing, an App Store, Dynamic Island,
home-screen widgets, 13 languages and a web + in-game admin panel. Made by
[GFX Scripts](https://gfxscripts.com).

- Product page and live demo: **[gfxscripts.com/phone](https://gfxscripts.com/phone)**
- Pricing: [gfxscripts.com/phone#pricing](https://gfxscripts.com/phone#pricing)
- Server owner portal: [phone.gfxscripts.com](https://phone.gfxscripts.com)

## License

The documentation, the SDK files and the examples are MIT licensed. GFX Phone itself is a commercial
resource: [gfxscripts.com/phone](https://gfxscripts.com/phone).

---

**Keywords:** FiveM phone, FiveM phone script, QBCore phone, Qbox phone, ESX phone, FiveM phone
installation, FiveM phone exports, FiveM custom phone apps, FiveM NUI app, GTA V roleplay phone,
iOS phone for FiveM.
