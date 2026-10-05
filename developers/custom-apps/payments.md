---
title: "Payments (Lemon Pay)"
parent: Custom Apps
grand_parent: Developers
nav_order: 7
description: "In-app payments for FiveM phone apps with Lemon Pay: free amounts, server-created payments, refunds."
---
# In-App Payments with Lemon Pay (FiveM Phone)

Custom apps on [GFX Phone](https://gfxscripts.com/phone) can charge the player through **Lemon Pay**,
the phone's wallet backed by the framework's bank account (QBCore, Qbox, ESX). Money only ever moves
on the server; the page can ask, never charge.

Permission: `payments`.

## Option 1 - a free amount

```js
try {
  const payment = await GFXPhone.pay({ amount: 25, label: 'Pizza', ref: 'order-42' })
  // { id, amount, balance }
} catch (e) {
  // e.code: cancelled, noMoney, overLimit, refused, invalid, failed
}
```

The player confirms the Lemon Pay card, the server charges up to `Config.CustomApps.MaxPayment`
(the server owner sets it in the admin panel). Turn this option off for your app with
`serverPaymentsOnly = true` in the server registration.

## Option 2 - a payment your server creates

The amount and label come from your server; the page can not change them.

```lua
-- server
local paymentId = exports['gfx-phone']:CreateCustomAppPayment(src, 'pizza', {
    amount = 25, label = 'Pizza', ref = 'order-42', ttl = 300,
})
TriggerClientEvent('pizza:client:checkout', src, paymentId)
```

```js
// page (after your client forwards the id with SendCustomAppMessage)
await GFXPhone.pay({ paymentId })
```

The payment belongs to that player only and expires after `ttl` seconds (default 300).

## Confirming on the server

Register the app on the server with `onPayment`. It runs after the charge; return `false` (or error)
to refund the player at once - the page then gets `refused`.

```lua
exports['gfx-phone']:AddCustomApp({
    id = 'pizza', label = 'Pizza', ui = 'ui/index.html',
    onPayment = function(src, payment)
        -- payment = { id, appId, amount, label, ref, at }
        if not Orders.Exists(payment.ref) then return false end   -- refund
        Orders.MarkPaid(payment.ref)
        return true
    end,
})
```

Every charge also fires `gfx-phone:server:customAppPayment (src, appId, payment)`.
`RefundCustomAppPayment(paymentId)` refunds later (within an hour).

**Never trust the page's word that it paid** - deliver goods from `onPayment` or the server event.

## Rules

- Rate limit: 5 payments per player per 30 seconds.
- The admin panel's **Custom apps** switch off refuses every custom app payment; App access off
  refuses that app's.
- The wallet balance and transaction list on the phone update with the server's answer.
