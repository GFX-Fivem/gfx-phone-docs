---
title: Special Numbers
parent: Developers
nav_order: 5
description: "GFX Phone special numbers for FiveM: phone numbers your script answers - hotlines, IVR menus with the keypad, hold music, custom sounds and server events, set up in config.lua or with exports."
---

# Special Numbers
{: .no_toc }

A special number is a phone number that is not a player's phone but a line **your script answers**:
a hotline, a taxi company's automated desk, a radio show's request line, a bank's menu, a mission
contact. Dialled, it never falls to "the number you are calling cannot be reached". Instead it:

- rings for a moment, then answers (the call timer runs, the line's name shows on the call screen),
- can play a sound in the caller's earpiece (a recording, hold music, a menu prompt),
- hears the keypad, so you can build a "press 1 for..." menu,
- tells your scripts when it starts, on every key and when it ends,
- ends when the caller hangs up, when the sound ends, after a time limit, or when your script ends it.

A player on a special line is busy for real calls, and the call lands in their Recents like any other.

1. TOC
{:toc}

---

## In config.lua (no code)

```lua
Config.Calls.SpecialNumbers = {
    ['555-0100'] = {
        label = 'Weazel News hotline',
        ringSeconds = 2,
        audio = 'https://example.com/hotline.mp3', -- or 'nui://my-resource/sounds/a.mp3'
        hangupAfterAudio = true,
        event = 'my-resource:hotline', -- optional: a server event for your script
    },
}
```

With `event`, your script hears the line through one server event:

```lua
AddEventHandler('my-resource:hotline', function(src, kind, data)
    -- kind = 'start' | 'key' | 'end'
    -- data = { call = { id, number, caller, hidden, startedAt }, key = '1' (on 'key'), reason (on 'end') }
end)
```

## From your resource (exports)

Register a line from the server side of your resource, with callbacks. It goes away by itself when
your resource stops.

```lua
local phone = exports['gfx-phone']

phone:RegisterSpecialNumber('555-0199', {
    label = 'Downtown Cab Co.',
    ringSeconds = 3,
    audio = 'nui://my-taxi/sounds/welcome.mp3', -- "press 1 for a cab, 2 for the office"

    onStart = function(src, call) end,

    onKey = function(src, key, call)
        if key == '1' then
            phone:PlaySpecialCallAudio(src, 'nui://my-taxi/sounds/on-the-way.mp3')
            TriggerEvent('my-taxi:dispatch', src)
            SetTimeout(4000, function() phone:EndSpecialCall(src) end)
        elseif key == '2' then
            phone:PlaySpecialCallAudio(src, 'nui://my-taxi/sounds/hold.mp3', { loop = true })
        end
    end,

    onEnd = function(src, reason, call) end,
})
```

A file in your own resource is played with `nui://<your resource>/<path>`; list it under `files` in
your `fxmanifest.lua` so the client downloads it.

## Line options

| Field | Default | |
|---|---|---|
| `label` | the number | Name on the call screen (a saved contact name wins) |
| `ringSeconds` | `2` | Rings this long before it answers (0 - 30) |
| `audio` | none | Played once it answers: `https://...`, `nui://<resource>/<file>`, or a path inside gfx-phone's web build |
| `audioLoop` | `false` | Repeat the sound (hold music) |
| `volume` | `0.8` | 0 - 1 |
| `hangupAfterAudio` | `false` | The line hangs up when the sound ends |
| `maxSeconds` | `0` | Hangs up after this many seconds connected (0 = never) |
| `event` | none | (config) server event `(src, kind, data)` for `start` / `key` / `end` |
| `onStart(src, call)` | none | (export) the line answered |
| `onKey(src, key, call)` | none | (export) a keypad digit: `0`-`9`, `*`, `#` |
| `onEnd(src, reason, call)` | none | (export) the call ended |

`call` = `{ id, number, caller, hidden, startedAt }` - `caller` is the caller's own number (`''` when
they withheld it). End `reason`: `hangup` (the caller), `script` (`EndSpecialCall`), `audio` (the
sound ended, `hangupAfterAudio`), `timeout` (`maxSeconds`), `dropped` (the caller left the server),
`removed` (`RemoveSpecialNumber`).

## Exports

All on the server, on `exports['gfx-phone']`.

| Export | |
|---|---|
| `RegisterSpecialNumber(number, def)` | Registers a line -> `true`, or `false` + `'invalidNumber'` / `'invalidDefinition'` / `'invalidAudio'` |
| `RemoveSpecialNumber(number)` | Removes it (a live call on it ends with `removed`) |
| `IsSpecialNumber(number)` | `true` for a config or registered line |
| `PlaySpecialCallAudio(src, url, { loop?, volume? })` | Plays a sound in that caller's earpiece (replaces the one playing) |
| `StopSpecialCallAudio(src)` | Stops it |
| `EndSpecialCall(src)` | Hangs the line up |
| `GetSpecialCall(src)` | `{ id, number, caller, hidden, startedAt }` while `src` is on a special line, else `nil` |

## Events

Every special call also fires these server events, for any resource to hear:

| Event | Arguments |
|---|---|
| `gfx-phone:specialCall:started` | `src, number, call` |
| `gfx-phone:specialCall:key` | `src, number, key, call` |
| `gfx-phone:specialCall:ended` | `src, number, reason, call` |

## Good to know

- A number is matched by its digits: `555-0100`, `5550100` and `555 0100` are the same line.
- A special number wins over a player who happens to own the same number.
- Emergency and service codes (`911`, ... from `Config.Services`) open the Services app before a call
  is placed, so they cannot be special numbers.
- Call recording does not work on a special line - there is no phone on the other end.
