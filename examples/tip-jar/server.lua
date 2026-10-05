-- Example custom app - server (https://github.com/GFX-Fivem/gfx-phone-docs)
--
-- Registering on the server too makes the server trust the app: payments are charged here and
-- reported to onPayment, and the admin panel's App access lists it.

local APP = 'tipjar'
local phone = exports['gfx-phone']
local totals = {} -- [src] = tips received today

local function register()
    phone:AddCustomApp({
        id = APP,
        label = { en = 'Tip Jar', tr = 'Bahşiş Kavanozu' },
        ui = 'ui/index.html',
        defaultApp = true,
        permissions = { 'notifications', 'island', 'camera', 'payments', 'location' },
        widgets = {
            { id = 'total', template = 'value', sizes = { 'small', 'medium' }, label = 'Tips today' },
        },
        -- A payment went through (GFXPhone.pay). Return false to refund it at once.
        onPayment = function(src, payment)
            local target = tonumber(payment.ref)
            if not target or not GetPlayerName(target) or target == src then return false end
            -- Pay the performer however your server pays people (framework money, an account...).
            totals[target] = (totals[target] or 0) + payment.amount
            TriggerClientEvent('tipjar:client:tipped', target, payment.amount, totals[target])
            return true
        end,
    })
end

-- gfx-phone may start after this resource, or restart: register again whenever it starts.
AddEventHandler('onResourceStart', function(res)
    if res == 'gfx-phone' or res == GetCurrentResourceName() then register() end
end)
CreateThread(function()
    if GetResourceState('gfx-phone') == 'started' then register() end
end)

-- Or charge a fixed amount the server decides (the page cannot change it):
--   local id = phone:CreateCustomAppPayment(src, APP, { amount = 50, label = 'VIP tip', ref = tostring(target) })
--   TriggerClientEvent('tipjar:client:pay', src, id) -> the page calls GFXPhone.pay({ paymentId = id })

AddEventHandler('gfx-phone:server:customAppPayment', function(src, appId, payment)
    if appId == APP then print(('[tipjar] %s paid %s (%s)'):format(src, payment.amount, payment.id)) end
end)
