-- Example custom app for GFX Phone (https://gfxscripts.com/phone).
-- Docs: https://github.com/GFX-FIVEM/gfx-phone-custom-apps . Copy this folder into your resources,
-- rename it if you like and `ensure` it after gfx-phone.
fx_version 'cerulean'
game 'gta5'

name 'gfx-phone-example-app'
description 'A custom app on the gfx-phone: notifications, island, widget, camera, Lemon Pay'

client_script 'client.lua'
server_script 'server.lua'

-- The page the phone shows (no ui_page: the phone loads it in its own frame).
files {
    'ui/index.html',
    'ui/app.js',
}

dependency 'gfx-phone'
