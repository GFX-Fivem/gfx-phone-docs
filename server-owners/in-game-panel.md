---
title: In-Game Admin Panel
parent: Server Owners
nav_order: 4
description: "Open the GFX Phone admin panel in game with /phoneadmin: who can open it on QBCore, Qbox and ESX, roles, ACE permissions and /phoneadminwhy."
---

# In-Game Admin Panel (`/phoneadmin`)
{: .no_toc }

Type **`/phoneadmin`** in game to open the admin panel over your screen. It is the same panel as the
[web panel](web-panel.md) and needs nothing in `server.cfg`.

1. TOC
{:toc}

---

## Who can open it

Your server's **admins**, as your framework sees them - by default the groups `god`, `owner`,
`superadmin` and `admin` (`Config.Admin.Groups`):

| Framework | Who counts |
|---|---|
| ESX | the player's group, or your ESX `Config.AdminGroups` |
| QBCore | QBCore permissions (`/addpermission <id> god`, or `add_principal identifier.<id> qbcore.god`) |
| Qbox | `qbx_core` permissions (`group.admin` in its permissions.cfg) |
| ox_core, ND_Core, vRP | the framework's admin group |
| txAdmin | an admin signed in to txAdmin in game |
| any | the ACE objects `<group>`, `group.<group>`, `command` |

## Roles

Admins open the panel with the role `Config.Admin.AdminRole` (default **super**). To give the panel to
staff who are **not** framework admins, add an ACE line to `server.cfg`:

| Role | ACE | Can |
|---|---|---|
| viewer | `gfxphone.admin` | read everything: accounts, phone data, the phone mirror, the audit log |
| manager | `gfxphone.manager` | viewer + change the configuration, finish the setup |
| super | `gfxphone.super` | manager + manage web admins, security settings, the danger zone |

```cfg
add_ace group.support gfxphone.admin allow      # read only
add_ace group.mod gfxphone.manager allow        # can edit the config
```

## "You can't open the admin panel"

A refused `/phoneadmin` always tells you why (a notification in game and one line in the server
console). For the full picture run:

```
/phoneadminwhy
```

It prints every check: the gfx-lib version, the framework detected, your group / permission, the ACE
nodes and the final role. From the server console: `phoneadminwhy <player id>`.

Typical fixes:

- **`framework: none`** - `gfx-lib` started before your framework. Put `ensure gfx-lib` **after** the
  framework in `server.cfg`.
- **Every check `no` on QBCore** - the player has no QBCore permission: `/addpermission <id> god`.
- **Old gfx-lib** - update gfx-lib to 1.7.2 or newer.

## Activating the licence in game

The in-game setup wizard starts with a **Phone licence** step: enter your Tebex transaction id to
unlock the full version. This also registers the server with the web panel, so you can sign in at
[phone.gfxscripts.com](https://phone.gfxscripts.com) with the same id later without any `server.cfg`
lines. See [Free and full version](free-and-full-version.md).
