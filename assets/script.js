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
  initStoryDemo()

  // Reads the href at click time so it reports the real installer URL once latest.json has loaded.
  document.querySelectorAll('.js-download').forEach((a) => {
    a.addEventListener('click', () => {
      if (typeof gtag !== 'function') return
      const url = a.getAttribute('href') || ''
      gtag('event', 'file_download', {
        file_name: url.split('/').pop(),
        link_url: url,
        link_id: a.closest('#download') ? 'download_section' : 'hero',
        platform: 'windows',
      })
    })
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

function initStoryDemo() {
  const root = document.getElementById('demo')
  if (!root) return

  const scenarios = [
    {
      prompt: 'Is it worth applying for an AMEX Moneyback credit card in my current situation?',
      steps: [
        { action: true, title: 'Research the exact card and current terms', detail: 'Confirm your country and product. Check official fees, reward caps, exclusions and merchant acceptance; flag missing sources.' },
        { ctx: ['cashflow', 'budget'], title: 'Match benefits to your actual spending', detail: 'Estimate eligible rewards from your categories, rather than assuming every purchase earns cashback.' },
        { ctx: ['runway', 'goals'], title: 'Check whether another card fits your life', detail: 'Include repayment habits, upcoming borrowing and your existing cards.' },
        { action: true, title: 'Compare net value, not the headline offer', detail: 'Subtract fees and potential interest. Separate one-off welcome offers from ongoing value.' },
      ],
      result: { title: 'Apply only if the ongoing value stacks up', body: 'In this example, $180 in eligible annual rewards minus a $120 fee leaves $60 before interest. Verify the actual terms and compare with your current card before applying.', cta: 'Decision: verify terms first' },
      tiles: [['Example rewards', '$180/yr'], ['Example fee', '$120/yr'], ['Net before interest', '$60/yr']],
      generic: 'An AI tool can research card terms. Loonie adds your spending, existing commitments and goals to assess whether the offer fits you.',
    },
    {
      prompt: 'Would changing my payment approach help me get better rewards?',
      steps: [
        { ctx: ['cashflow', 'budget'], title: 'Review where and how you pay', detail: 'Group recurring bills and purchases by merchant, category and current payment method.' },
        { action: true, title: 'Compare eligible payment options', detail: 'Check reward rates, caps, exclusions, payment fees and acceptance against verified terms.' },
        { ctx: ['goals', 'runway'], title: 'Keep spending and repayments unchanged', detail: 'Only reroute purchases you already make; no extra spending or carried balances to chase rewards.' },
        { action: true, title: 'Calculate the benefit after costs', detail: 'Exclude payments where a surcharge exceeds the extra reward.' },
      ],
      result: { title: 'Change the payment route, not your lifestyle', body: 'Illustratively, moving $600/month of eligible spending from 1% to 2% earns $6/month more, before any fees. Keep full repayments and skip surcharge-heavy payments.', cta: 'Review eligible payments' },
      tiles: [['Eligible spend', '$600/mo'], ['Rate uplift', '1 point'], ['Before fees', '+$6/mo']],
      generic: 'Reward advice becomes useful when it accounts for your merchants, payment fees and repayment habits, not just advertised rates.',
    },
    {
      prompt: 'What if my salary is reduced by 20%?',
      steps: [
        { ctx: ['cashflow'], title: 'Separate gross salary from take-home income', detail: 'Confirm which salary changes and when. This example assumes take-home pay falls from $5,000 to $4,000/month.' },
        { ctx: ['budget'], title: 'Protect essential commitments', detail: 'With $3,600/month of expenses, the monthly surplus falls from $1,400 to $400.' },
        { ctx: ['goals', 'runway'], title: 'Recheck savings goals and your buffer', detail: 'Compare planned contributions with the lower surplus and review your emergency reserve.' },
        { action: true, title: 'Model adjustments before changing your plan', detail: 'Compare slower goal funding and optional expense reductions in a what-if scenario.' },
      ],
      result: { title: 'Essentials hold. Your goals need a new pace.', body: 'This example still has a $400 monthly surplus, but $1,000 less room for savings. Adjust contributions and target dates before using your emergency fund.', cta: 'Review the lower-income scenario' },
      tiles: [['Income change', '-20%'], ['Expenses', '$3,600/mo'], ['New surplus', '$400/mo']],
      generic: 'A salary shock needs your actual income, committed spending and goal timelines. A percentage alone cannot show what you can still afford.',
    },
    {
      prompt: 'What should my investment strategy be based on current market conditions?',
      steps: [
        { action: true, title: 'Check dated market sources', detail: 'Review available rate, inflation and market information. Without fresh sources, flag the gap rather than claiming live knowledge.' },
        { ctx: ['allocation', 'networth'], title: 'Review your portfolio concentration', detail: 'Compare your holdings with your chosen target allocation and identify outsized exposures.' },
        { ctx: ['goals', 'runway'], title: 'Anchor the strategy to your time horizon', detail: 'Separate money needed soon from long-term investments and confirm your risk tolerance.' },
        { action: true, title: 'Compare scenarios, not predictions', detail: 'Consider a market decline, flat returns and recovery, including fees and tax implications.' },
      ],
      result: { title: 'A plan for your horizon, not a market bet', body: 'In this example, protect near-term goal money and assess rebalancing toward your existing target. Current headlines do not justify guaranteed returns or an automatic buy/sell decision.', cta: 'Review allocation and assumptions' },
      tiles: [['Market sources', 'Verify dates'], ['Near-term goals', 'Protect'], ['Long-term plan', 'Diversify']],
      generic: 'AI tools can explain markets. A personal strategy also needs your holdings, liquidity needs, risk tolerance and investment horizon.',
    },
    {
      prompt: 'Optimise my expenses by 10% without affecting my key budgets.',
      steps: [
        { ctx: ['budget', 'goals'], title: 'Confirm which budgets are protected', detail: 'Keep housing, health, learning and other categories you mark as essential unchanged.' },
        { ctx: ['cashflow'], title: 'Calculate a realistic savings target', detail: 'For $3,000/month of expenses, a 10% reduction means finding $300/month.' },
        { action: true, title: 'Look for waste before cutting priorities', detail: 'Review unused subscriptions, duplicate services, avoidable fees and renegotiable bills.' },
        { ctx: ['budget'], title: 'Check whether the target is achievable', detail: 'Only count verified savings. If unprotected spending cannot cover the target, show the shortfall.' },
      ],
      result: { title: 'Find the savings. Keep your priorities.', body: 'Illustratively, $90 in unused subscriptions, $140 from renegotiated services and $70 in avoided fees meet the $300 target. Confirm each saving before changing your budgets.', cta: 'Review proposed savings' },
      tiles: [['Monthly savings', '$300'], ['Expense reduction', '10%'], ['Key budgets', 'Unchanged']],
      generic: 'A useful expense plan respects what you will not cut. The 10% target is a constraint to test, not a reason to invent savings.',
    },
  ]

  const tabs = Array.from(root.querySelectorAll('.demo-tab'))
  const promptEl = document.getElementById('demo-prompt')
  const caretEl = root.querySelector('.demo-caret')
  const stepsEl = document.getElementById('demo-steps')
  const resultEl = document.getElementById('demo-result')
  const titleEl = document.getElementById('demo-result-title')
  const bodyEl = document.getElementById('demo-result-body')
  const tilesEl = document.getElementById('demo-tiles')
  const ctaEl = document.getElementById('demo-result-cta')
  const genericEl = document.getElementById('demo-generic')
  const chips = Array.from(root.querySelectorAll('.demo-chip'))
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let current = 0
  let run = 0
  let visible = false

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  const lightChips = (ctx) => chips.forEach((chip) => chip.classList.toggle('is-lit', ctx.includes(chip.dataset.ctx)))
  const allCtx = (s) => [...new Set(s.steps.flatMap((step) => step.ctx || []))]

  function resetStage(s) {
    promptEl.textContent = ''
    stepsEl.replaceChildren()
    resultEl.hidden = true
    genericEl.textContent = s.generic
    lightChips([])
    tabs.forEach((tab, i) => {
      tab.classList.toggle('is-active', i === current)
      tab.setAttribute('aria-selected', String(i === current))
    })
  }

  function buildStep(step) {
    const li = document.createElement('li')
    li.className = 'demo-step' + (step.action ? ' is-action' : '')
    const icon = document.createElement('span')
    icon.className = 'demo-step-icon'
    const text = document.createElement('span')
    const strong = document.createElement('b')
    strong.textContent = step.title
    text.append(strong, step.detail)
    li.append(icon, text)
    return li
  }

  function showResult(s) {
    titleEl.textContent = s.result.title
    bodyEl.textContent = s.result.body
    ctaEl.textContent = s.result.cta
    tilesEl.replaceChildren(
      ...s.tiles.map(([label, value]) => {
        const tile = document.createElement('span')
        tile.className = 'demo-tile'
        const small = document.createElement('small')
        small.textContent = label
        const strong = document.createElement('strong')
        strong.textContent = value
        tile.append(small, strong)
        return tile
      }),
    )
    resultEl.hidden = false
  }

  function renderFinal(s) {
    resetStage(s)
    promptEl.textContent = s.prompt
    caretEl.style.display = 'none'
    s.steps.forEach((step) => {
      const li = buildStep(step)
      li.classList.add('is-done')
      stepsEl.append(li)
    })
    lightChips(allCtx(s))
    showResult(s)
  }

  async function play() {
    const token = ++run
    const s = scenarios[current]
    const alive = () => token === run

    resetStage(s)
    caretEl.style.display = ''

    for (const ch of s.prompt) {
      if (!alive()) return
      promptEl.textContent += ch
      await wait(24)
    }
    caretEl.style.display = 'none'
    await wait(500)

    for (const step of s.steps) {
      if (!alive()) return
      const li = buildStep(step)
      li.classList.add('is-working')
      stepsEl.append(li)
      lightChips(step.ctx || [])
      await wait(1000)
      if (!alive()) return
      li.classList.replace('is-working', 'is-done')
      await wait(220)
    }

    if (!alive()) return
    lightChips(allCtx(s))
    showResult(s)
    await wait(6000)
    if (!alive()) return
    current = (current + 1) % scenarios.length
    play()
  }

  function select(i) {
    current = i
    if (!reduceMotion && visible) {
      play()
    } else {
      run++
      renderFinal(scenarios[current])
    }
  }

  tabs.forEach((tab, i) => tab.addEventListener('click', () => select(i)))

  document.querySelectorAll('a[href="#amex-moneyback"]').forEach((link) => {
    link.addEventListener('click', () => {
      select(0)
      tabs[0].focus({ preventScroll: true })
    })
  })

  renderFinal(scenarios[0])
  if (reduceMotion || !('IntersectionObserver' in window)) return

  // Only animate while on screen, and restart the story from the top each time it scrolls into view.
  new IntersectionObserver(
    (entries) => {
      const nowVisible = entries.some((entry) => entry.isIntersecting)
      if (nowVisible === visible) return
      visible = nowVisible
      if (visible) play()
      else run++
    },
    { threshold: 0.35 },
  ).observe(root)
}
