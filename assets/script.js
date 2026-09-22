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
})
