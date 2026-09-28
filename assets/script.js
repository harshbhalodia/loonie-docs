document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle')
  const navLinks = document.getElementById('nav-links')

  navToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open')
    navToggle.setAttribute('aria-expanded', String(isOpen))
  })

  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open')
      navToggle?.setAttribute('aria-expanded', 'false')
    })
  })

  const copyBtn = document.getElementById('copy-btn')
  const installCmd = document.getElementById('install-cmd')

  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(installCmd.textContent.trim())
      const original = copyBtn.textContent
      copyBtn.textContent = 'Copied!'
      setTimeout(() => {
        copyBtn.textContent = original
      }, 1800)
    } catch {
      // Clipboard API unavailable (e.g. non-HTTPS/older browser) - fail silently, text is selectable.
    }
  })

  // Same manifest the in-app auto-updater reads, so the download button always points at the
  // current release without editing this page. Falls back to the GitHub installer folder.
  fetch('https://raw.githubusercontent.com/harshbhalodia/loonie/main/updater/latest.json', { cache: 'no-store' })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((latest) => {
      const url = latest?.platforms?.['windows-x86_64']?.url
      if (!url || !latest.version) return
      document.querySelectorAll('.js-download').forEach((a) => a.setAttribute('href', url))
      document.querySelectorAll('.js-version').forEach((el) => (el.textContent = `Version ${latest.version}`))
      document.querySelectorAll('.js-version-inline').forEach((el) => (el.textContent = `v${latest.version}`))
    })
    .catch(() => {})
})
