# Troubleshooting GFX Phone Custom Apps

**The app does not show on the phone**
- Register inside `AddEventHandler('gfx-phone:client:customAppsReady', ...)` - registering at the top
  of your file runs before the phone is ready.
- Print what `AddCustomApp` returns: `false, err` tells you why (`invalidUi`, `reserved`...).
- The server owner may have turned custom apps off (admin panel > Custom apps) or your app off
  (App access).
- `defaultApp = false` apps are in the App Store, not on the home screen, until installed.

**Blank screen when the app opens**
- The page and its scripts / styles are listed in your `fxmanifest.lua` `files { }`.
- Open `https://cfx-nui-<your resource>/ui/index.html` in the NUI dev tools (`nui_devtools`) and check
  the console.
- Your page's background is transparent: set your own colour or `ground` in the registration.

**`GFXPhone.ready()` times out**
- The SDK must be loaded by the page itself, not by a nested iframe.
- The phone resource must be named `gfx-phone`; otherwise call
  `GFXPhone.configure({ phoneResource: 'name' })` before `ready()`.

**`notActive` errors**
Sheets (camera, pay, confirm...) only open while your app is on screen and the phone is unlocked.

**`notPermitted` errors**
Add the permission to `permissions` in your registration (see [Registration](registration.md)).

**The page looks too big or too small**
Do not hard-code a zoom. The SDK fixes the scale; lay out for a 384 px wide screen.

**The player walks while typing in my app**
Use real `<input>` / `<textarea>` elements (or `contenteditable`) - the SDK detects focus on those.

**Widgets show "Nothing to show yet"**
Send data with `UpdateCustomAppWidget` / `GFXPhone.widgets.update`, or give the widget initial `data`
in the registration.

Still stuck? Get support through [gfxscripts.com](https://gfxscripts.com).

---

Part of the [GFX Phone Custom Apps SDK](../README.md) · [GFX Phone for FiveM](https://gfxscripts.com/phone) by [GFX Scripts](https://gfxscripts.com)
