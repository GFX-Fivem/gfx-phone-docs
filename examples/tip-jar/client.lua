-- Example custom app - client (https://github.com/GFX-Fivem/gfx-phone-docs)

local APP = 'tipjar'
local phone = exports['gfx-phone']

-- Fires once the phone is set up and again after every gfx-phone restart: register here.
AddEventHandler('gfx-phone:client:customAppsReady', function()
    local ok, err = phone:AddCustomApp({
        id = APP,
        label = { en = 'Tip Jar', tr = 'Bahşiş Kavanozu' },
        subtitle = 'Tip the street performers',
        developer = 'Example Studio',
        ui = 'ui/index.html',
        color = 'linear-gradient(160deg,#ffb340,#ff7a00)',
        ground = { light = '#fff8ef', dark = '#1d1408' },
        defaultApp = true,
        permissions = { 'notifications', 'island', 'camera', 'payments', 'location' },
        widgets = {
            { id = 'total', template = 'value', sizes = { 'small', 'medium' }, label = 'Tips today',
              data = { value = '$0', label = 'Tips today' } },
        },

        onOpen = function() print('[tipjar] opened') end,
        onClose = function() print('[tipjar] closed') end,

        -- GFXPhone.send(action, data) from the page lands here; the return value goes back.
        onMessage = function(action, data)
            if action == 'whoami' then
                return { name = GetPlayerName(PlayerId()), server = GetPlayerServerId(PlayerId()) }
            end
            return nil
        end,

        onIslandAction = function(key, button)
            if key == 'show' and button == 'stop' then
                phone:EndCustomAppIsland(APP, 'show')
            end
        end,
    })
    if not ok then print(('[tipjar] AddCustomApp failed: %s'):format(err)) end
end)

-- The page's own NUI callback (fetch(`https://${GFXPhone.resource}/startShow`)).
RegisterNUICallback('startShow', function(_, cb)
    phone:StartCustomAppIsland(APP, 'show', {
        leading = { icon = 'app' },
        trailing = 'LIVE',
        title = 'Your show is live',
        subtitle = 'Tips arrive here',
        buttons = { { id = 'stop', label = 'Stop', style = 'destructive' } },
    })
    cb({ ok = true })
end)

-- The server told us a tip arrived: notification + widget.
RegisterNetEvent('tipjar:client:tipped', function(amount, total)
    phone:SendCustomAppNotification(APP, { title = 'New tip', body = ('Someone tipped you $%s'):format(amount), data = { tab = 'history' } })
    phone:UpdateCustomAppWidget(APP, 'total', { value = ('$%s'):format(total), label = 'Tips today' })
end)
