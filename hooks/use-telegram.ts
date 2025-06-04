"use client"

import { useEffect, useState } from "react"
import { telegramWebApp } from "@/lib/telegram"

export function useTelegram() {
  const [user, setUser] = useState(telegramWebApp.getUser())
  const [theme, setTheme] = useState(telegramWebApp.getTheme())
  const [isInTelegram, setIsInTelegram] = useState(false)

  useEffect(() => {
    setIsInTelegram(telegramWebApp.isInTelegram())
    setUser(telegramWebApp.getUser())
    setTheme(telegramWebApp.getTheme())
  }, [])

  return {
    user,
    theme,
    isInTelegram,
    isPremium: telegramWebApp.isPremiumUser(),
    haptic: telegramWebApp.hapticFeedback,
    setMainButton: telegramWebApp.setMainButton.bind(telegramWebApp),
    hideMainButton: telegramWebApp.hideMainButton.bind(telegramWebApp),
    setBackButton: telegramWebApp.setBackButton.bind(telegramWebApp),
    hideBackButton: telegramWebApp.hideBackButton.bind(telegramWebApp),
    showAlert: telegramWebApp.showAlert.bind(telegramWebApp),
    showConfirm: telegramWebApp.showConfirm.bind(telegramWebApp),
    saveToCloud: telegramWebApp.saveToCloud.bind(telegramWebApp),
    getFromCloud: telegramWebApp.getFromCloud.bind(telegramWebApp),
    close: telegramWebApp.close.bind(telegramWebApp),
    openLink: telegramWebApp.openLink.bind(telegramWebApp),
    sendData: telegramWebApp.sendData.bind(telegramWebApp),
    viewportHeight: telegramWebApp.getViewportHeight(),
    isExpanded: telegramWebApp.isExpanded(),
  }
}
