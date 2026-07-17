;(() => {
  const THEME_COOKIE_NAME = 'vite-ui-theme'
  const DEFAULT_THEME = 'system'

  const getCookie = (name) => {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const match = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'))
    return match ? decodeURIComponent(match[1]) : undefined
  }

  const rawTheme = getCookie(THEME_COOKIE_NAME)
  const theme =
    rawTheme === 'dark' || rawTheme === 'light' || rawTheme === 'system'
      ? rawTheme
      : DEFAULT_THEME

  const resolvedTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme

  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(resolvedTheme)
  root.style.colorScheme = resolvedTheme
})()
