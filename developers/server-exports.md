---
title: Server Exports
parent: Developers
nav_order: 1
description: "Every GFX Phone server export for FiveM: identity, SIM cards and phone numbers, calls, device, mail, bills and invoices, emergency services, ID cards, housing and apps."
---

# Server Exports
{: .no_toc }

All exports are on `exports['gfx-phone']` and run on the **server**. They answer `nil` until the
phone's setup wizard is finished.

1. TOC
{:toc}

---

## Identity

| Export | Returns |
|---|---|
| `GetOwnerKey(src)` | The key the player's phone data is filed under, or `nil` |
| `GetAccount(src)` | `{ id, name, createdAt, avatar? }` - the signed-in Lemon Account, or `nil` |
| `GetDeviceKey(src)` | The handset the player holds (`'phone:<serial>'` / `'player:<id>'`), or `nil` |

## SIM cards and phone numbers

| Export | |
|---|---|
| `GiveSim(src, { carrier?, label?, number? })` | Creates a SIM card item -> `ok, meta` |
| `GetSims(src)` | `{ list = { { slot, number, carrier, label? } }, active }` |
| `GetPhoneNumber(src)` | The active line's number, or `nil` |
| `InsertSim(src, meta)` | Puts a SIM in the handset -> slot, or `nil` (no handset / no free slot) |
| `ReloadSims(src)` | Re-reads the cards from the database and pushes them to the phone |

```lua
-- A phone shop: give the buyer a new SIM card.
local ok, meta = exports['gfx-phone']:GiveSim(source, { carrier = 'Fleeca Mobile' })
if ok then print('new number', meta.number) end
```

## Calls

| Export | |
|---|---|
| `FindPlayerByNumber(number)` | The online player whose active line is `number`, or `nil` |
| `GetCallPartner(src)` | The player `src` is talking to (the first other one on a conference call), or `nil` |
| `GetCallMembers(src)` | Every player on `src`'s call, `src` included (`{}` when not on one) |
| `IsCallMuted(src)` | `true` while `src` has their call muted |

## Device

| Export | |
|---|---|
| `GetDevice(src)` | `{ battery, waterDamaged, cracks, case, waterproof }` |
| `RepairPhone(src)` | Clears water damage and cracks (a repair shop, after payment) |

## Mail

| Export | |
|---|---|
| `SendMail(src, msg)` | Mail to an online player -> id, or `nil` + `'offline'` \| `'invalid'` |
| `SendMailTo(address, msg)` | Mail to any mailbox address, the owner online or not -> id, or `nil` + `'invalid'` \| `'noMailbox'` |
| `SendMailToMany(targets, msg)` | Mass mail: `targets` = addresses and/or online server ids (max 2000) -> mailboxes reached |

`msg = { from?, fromName?, subject, body?, category?, icon?, codes? }`. `codes = { { label, value } }`
(max 4) shows copy boxes under the body - one-time codes, temporary passwords.

```lua
exports['gfx-phone']:SendMail(source, {
    fromName = 'Maze Bank', subject = 'Your login code',
    body = 'Use this code to sign in.', codes = { { label = 'Code', value = '482913' } },
})
```

## Bills and invoices

| Export | |
|---|---|
| `CreateInvoice(src, target, amount, reason, job?)` | -> invoice, or `nil` + error. `src` = the issuing employee, or `0` / `nil` = your resource bills on behalf of `job` (built-in billing). `target` = server id, citizen id / identifier or phone number. `reason` = text or item lines `{ { label, amount?, qty? } }`. |
| `GetInvoices(identifier)` | The invoices of a character: `{ { id, issuer, title, amount, lateFee?, status, issuedAt, dueAt, paidAt?, society? } }` |
| `PayInvoice(src, id)` | -> `ok, error` (`noMoney`, `alreadyPaid`, `missing`, `busy`, `refused`, `clientPay`) |
| `TallyIssueInvoice(src, target, amount, reason, scope?)` | Issues an invoice through the phone's billing adapter |
| `TallyProvider()` | The billing script in use (`'gfx'` = the built-in billing) |

## Emergency services

| Export | |
|---|---|
| `CreateServiceCall({ service, message, x, y, z, street?, name?, number?, anonymous?, code?, priority? })` | Creates a dispatch call -> id, or `nil` + error |
| `GetServiceCalls(serviceId?)` | Live calls |
| `ResolveServiceCall(id, outcome?)` | -> `true` when found |
| `GetUnitCallsign(src)` | -> `callsign, division` |
| `RefreshServices(src)` | Re-pushes the player's services view (after a job change) |

```lua
-- A store robbery alarm.
exports['gfx-phone']:CreateServiceCall({
    service = 'police', message = '24/7 robbery in progress', code = '10-90',
    x = coords.x, y = coords.y, z = coords.z, priority = 1,
})
```

## ID cards

| Export | |
|---|---|
| `RefreshIdCards(src)` | Re-reads the player's documents now (after your script issued / revoked one) -> count |
| `GetIdCards(src)` | The player's documents, or `nil` |
| `PushIdCard(src, card)` | Adds / replaces a document from your script (kept until the player leaves) -> `true` \| `false, err` |
| `RemoveIdCard(src, id)` | Removes a document added with `PushIdCard` |

## Home (housing)

| Export | |
|---|---|
| `HavenEvent(propertyId, kind, { who?, visitor? })` | Logs an event on a property and notifies its owner and key holders. `kind` = `doorbell`, `entry`, `lockpick`, `alarm`, `raid`, `offer`, `keyGranted`, `keyRevoked`, `billPaid`. A doorbell with `visitor` (server id) can be answered from the phone. |
| `HavenChanged(propertyId)` | The property changed in your housing script: its holders' phones re-read it |
| `GetHavenProperties(src)` | The player's properties as the Home app shows them |
| `GetHousingScript()` | The housing script Home runs against (`'none'` when none) |

## Apps

| Export | |
|---|---|
| `GetBinixPrice(symbol)` | A stock / coin price, or `nil` |
| `GetMinitFleet()` | The Renty car-sharing fleet |
| `SetMinitCarStatus(id, status, extra?)` | Changes a fleet car (only cars nobody reserved or rents) |
| `SetEatsyCourierAccess(src, on)` | Grants / removes Eatsy courier access |
| `EatsyStoreVerdict(storeId, 'approved' \| 'rejected', note?)` | Approves or rejects an Eatsy store |
| `SetNewsWriter(src, on)` | Lets a player write News articles (until restart) |
| `SetMusicHeadphones(src, available, output?)` | Headphones for the Music app (an earbuds item); `output` = `'speaker'` \| `'headphones'` |
| `StopMusic(src)` | Stops the player's music |
| `SetEventHost(src \| identifier, allowed)` | Lets a player host Gather events |
| `SetPrismVerified(username, on)` | Gives / takes a Picsta verified badge |
| `SubmitApproval(app, kind, id, ownerKey, title, subtitle, data?)` | Queues something for the admin panel's Approvals |
| `ClaimImportedData(identifier, ownerKey)` | Moves data imported from another phone onto an owner |
| `GetCritterraTrainer(src)` | The player's Critterra trainer, or `nil` |
| `GiveCritterraItems(src, { orb?, quartz?, nova?, treat? })` | Adds items to their Critterra pack |

## Custom apps

`AddCustomApp`, `RemoveCustomApp`, `SendCustomAppNotification`, `SendCustomAppMessage`,
`UpdateCustomAppWidget`, `CreateCustomAppPayment`, `RefundCustomAppPayment` - see
[Custom app exports](custom-apps/lua-api.md).
