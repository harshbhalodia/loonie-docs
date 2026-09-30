document.documentElement.classList.add('js')

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

  initReveal()

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

// Fades sections in as they scroll into view; content stays visible if IntersectionObserver is missing.
function initReveal() {
  const items = document.querySelectorAll('.reveal')
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'))
    return
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-in')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.2 },
  )
  items.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 90}ms`
    observer.observe(el)
  })
}
