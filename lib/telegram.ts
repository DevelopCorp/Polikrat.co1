// Telegram WebApp integration utilities
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        close: () => void
        expand: () => void
        enableClosingConfirmation: () => void
        disableClosingConfirmation: () => void
        onEvent: (eventType: string, eventHandler: () => void) => void
        offEvent: (eventType: string, eventHandler: () => void) => void
        sendData: (data: string) => void
        openLink: (url: string) => void
        openTelegramLink: (url: string) => void
        showPopup: (params: {
          title?: string
          message: string
          buttons?: Array<{ id?: string; type?: string; text: string }>
        }) => void
        showAlert: (message: string) => void
        showConfirm: (message: string) => void
        showScanQrPopup: (params: { text?: string }) => void
        closeScanQrPopup: () => void
        readTextFromClipboard: () => Promise<string>
        requestWriteAccess: () => Promise<boolean>
        requestContact: () => Promise<boolean>
        invokeCustomMethod: (method: string, params: any) => Promise<any>

        // Properties
        initData: string
        initDataUnsafe: {
          query_id?: string
          user?: {
            id: number
            is_bot?: boolean
            first_name: string
            last_name?: string
            username?: string
            language_code?: string
            is_premium?: boolean
            photo_url?: string
          }
          receiver?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            photo_url?: string
          }
          chat?: {
            id: number
            type: string
            title?: string
            username?: string
            photo_url?: string
          }
          chat_type?: string
          chat_instance?: string
          start_param?: string
          can_send_after?: number
          auth_date: number
          hash: string
        }
        version: string
        platform: string
        colorScheme: "light" | "dark"
        themeParams: {
          bg_color?: string
          text_color?: string
          hint_color?: string
          link_color?: string
          button_color?: string
          button_text_color?: string
          secondary_bg_color?: string
          header_bg_color?: string
          accent_text_color?: string
          section_bg_color?: string
          section_header_text_color?: string
          subtitle_text_color?: string
          destructive_text_color?: string
        }
        isExpanded: boolean
        viewportHeight: number
        viewportStableHeight: number
        isClosingConfirmationEnabled: boolean
        headerColor: string
        backgroundColor: string
        isVersionAtLeast: (version: string) => boolean

        // Buttons
        MainButton: {
          text: string
          color: string
          textColor: string
          isVisible: boolean
          isActive: boolean
          isProgressVisible: boolean
          setText: (text: string) => void
          onClick: (callback: () => void) => void
          offClick: (callback: () => void) => void
          show: () => void
          hide: () => void
          enable: () => void
          disable: () => void
          showProgress: (leaveActive?: boolean) => void
          hideProgress: () => void
          setParams: (params: {
            text?: string
            color?: string
            text_color?: string
            is_active?: boolean
            is_visible?: boolean
          }) => void
        }

        BackButton: {
          isVisible: boolean
          onClick: (callback: () => void) => void
          offClick: (callback: () => void) => void
          show: () => void
          hide: () => void
        }

        SettingsButton: {
          isVisible: boolean
          onClick: (callback: () => void) => void
          offClick: (callback: () => void) => void
          show: () => void
          hide: () => void
        }

        HapticFeedback: {
          impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void
          notificationOccurred: (type: "error" | "success" | "warning") => void
          selectionChanged: () => void
        }

        CloudStorage: {
          setItem: (key: string, value: string) => Promise<boolean>
          getItem: (key: string) => Promise<string>
          getItems: (keys: string[]) => Promise<{ [key: string]: string }>
          removeItem: (key: string) => Promise<boolean>
          removeItems: (keys: string[]) => Promise<boolean>
          getKeys: () => Promise<string[]>
        }
      }
    }
  }
}

export class TelegramWebApp {
  private static instance: TelegramWebApp
  private webApp: typeof window.Telegram.WebApp | null = null

  private constructor() {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      this.webApp = window.Telegram.WebApp
      this.webApp.ready()
      this.webApp.expand()
    }
  }

  static getInstance(): TelegramWebApp {
    if (!TelegramWebApp.instance) {
      TelegramWebApp.instance = new TelegramWebApp()
    }
    return TelegramWebApp.instance
  }

  // User data
  getUser() {
    return this.webApp?.initDataUnsafe?.user || null
  }

  getUserId(): number | null {
    return this.webApp?.initDataUnsafe?.user?.id || null
  }

  isPremiumUser(): boolean {
    return this.webApp?.initDataUnsafe?.user?.is_premium || false
  }

  // Theme integration
  getTheme() {
    return {
      colorScheme: this.webApp?.colorScheme || "light",
      themeParams: this.webApp?.themeParams || {},
    }
  }

  // Haptic feedback
  hapticFeedback = {
    light: () => this.webApp?.HapticFeedback.impactOccurred("light"),
    medium: () => this.webApp?.HapticFeedback.impactOccurred("medium"),
    heavy: () => this.webApp?.HapticFeedback.impactOccurred("heavy"),
    success: () => this.webApp?.HapticFeedback.notificationOccurred("success"),
    error: () => this.webApp?.HapticFeedback.notificationOccurred("error"),
    warning: () => this.webApp?.HapticFeedback.notificationOccurred("warning"),
    selection: () => this.webApp?.HapticFeedback.selectionChanged(),
  }

  // Main button control
  setMainButton(params: {
    text: string
    onClick: () => void
    color?: string
    isActive?: boolean
  }) {
    if (!this.webApp?.MainButton) return

    this.webApp.MainButton.setText(params.text)
    this.webApp.MainButton.onClick(params.onClick)

    if (params.color) {
      this.webApp.MainButton.color = params.color
    }

    if (params.isActive !== undefined) {
      if (params.isActive) {
        this.webApp.MainButton.enable()
      } else {
        this.webApp.MainButton.disable()
      }
    }

    this.webApp.MainButton.show()
  }

  hideMainButton() {
    this.webApp?.MainButton.hide()
  }

  // Back button control
  setBackButton(onClick: () => void) {
    if (!this.webApp?.BackButton) return

    this.webApp.BackButton.onClick(onClick)
    this.webApp.BackButton.show()
  }

  hideBackButton() {
    this.webApp?.BackButton.hide()
  }

  // Cloud storage
  async saveToCloud(key: string, value: string): Promise<boolean> {
    try {
      return (await this.webApp?.CloudStorage.setItem(key, value)) || false
    } catch (error) {
      console.error("Failed to save to cloud storage:", error)
      return false
    }
  }

  async getFromCloud(key: string): Promise<string | null> {
    try {
      return (await this.webApp?.CloudStorage.getItem(key)) || null
    } catch (error) {
      console.error("Failed to get from cloud storage:", error)
      return null
    }
  }

  // Utilities
  showAlert(message: string) {
    this.webApp?.showAlert(message)
  }

  showConfirm(message: string, callback: (confirmed: boolean) => void) {
    this.webApp?.showPopup({
      message,
      buttons: [
        { id: "cancel", type: "cancel", text: "Cancel" },
        { id: "ok", type: "ok", text: "OK" },
      ],
    })
  }

  close() {
    this.webApp?.close()
  }

  openLink(url: string) {
    this.webApp?.openLink(url)
  }

  sendData(data: any) {
    this.webApp?.sendData(JSON.stringify(data))
  }

  // Check if running in Telegram
  isInTelegram(): boolean {
    return !!this.webApp
  }

  // Get viewport info
  getViewportHeight(): number {
    return this.webApp?.viewportHeight || window.innerHeight
  }

  isExpanded(): boolean {
    return this.webApp?.isExpanded || false
  }
}

export const telegramWebApp = TelegramWebApp.getInstance()
