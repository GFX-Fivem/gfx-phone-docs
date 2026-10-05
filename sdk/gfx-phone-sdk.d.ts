/**
 * GFX Phone SDK types - https://github.com/GFX-Fivem/gfx-phone-docs (GFX Phone: https://gfxscripts.com/phone). Load the script from
 * https://cfx-nui-gfx-phone/web/build/sdk/gfx-phone-sdk.js; it sets `window.GFXPhone`.
 *
 * Every call returns a Promise. A refused call rejects with an Error whose `code` is one of
 * GFXPhoneErrorCode. Calls that show the player a sheet (camera, gallery, passcode, passwords, pay,
 * location, contacts, share, alert / confirm / actionSheet) only work while your app is the one on
 * screen and have no timeout; the player answers them.
 */

export type GFXPhoneErrorCode =
  | 'timeout'
  | 'unknownMethod'
  | 'unavailable'
  | 'notPermitted'
  | 'notActive'
  | 'rateLimited'
  | 'tooLarge'
  | 'invalid'
  | 'cancelled'
  | 'busy'
  | 'denied'
  | 'notFound'
  | 'noMoney'
  | 'overLimit'
  | 'refused'
  | 'failed'

export interface GFXPhoneError extends Error {
  code: GFXPhoneErrorCode
}

export type GFXPhonePermission =
  | 'notifications'
  | 'island'
  | 'camera'
  | 'photos'
  | 'passcode'
  | 'passwords'
  | 'payments'
  | 'location'
  | 'contacts'

export interface GFXPhoneNetwork {
  /** Can reach the internet (cell service or Wi-Fi, not in airplane mode). */
  online: boolean
  /** Has cell service (a SIM and coverage). */
  service: boolean
  wifi: boolean
  wifiName?: string
  /** 0-4 bars. */
  signal: number
  airplane: boolean
  noSim: boolean
}

export interface GFXPhoneBattery {
  /** 0-100. */
  level: number
  charging: boolean
  lowPower: boolean
}

export interface GFXPhoneContext {
  app: { id: string; name: string }
  /** Your app is the one on screen. */
  active: boolean
  theme: {
    mode: 'light' | 'dark'
    accent?: string
    material?: string
    fontFamily?: string
    /** Multiply font sizes by this (accessibility text size). */
    textScale: number
    reduceMotion: boolean
    /** The phone's colours (applyTheme() sets them as --gfx-<kebab-name> CSS variables). */
    colors: {
      label: string
      labelSecondary: string
      labelTertiary: string
      background: string
      groupedBackground: string
      fill: string
      separator: string
      tint: string
      blue: string
    }
  }
  locale: {
    /** Phone language code: en tr de fr pt ar nl es th ro cs it pl, or a server-added one. */
    language: string
    rtl: boolean
    /** BCP-47 tag for Intl / toLocaleString. */
    dateLocale: string
    currency: { symbol: string }
  }
  device: {
    width: number
    height: number
    /** Keep content clear of the status bar / Lemon Pulse and the home indicator. */
    safeTop: number
    safeBottom: number
    /** Your frame's width in the phone's layout pixels. */
    frameWidth: number
  }
  network: GFXPhoneNetwork
  battery: GFXPhoneBattery
}

export interface GFXPhoneNotification {
  title: string
  body?: string
  /** Same id replaces the earlier notification. */
  id?: string
  /** A picture in the notification: https or your own NUI file. */
  image?: string
  /** Notifications with the same group stack together. */
  group?: string
  /** Comes back in the `intent` event's data when the player taps it (an object, max 4 KB). */
  data?: Record<string, unknown>
}

export interface GFXPhoneIslandActivity {
  /** Left side of the compact island: 'app' (your icon), an image URL, and/or a short text. */
  leading?: string | { icon?: 'app' | string; text?: string }
  /** Right side: a short text (max 12), its colour, or a 0-1 progress ring. */
  trailing?: string | { text?: string; color?: string; progress?: number }
  title?: string
  subtitle?: string
  /** 0-1 bar on the expanded island. */
  progress?: number
  /** Up to two; a tap fires `islandAction` { key, button }. */
  buttons?: { id: string; label: string; style?: 'default' | 'destructive' }[]
  /** #hex or rgb(a). */
  tint?: string
}

export interface GFXPhonePhoto {
  /** Uploaded image URL. */
  url: string
}

export interface GFXPhonePasswordEntry {
  username: string
  password: string
  /** Shown in the Passwords app; defaults to your app name. */
  label?: string
}

export interface GFXPhonePayment {
  id: string
  amount: number
  /** The player's balance after the payment. */
  balance?: number
}

export interface GFXPhoneContact {
  name: string
  number: string
  avatar?: string
}

export interface GFXPhoneSheetOption {
  id: string
  label: string
  style?: 'default' | 'destructive'
}

export interface GFXPhoneWidgetData {
  /** template 'value': the big text and its caption. */
  value?: string
  label?: string
  /** template 'list': up to 4 rows. */
  rows?: { title: string; detail?: string }[]
  /** template 'progress': 0-1. */
  progress?: number
  /** template 'image': https or your own NUI file. */
  image?: string
  title?: string
  subtitle?: string
  tint?: string
}

export type GFXPhoneEvent =
  | 'context'
  | 'open'
  | 'foreground'
  | 'background'
  | 'intent'
  | 'message'
  | 'islandAction'

export interface GFXPhoneSDK {
  readonly version: 1
  /** Your resource's name, for your own NUI callbacks: fetch(`https://${GFXPhone.resource}/x`). */
  readonly resource: string
  /** The latest context (null before ready()). */
  readonly context: GFXPhoneContext | null

  /** Only when the phone resource is not called gfx-phone on this server. Call before ready(). */
  configure(opts: { phoneResource?: string }): void
  /** Call first: resolves with the context once the phone answered. */
  ready(): Promise<GFXPhoneContext>
  getContext(): Promise<GFXPhoneContext>
  on(event: 'context', fn: (ctx: GFXPhoneContext) => void): () => void
  on(event: 'intent', fn: (data: unknown) => void): () => void
  on(event: 'message', fn: (msg: { action: string; data: unknown }) => void): () => void
  on(event: 'islandAction', fn: (e: { key: string; button: string }) => void): () => void
  on(event: 'open' | 'foreground' | 'background', fn: () => void): () => void
  off(event: GFXPhoneEvent, fn: (...args: never[]) => void): void
  /** Sets --gfx-* variables, color-scheme, data-theme, lang and dir on `target` (default <html>). */
  applyTheme(target?: HTMLElement): void

  /** Back to the home screen. */
  close(): Promise<void>
  /** Opens another installed app by id. */
  openApp(id: string): Promise<void>
  /** 0 clears it. */
  setBadge(count: number): Promise<void>
  /** To your client Lua's onMessage(action, data); resolves with what it returns. */
  send<T = unknown>(action: string, data?: unknown): Promise<T>
  /** Values kept while the game runs (across put-away / reopen), 64 KB per app. */
  state: {
    get<T = unknown>(key: string): Promise<T | null>
    set(key: string, value: unknown): Promise<void>
  }

  notify(n: GFXPhoneNotification): Promise<{ id: string }>
  island: {
    start(key: string, activity: GFXPhoneIslandActivity): Promise<void>
    update(key: string, activity: GFXPhoneIslandActivity): Promise<void>
    end(key: string): Promise<void>
  }
  widgets: {
    /** Data for one of the widgets your registration declares (`widgets = { { id = ... } }`). */
    update(widget: string, data: GFXPhoneWidgetData): Promise<void>
  }

  network: { status(): Promise<GFXPhoneNetwork> }
  battery: { status(): Promise<GFXPhoneBattery> }

  /** The phone's Camera over your app; resolves with the uploaded shot. */
  camera: { takePhoto(): Promise<GFXPhonePhoto> }
  gallery: { pick(opts?: { max?: number }): Promise<GFXPhonePhoto[]> }
  /** Resolves true when the player entered their passcode (also true when they have none). */
  auth: { verifyPasscode(): Promise<boolean> }
  passwords: {
    /** Asks to save a login in the Passwords app; true when the player saved it. */
    save(entry: GFXPhonePasswordEntry): Promise<boolean>
    /** The player picks one of the logins they saved for your app (notFound: none saved). */
    autofill(): Promise<{ username: string; password: string }>
  }
  /** Lemon Pay. A free amount (up to the server's limit) or a payment your server created. */
  pay(req: { amount: number; label: string; ref?: string } | { paymentId: string }): Promise<GFXPhonePayment>
  location: {
    /** Asks for permission the first time (the answer is kept; Settings > your app changes it).
     * denied: refused, or Location Services is off. */
    get(): Promise<{ x: number; y: number; z: number; street?: string; zone?: string }>
    setWaypoint(x: number, y: number): Promise<void>
  }
  contacts: {
    pick(): Promise<GFXPhoneContact>
    /** Opens Messages with the text ready to send. */
    message(number: string, text?: string): Promise<void>
    /** Asks the player, then calls. */
    call(number: string, name?: string): Promise<boolean>
  }
  /** true when the player shared it (Messages or Copy). */
  share(req: { text?: string; url?: string; image?: string }): Promise<boolean>
  ui: {
    alert(opts: { title: string; message?: string; button?: string }): Promise<void>
    confirm(opts: { title: string; message?: string; confirm?: string; cancel?: string; destructive?: boolean }): Promise<boolean>
    /** The chosen option's id, or null when cancelled. */
    actionSheet(opts: { title?: string; message?: string; options: GFXPhoneSheetOption[] }): Promise<string | null>
    toast(text: string): Promise<void>
    /** 'dark' = dark icons (a light page), 'light' = light icons, null = automatic. */
    setStatusBar(style: 'dark' | 'light' | null): Promise<void>
  }
}

declare global {
  interface Window {
    GFXPhone: GFXPhoneSDK
  }
  const GFXPhone: GFXPhoneSDK
}
