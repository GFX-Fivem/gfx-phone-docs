---
title: Installation
parent: Server Owners
nav_order: 2
description: "Install GFX Phone on a FiveM server in three steps: start the resource, connect the admin panel (web or in game) and finish the setup wizard."
---

# Installing GFX Phone
{: .no_toc }

GFX Phone installs in three steps. Until the last one is done it runs **nothing** - no database
access, no phone scripts, no NUI - and players who press the phone key get a "not set up yet"
notice. The server console always tells you which step is next.

1. TOC
{:toc}

---

## Step 1 - Start the resource

Put `gfx-phone` in your resources folder and start it **after** your database, your framework and
`gfx-lib`:

```cfg
ensure oxmysql
ensure qb-core        # your framework: es_extended / qb-core / qbx_core
ensure gfx-lib
ensure gfx-phone
```

Start the server. The console prints a short report and the next step:

```
[gfx-phone]  OK  gfx-lib
[gfx-phone]  OK  database (oxmysql)
[gfx-phone]  --  setup wizard not finished
[gfx-phone] NEXT: Open https://phone.gfxscripts.com > this server: the setup wizard starts on its own.
```

You do **not** need to import an SQL file by hand: the setup wizard creates the tables.

## Step 2 - Open the admin panel

Pick **one** of the two ways. Both open the same panel and the same setup wizard.

### Option A: from your browser (web panel)

1. Go to **[phone.gfxscripts.com](https://phone.gfxscripts.com)** and sign in with the **Tebex
   transaction id** of your purchase. The first time, claim it with a password and/or Discord.
2. Press **Register a server**, pick the purchase and name the server. The dashboard shows two lines
   **once** - copy them:

   ```cfg
   set gfxphone_server_id "srv_..."
   set gfxphone_admin_secret "..."
   ```

3. Paste them into `server.cfg` **above** `ensure gfx-phone` and restart gfx-phone. Within a few
   seconds the server shows **online** on the dashboard.
4. Press **Open panel**. The setup wizard opens.

Keep the secret private - it is what lets the panel act on your server. Leaked or lost?
**Rotate secret** on the dashboard gives you new lines. More: [Web admin panel](web-panel.md).

### Option B: in game (no server.cfg lines)

1. Join your server as an **admin** (your framework's admin group, or a txAdmin admin).
2. Type **`/phoneadmin`**. The panel opens with the setup wizard.
3. The first wizard step, **Phone licence**, asks for your Tebex transaction id. It activates the full
   version and connects the server to the web panel at the same time - no `server.cfg` lines needed.
   No purchase yet? Skip it and the phone runs as the [free version](free-and-full-version.md).

Turned away? Run `/phoneadminwhy` - it lists every check. More: [In-game admin panel](in-game-panel.md).

## Step 3 - Finish the setup wizard

The wizard walks through the server check, the inventory items, identity and phone numbers, an
optional import from another phone, media storage, GIF search and the network. Press **Finish**: the
phone starts for everyone on the server immediately - no restart.

Every step explained: [Setup wizard](setup-wizard.md).

## After installing

- Give your inventory item images for the phone items - see [Inventory items](items.md).
- Invite your staff: create their accounts in the panel (**Admins**) and send them the server's
  **Staff link**.
- Adjust settings any time in the panel's **Configuration** page - see [Configuration](configuration.md).
