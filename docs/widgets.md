# Home-Screen Widgets for FiveM Phone Apps

Your custom app can offer iOS-style home-screen widgets on [GFX Phone](https://gfxscripts.com/phone).
The phone draws them from a template - your page is never loaded for a widget - so they cost nothing
while your app is closed and can be updated straight from Lua.

## Declare them

```lua
exports['gfx-phone']:AddCustomApp({
    id = 'bank',
    label = 'Bank',
    ui = 'ui/index.html',
    widgets = {
        { id = 'balance', template = 'value', sizes = { 'small', 'medium' },
          label = 'Balance', description = 'Your balance at a glance.',
          data = { value = '$0', label = 'Checking' } },          -- shown until you send data
        { id = 'recent', template = 'list', sizes = { 'medium' }, label = 'Recent payments' },
    },
})
```

- Up to **4 widgets** per app, `small` (2 x 2 icons) and / or `medium` (4 x 2).
- `label` / `description` show in the widget gallery (a string or one per language).
- Players add them like any widget: long-press the home screen > **+** > your app.

## Templates

| Template | Data fields |
|----------|-------------|
| `value` | `value` (big figure, up to 16 chars), `label`, `subtitle`, `title`, `tint` |
| `list` | `rows = { { title, detail? } }` (up to 4; small shows 2, medium 3), `title`, `tint` |
| `progress` | `progress` (0-1), `label`, `subtitle`, `title`, `tint` |
| `image` | `image` (https or your own file), `title`, `subtitle` |

`title` replaces the app name in the widget's header; `tint` is a CSS colour for the figure / bar.

## Update them

From Lua (client, or server for one player / everyone):

```lua
exports['gfx-phone']:UpdateCustomAppWidget('bank', 'balance', { value = '$12,450', label = 'Checking', tint = '#34c759' })

-- server
exports['gfx-phone']:UpdateCustomAppWidget(src, 'bank', 'recent', {
    rows = { { title = 'Burger Shot', detail = '-$18' }, { title = 'Salary', detail = '+$1,200' } },
})
exports['gfx-phone']:UpdateCustomAppWidget(-1, 'news', 'headline', { image = 'https://...', title = 'Breaking' })
```

From the page:

```js
GFXPhone.widgets.update('balance', { value: '$12,450', label: 'Checking' })
```

The newest content is kept on the client and comes back after a phone UI reload.

## Taps

Tapping a widget opens your app with the intent `{ widget: '<id>' }`:

```js
GFXPhone.on('intent', (data) => {
  if (data.widget === 'recent') showHistory()
})
```

When your resource stops, its widgets hide and keep their place on the home screen.

---

Part of the [GFX Phone Custom Apps SDK](../README.md) · [GFX Phone for FiveM](https://gfxscripts.com/phone) by [GFX Scripts](https://gfxscripts.com)
