---
title: "Custom App Exports"
parent: Custom Apps
grand_parent: Developers
nav_order: 4
description: "Client and server Lua exports and events for GFX Phone custom apps."
---
# GFX Phone Custom Apps - Lua API (Exports and Events)

Every export below is on `exports['gfx-phone']`. Every call except `AddCustomApp` acts only on the
calling resource's own app (checked with `GetInvokingResource()`).

## Client exports

| Export | |
|--------|---|
| `AddCustomApp(def)` | -> `true` \| `false, err`. See [Registration](registration.md). |
| `RemoveCustomApp(id)` | -> `true` \| `false` |
| `SendCustomAppMessage(id, action, data)` | the page gets `GFXPhone.on('message', { action, data })` |
| `SendCustomAppNotification(id, n)` | `n = { title, body?, image?, data?, id? }` |
| `SetCustomAppBadge(id, n)` | the red count on the icon (0 clears) |
| `StartCustomAppIsland(id, key, activity)` | a Dynamic Island live activity |
| `UpdateCustomAppIsland(id, key, activity)` | |
| `EndCustomAppIsland(id, key)` | |
| `UpdateCustomAppWidget(id, widget, data)` | a home-screen widget's content |
| `OpenCustomApp(id, intent?)` | opens the phone on the app; the page gets `intent` |
| `IsCustomAppOpen(id)` | -> `true` while the app is open |

## Server exports

For apps also registered on the server:

| Export | |
|--------|---|
| `AddCustomApp(def)` / `RemoveCustomApp(id)` | adds `price`, `serverPaymentsOnly`, `onPayment` |
| `SendCustomAppNotification(src, id, n)` | |
| `SendCustomAppMessage(src, id, action, data)` | |
| `UpdateCustomAppWidget(src, id, widget, data)` | `src = -1` for every player |
| `CreateCustomAppPayment(src, id, { amount, label, ref?, ttl? })` | -> `paymentId` for `GFXPhone.pay({ paymentId })` |
| `RefundCustomAppPayment(paymentId)` | -> `true` \| `false` (within an hour) |

## Events

| Side | Event | Arguments |
|------|-------|-----------|
| client | `gfx-phone:client:customAppsReady` | - register your app here |
| client | `gfx-phone:client:customAppState` | `id, state` - `open`, `foreground`, `background`, `closed` |
| client (trigger) | `gfx-phone:client:openApp` | `appId, intent?` - opens any app |
| server | `gfx-phone:server:customAppPayment` | `src, appId, payment` - a payment was charged |

## Example

```lua
local phone = exports['gfx-phone']

-- A delivery job: live activity + widget + notification.
RegisterNetEvent('myjob:client:started', function(stops)
    phone:StartCustomAppIsland('deliveries', 'route', {
        leading = { icon = 'app' }, trailing = ('0/%d'):format(stops),
        title = 'Delivery route', subtitle = 'Head to the first stop', progress = 0,
        buttons = { { id = 'cancel', label = 'Cancel', style = 'destructive' } },
    })
end)

RegisterNetEvent('myjob:client:progress', function(done, stops)
    phone:UpdateCustomAppIsland('deliveries', 'route', { trailing = ('%d/%d'):format(done, stops), progress = done / stops })
    phone:UpdateCustomAppWidget('deliveries', 'today', { value = tostring(done), label = 'Deliveries today' })
    if done == stops then
        phone:EndCustomAppIsland('deliveries', 'route')
        phone:SendCustomAppNotification('deliveries', { title = 'Route complete', body = 'Return to the depot for your pay.' })
    end
end)
```
