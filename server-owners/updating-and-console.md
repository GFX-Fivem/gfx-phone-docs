---
title: Updating and Console Messages
parent: Server Owners
nav_order: 11
description: "Update GFX Phone safely and understand every line of its server console report: gfx-lib, database, web panel link and setup messages."
---

# Updating and Console Messages

## Updating

Replace the `gfx-phone` folder with the new version and restart it. Keep your `config.lua` changes
(or better, set them in the panel - panel settings survive every update).

If the new version adds database tables, the phone stays off and the console says so. Open the
panel: the setup wizard installs the new tables, press **Finish** and the phone starts again. Your
data and settings are untouched.

## What the console says

On every start the phone prints one report, then only changes:

```
[gfx-phone] gfx-phone 0.1.1  |  framework qb-core  |  inventory ox_inventory
[gfx-phone]  OK  gfx-lib
[gfx-phone]  OK  database (oxmysql)
[gfx-phone]  OK  web panel link: connected - manage this server at https://phone.gfxscripts.com
[gfx-phone]  OK  the phone is running
```

| Line | Meaning / fix |
|---|---|
| `-- gfx-lib` | `ensure gfx-lib` before gfx-phone. |
| `-- database - none found` | `ensure oxmysql` before gfx-phone. |
| `web panel link: not set up` | The two `set gfxphone_...` lines are missing from `server.cfg` - or use the in-game panel. |
| `web panel link: rejected` | The id / secret no longer match (rotated, server disabled, purchase refunded). Copy the lines again from the dashboard, or **Rotate secret**. |
| `web panel link: cannot reach ...` | The server cannot open HTTPS to phone.gfxscripts.com (firewall, host blocks outbound traffic). It keeps retrying. |
| `web panel link: these credentials are in use on another server right now` | The same two lines run on a second machine (a copied `server.cfg`, a test server). Stop it, or **Rotate secret** and put the new lines only on this server. |
| `web panel link: off` | `Config.Admin.Web.Enabled = false`. Use `/phoneadmin`. |
| `-- setup wizard not finished` | Finish the [setup wizard](setup-wizard.md). |
| `setup: this version adds N table(s)` | An update: open the wizard, install the tables, **Finish**. |
| `setup: done before, but the database lacks N of its table(s)` | The database was wiped or `oxmysql` points at another database. If intended, open the wizard to reinstall the tables. If not, fix the connection string and restart - nothing was touched. |
| `the phone is running` | All good. |
| `setup reset by ...` | Someone re-ran the wizard: the phone runs until the next restart, then waits for **Finish**. |
