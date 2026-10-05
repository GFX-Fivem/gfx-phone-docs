# Registering a Custom App (`AddCustomApp`)

`exports['gfx-phone']:AddCustomApp(def)` puts your app on the [GFX Phone](https://gfxscripts.com/phone).
It returns `true`, or `false, err`.

## Fields

| Field | Meaning |
|-------|---------|
| `id` | `a-z`, `0-9`, `_`, starts with a letter, up to 32 characters. Never one of the phone's own app ids. |
| `label` | The app's name (up to 24). A string, or one per language: `{ en = 'Bank', tr = 'Banka' }`. English, then any, is the fallback. |
| `ui` | The page: `ui/index.html`, `nui://<your resource>/...` or `https://cfx-nui-<your resource>/...`. Another resource's page is refused. A dev server (`http://localhost:<port>/`) only with `set gfx-phone_dev 1`. |
| `icon` | `https://...` or a file of your resource. |
| `color` | Icon tile colour when there is no icon (CSS colour or gradient). |
| `ground` | Colour under the page while it loads: `'#fff'` or `{ light = '#fff', dark = '#000' }`. |
| `darkSurface` | `true` when the app is always dark (white status bar icons). |
| `offline` | `true` = opens without a signal (no "No Connection" screen). |
| `defaultApp` | `true` = installed on every phone and cannot be deleted. `false` = listed in the [App Store](app-store.md). |
| `subtitle`, `description`, `developer`, `version`, `ageRating` | App Store texts (`subtitle` / `description` can be per language like `label`). |
| `category` | `social`, `utility`, `finance`, `media` or `game`. |
| `permissions` | What the page may use (below). Default `{ 'notifications', 'island' }`. |
| `widgets` | Home-screen widgets - see [Widgets](widgets.md). |
| `onOpen()` / `onClose()` | The page was loaded / closed (or the phone put away). |
| `onMessage(action, data)` | `GFXPhone.send(action, data)` from the page; the return value goes back. |
| `onIslandAction(key, button)` | A button on your Dynamic Island activity was tapped. |

Server registration only:

| Field | Meaning |
|-------|---------|
| `price` | App Store price. |
| `serverPaymentsOnly` | `true` = the page can only pay payments your server created. |
| `onPayment(src, payment)` | A payment went through; return `false` to refund it at once. See [Payments](payments.md). |

Errors: `invalidId`, `reserved` (a built-in app id), `noLabel`, `invalidUi`, `ownedByOther` (another
resource registered this id), `tooMany` (64 apps).

## Permissions

| Permission | Unlocks |
|------------|---------|
| `notifications` | `GFXPhone.notify`, `SendCustomAppNotification` |
| `island` | `GFXPhone.island.*`, `Start/Update/EndCustomAppIsland` |
| `camera` | `GFXPhone.camera.takePhoto` |
| `photos` | `GFXPhone.gallery.pick` |
| `passcode` | `GFXPhone.auth.verifyPasscode` |
| `passwords` | `GFXPhone.passwords.save / autofill` (servers with the Passwords vault) |
| `payments` | `GFXPhone.pay` |
| `location` | `GFXPhone.location.get` - the player is asked once; Settings > your app changes it |
| `contacts` | `GFXPhone.contacts.pick` |

Alerts, toasts, share, waypoints, opening Messages / calling a number, widgets, state, network and
battery need no permission. A call the app has no permission for fails with `notPermitted`.

## Client or server registration?

- **Client only** - the simplest: an app that needs nothing from the server.
- **Client + server** (same `id`, same resource) - adds an App Store price, the admin panel's App
  access switch, server-charged payments and the server exports
  (`SendCustomAppNotification(src, ...)`, `UpdateCustomAppWidget(src, ...)`...). The server's fields
  win; callbacks stay on the side that registered them.

Server side, register when `gfx-phone` starts:

```lua
local function register()
    exports['gfx-phone']:AddCustomApp({ id = 'myapp', label = 'My App', ui = 'ui/index.html', price = 9.99 })
end
AddEventHandler('onResourceStart', function(res)
    if res == 'gfx-phone' or res == GetCurrentResourceName() then register() end
end)
```

## When your resource stops

Its app disappears from every phone. Its place on the home screen (and its widgets) is kept, and it
comes back there when the resource starts again. `RemoveCustomApp(id)` does the same on purpose.

---

Part of the [GFX Phone Custom Apps SDK](../README.md) · [GFX Phone for FiveM](https://gfxscripts.com/phone) by [GFX Scripts](https://gfxscripts.com)
