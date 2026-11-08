---
title: Setup Wizard
parent: Server Owners
nav_order: 5
description: "Every step of the GFX Phone first-run setup wizard: server check, items, identity and numbers, import, media storage, GIF search, network and finish."
---

# The Setup Wizard
{: .no_toc }

Until the wizard is finished the phone runs nothing on your server. The wizard opens on its own in
the [web panel](web-panel.md) and the [in-game panel](in-game-panel.md) (`/phoneadmin`) as long as
setup is not done. Each step has **Back** / **Next**; settings are saved when you leave a step.

1. TOC
{:toc}

---

## Phone licence (in game only)

Enter the Tebex transaction id of the full version to unlock every app - or **skip** to run the free
version. On the web this step does not exist: you already signed in with your transaction id.
See [Free and full version](free-and-full-version.md).

## 1. Server check

Checks gfx-lib, the database, the phone's database tables and the web build, and shows the detected
framework, inventory and voice resource.

- Tables missing? Press **Install tables** (super role). The wizard creates every table - no SQL
  file to import by hand.

## 2. Phone & SIM items

The phone item, the SIM card item, the starter SIM, SIM slots and the charger / power bank / case
items. Each item is checked against your inventory; the phone item must exist before you can go on.
How to add items to each inventory: [Inventory items](items.md).

## 3. Identity & numbers

- **Lemon Account mode** - `character` (the phone belongs to the character) or `item` (the phone
  belongs to the handset item; players sign in with a Lemon Account).
- **Carrier** name shown in the status bar.
- **Number format** and the digits / prefix of new phone numbers.

## 4. Import from another phone (optional)

Coming from another phone script? Bring your players' contacts, messages, calls, photos and notes.
See [Import from another phone](importing-from-another-phone.md).

## 5. Media storage

Photos, videos and voice messages taken with the phone are stored on **your own storage**. Pick the
**Storage provider**:

- **Fivemanage** (default)
  1. Create an account at [fivemanage.com](https://fivemanage.com) and an API token (**Tokens**).
  2. Paste the key and press **Test key**.
- **Custom**: your own upload service (an S3 / R2 bucket behind a Worker, a Node, Python or PHP
  uploader). Fill in the Upload URL, File field, Link path and Signing key, then press
  **Test upload**. What your service has to do, a ready-made Cloudflare Worker and hosting without a
  domain: [Custom storage](custom-storage.md).

Keys are kept in your database and never sent to players. Without storage the camera cannot save
photos, so the wizard does not go on until one is set up.

## 6. GIF search (optional)

A GIPHY API key enables GIF search in Messages. **Test key** checks it.

## 7. Network

Signal strength outside the coverage zones you draw, Wi-Fi hotspots on or off, and calls over Wi-Fi.
You can draw coverage zones and hotspots later in the panel.

## 8. Finish

Shows every required and recommended check. **Finish** is refused while a required check fails
(gfx-lib, database, tables, web build, phone item). Press it and the phone starts for everyone -
no restart needed.

## Running the wizard again

A super admin can re-run the wizard from the Overview. The phone keeps running until the next
restart, then waits for **Finish** again.
