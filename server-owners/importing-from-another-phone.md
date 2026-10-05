---
title: Import from Another Phone
parent: Server Owners
nav_order: 10
description: "Migrate to GFX Phone from lb-phone, qs-smartphone, gksphone, qb-phone, NPWD and other FiveM phone scripts: contacts, messages, calls, photos and notes."
---

# Import from Another Phone

Switching to GFX Phone from another phone script? The **Import** page (also step 4 of the
[setup wizard](setup-wizard.md)) brings your players' data along.

## What is imported

Phone numbers (as SIM cards), contacts, messages (text, photos, locations, payments, contact cards),
call history, photos and notes. Social apps, mail and voicemail of the old phone are not carried
over.

## Supported phones

The panel detects the old phone's tables in your database automatically and shows each source with
a status:

- **Verified** - qb-phone, gcphone, NPWD, sd-phone, lb-phone, Quasar Smartphone, YSeries and others
  whose storage format is public.
- **Beta** - phones whose format is only partly public (for example qs-smartphone-pro, GKSPhone,
  okokPhone, CodeM, Cylex Phone). These import only after a finished **dry run**.
- **Not supported** - recognised but not importable; the panel says why.

## How to import

1. Keep the old phone's database tables. Stop the old phone resource (the panel warns if it still
   runs).
2. Open **Import** in the panel and pick the source.
3. Run a **dry run**: it shows how many players, chats, contacts and photos would move, the reasons
   for anything skipped and a sample of converted phones - and writes nothing.
4. **Start** the import. Progress shows live; you can keep using the panel.

The import only reads the old tables. Running it again updates instead of duplicating. Per player it
keeps the newest 5000 messages, 500 calls, 2000 photos, 500 notes and 2000 contacts.
