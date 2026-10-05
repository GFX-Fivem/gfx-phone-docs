/*!
 * gfx-phone SDK - for custom apps shown on the GFX Phone (https://gfxscripts.com/phone).
 * Docs: https://github.com/GFX-FIVEM/gfx-phone-custom-apps
 *
 *   <script src="https://cfx-nui-gfx-phone/web/build/sdk/gfx-phone-sdk.js"></script>
 *   const ctx = await GFXPhone.ready()
 *
 * Your page runs in an iframe on the phone screen. It talks to the phone through window.postMessage
 * (only with the phone, only on the phone's origin) and to your own resource through your own NUI
 * callbacks: fetch(`https://${GFXPhone.resource}/myCallback`, { method: 'POST', body: JSON.stringify(data) }).
 * Plain ES2019, no dependencies. Types: gfx-phone-sdk.d.ts.
 */
;(function () {
  'use strict'
  if (window.GFXPhone) return

  var VERSION = 1
  var TIMEOUT = 15000
  var phoneResource = 'gfx-phone'
  var phoneOrigin = detectOrigin()
  var seq = 0
  var pending = {}
  var listeners = {}
  var context = null
  var readyPromise = null

  function detectOrigin() {
    try {
      if (window.location.ancestorOrigins && window.location.ancestorOrigins.length) return window.location.ancestorOrigins[0]
    } catch (e) {}
    try {
      if (document.referrer) return new URL(document.referrer).origin
    } catch (e) {}
    return 'https://cfx-nui-' + phoneResource
  }

  /** This page's own resource (cfx-nui-<resource>), for fetch(`https://${resource}/callback`). */
  function ownResource() {
    var m = /^cfx-nui-(.+)$/.exec(window.location.hostname)
    if (m) return m[1]
    try {
      if (typeof window.GetParentResourceName === 'function') return window.GetParentResourceName()
    } catch (e) {}
    return ''
  }

  function emit(event, data) {
    var list = listeners[event]
    if (!list) return
    list.slice().forEach(function (fn) {
      try {
        fn(data)
      } catch (err) {
        setTimeout(function () {
          throw err
        })
      }
    })
  }

  window.addEventListener('message', function (e) {
    if (e.source !== window.parent || e.origin !== phoneOrigin) return
    var d = e.data
    if (!d || d.gfx !== 'gfx-phone' || d.v !== VERSION) return
    if (typeof d.id === 'number') {
      var p = pending[d.id]
      if (!p) return
      delete pending[d.id]
      clearTimeout(p.timer)
      if (d.ok) p.resolve(d.result)
      else {
        var err = new Error((d.error && d.error.code) || 'failed')
        err.code = (d.error && d.error.code) || 'failed'
        p.reject(err)
      }
      return
    }
    if (typeof d.event === 'string') {
      if (d.event === 'context' && d.data) {
        context = d.data
        applyZoom()
      }
      emit(d.event, d.data)
    }
  })

  /** One request to the phone. timeout 0 = none (sheets the player answers). */
  function call(method, params, timeout) {
    return new Promise(function (resolve, reject) {
      var id = ++seq
      var ms = timeout === undefined ? TIMEOUT : timeout
      var timer = ms ? setTimeout(function () {
        delete pending[id]
        var err = new Error('timeout')
        err.code = 'timeout'
        reject(err)
      }, ms) : 0
      pending[id] = { resolve: resolve, reject: reject, timer: timer }
      window.parent.postMessage({ gfx: 'gfx-phone', v: VERSION, id: id, method: method, params: params || {} }, phoneOrigin)
    })
  }

  // The phone's CSS zoom may not reach into this frame on every CEF build: then this page's viewport
  // is the zoomed size and the page is zoomed here to the phone's layout width. Checked again on
  // every resize (the phone's scale follows the game window).
  var zoom = 1
  function applyZoom() {
    var fw = context && context.device && context.device.frameWidth
    var w = window.innerWidth
    if (!fw || !w) return
    var z = Math.abs(w - fw) / fw > 0.02 ? w / fw : 1
    if (Math.abs(z - zoom) < 0.001) return
    zoom = z
    document.documentElement.style.zoom = z === 1 ? '' : String(z)
  }
  window.addEventListener('resize', applyZoom)

  // Typing in a text field: the phone keeps the keyboard (the player does not walk) until it leaves.
  function isTextField(el) {
    if (!el) return false
    if (el.isContentEditable || el.tagName === 'TEXTAREA') return true
    if (el.tagName !== 'INPUT') return false
    return !/^(button|checkbox|color|file|hidden|image|radio|range|reset|submit)$/i.test(el.type || '') && !el.readOnly && !el.disabled
  }
  var typing = false
  function syncTyping() {
    var now = isTextField(document.activeElement)
    if (now === typing) return
    typing = now
    call('setTyping', { typing: now }).catch(function () {})
  }
  document.addEventListener('focusin', syncTyping)
  document.addEventListener('focusout', function () {
    setTimeout(syncTyping, 0)
  })
  // Escape (put the phone away) and Backspace outside a text field (back) belong to the phone.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || (e.key === 'Backspace' && !isTextField(document.activeElement) && !e.repeat)) {
      call('key', { key: e.key }).catch(function () {})
    }
  })

  function applyTheme(target) {
    var root = target || document.documentElement
    var c = context
    if (!c) return
    var colors = (c.theme && c.theme.colors) || {}
    Object.keys(colors).forEach(function (k) {
      if (colors[k]) root.style.setProperty('--gfx-' + k.replace(/[A-Z]/g, function (m) { return '-' + m.toLowerCase() }), colors[k])
    })
    root.style.setProperty('--gfx-text-scale', String((c.theme && c.theme.textScale) || 1))
    root.style.colorScheme = (c.theme && c.theme.mode) || 'light'
    root.setAttribute('data-theme', (c.theme && c.theme.mode) || 'light')
    if (c.locale) {
      root.setAttribute('lang', c.locale.language || 'en')
      root.setAttribute('dir', c.locale.rtl ? 'rtl' : 'ltr')
    }
  }

  var api = {
    version: VERSION,
    /** Your resource's name (for your own NUI callbacks). */
    resource: ownResource(),
    /** The latest context (null before ready()). */
    get context() {
      return context
    },
    /** If the phone resource was renamed on this server. Call before ready(). */
    configure: function (opts) {
      if (opts && opts.phoneResource) {
        phoneResource = String(opts.phoneResource)
        phoneOrigin = 'https://cfx-nui-' + phoneResource
      }
    },
    /** Resolves with the context once the phone answered. Call it first. */
    ready: function () {
      if (!readyPromise) {
        readyPromise = call('hello', { sdk: VERSION }).then(function (ctx) {
          context = ctx
          applyZoom()
          return ctx
        })
      }
      return readyPromise
    },
    getContext: function () {
      return call('getContext').then(function (ctx) {
        context = ctx
        return ctx
      })
    },
    /** Events: context, open, foreground, background, intent, message, islandAction. */
    on: function (event, fn) {
      ;(listeners[event] = listeners[event] || []).push(fn)
      return function () {
        api.off(event, fn)
      }
    },
    off: function (event, fn) {
      var list = listeners[event]
      if (list) listeners[event] = list.filter(function (f) { return f !== fn })
    },
    /** Sets --gfx-* CSS variables, color-scheme, data-theme, lang and dir from the phone (call again on 'context'). */
    applyTheme: applyTheme,

    close: function () { return call('close') },
    openApp: function (id) { return call('openApp', { id: id }) },
    setBadge: function (count) { return call('setBadge', { count: count }) },
    /** To your own client Lua (AddCustomApp onMessage) - or fetch your own NUI callbacks directly. */
    send: function (action, data) { return call('send', { action: action, data: data }) },
    state: {
      get: function (key) { return call('state.get', { key: key }) },
      set: function (key, value) { return call('state.set', { key: key, value: value }) },
    },

    notify: function (n) { return call('notify', n) },
    island: {
      start: function (key, activity) { return call('island.start', { key: key, activity: activity }) },
      update: function (key, activity) { return call('island.update', { key: key, activity: activity }) },
      end: function (key) { return call('island.end', { key: key }) },
    },
    widgets: {
      update: function (widget, data) { return call('widgets.update', { widget: widget, data: data }) },
    },

    network: { status: function () { return call('network.status') } },
    battery: { status: function () { return call('battery.status') } },

    camera: { takePhoto: function () { return call('camera.takePhoto', {}, 0) } },
    gallery: { pick: function (opts) { return call('gallery.pick', opts || {}, 0) } },
    auth: { verifyPasscode: function () { return call('auth.verifyPasscode', {}, 0) } },
    passwords: {
      save: function (entry) { return call('passwords.save', entry, 0) },
      autofill: function () { return call('passwords.autofill', {}, 0) },
    },
    /** pay({ amount, label, ref? }) or pay({ paymentId }) (your server's CreateCustomAppPayment). */
    pay: function (req) { return call('pay', req, 120000) },
    location: {
      get: function () { return call('location.get', {}, 0) },
      setWaypoint: function (x, y) { return call('location.setWaypoint', { x: x, y: y }) },
    },
    contacts: {
      pick: function () { return call('contacts.pick', {}, 0) },
      message: function (number, text) { return call('contacts.message', { number: number, text: text }) },
      call: function (number, name) { return call('contacts.call', { number: number, name: name }, 0) },
    },
    share: function (req) { return call('share', req, 0) },
    ui: {
      alert: function (opts) { return call('ui.alert', opts, 0) },
      confirm: function (opts) { return call('ui.confirm', opts, 0) },
      actionSheet: function (opts) { return call('ui.actionSheet', opts, 0) },
      toast: function (text) { return call('ui.toast', { text: text }) },
      /** 'dark' = dark icons (a light page), 'light' = light icons, null = automatic. */
      setStatusBar: function (style) { return call('ui.setStatusBar', { style: style }) },
    },
  }

  window.GFXPhone = api
})()
