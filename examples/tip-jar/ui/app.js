// Example custom app page (https://github.com/GFX-Fivem/gfx-phone-docs). Plain JS: CEF 103 runs ES2020.
const $ = (id) => document.getElementById(id)

// This resource's own NUI callbacks (client.lua RegisterNUICallback).
function nui(name, data) {
  return fetch(`https://${GFXPhone.resource}/${name}`, { method: 'POST', body: JSON.stringify(data || {}) }).then((r) => r.json())
}

async function main() {
  const ctx = await GFXPhone.ready()
  GFXPhone.applyTheme()
  GFXPhone.on('context', () => GFXPhone.applyTheme())

  // To this resource's client Lua (AddCustomApp onMessage).
  const me = await GFXPhone.send('whoami')
  $('hello').textContent = `Hi ${me.name} · ${ctx.network.online ? 'online' : 'offline'}`

  // A notification tap / OpenCustomApp / the widget hand an intent.
  GFXPhone.on('intent', (data) => console.log('opened with', data))

  $('tip').onclick = async () => {
    const amount = Number($('amount').value)
    const target = $('target').value.trim()
    if (!target || !(amount > 0)) return GFXPhone.ui.toast('Enter an id and an amount')
    const sure = await GFXPhone.ui.confirm({ title: 'Send a tip?', message: `$${amount} to #${target}`, confirm: 'Tip' })
    if (!sure) return
    try {
      // The server charges it and calls onPayment (server.lua) with ref = the performer.
      await GFXPhone.pay({ amount, label: 'Tip', ref: target })
      GFXPhone.ui.toast('Thank you!')
    } catch (e) {
      if (e.code !== 'cancelled') GFXPhone.ui.alert({ title: 'Payment failed', message: e.code })
    }
  }

  $('live').onclick = () => nui('startShow')

  $('photo').onclick = async () => {
    try {
      const photo = await GFXPhone.camera.takePhoto()
      $('shot').src = photo.url
      $('shot').style.display = 'block'
    } catch (e) {
      if (e.code !== 'cancelled') GFXPhone.ui.toast(e.code)
    }
  }
}

main().catch((e) => console.error('[tipjar]', e.code || e))
