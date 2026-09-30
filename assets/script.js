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

  initReveal()
  initStoryDemo()

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

// Every scenario mirrors a real Loonie feature: Decision Maker, goal feasibility + scenario sandbox,
// marketplace stress-test blueprints, and statement import. Figures are illustrative.
function initStoryDemo() {
  const root = document.getElementById('demo')
  if (!root) return

  const scenarios = [
    {
      prompt: 'Should I pay down my loan faster, or invest an extra $500 a month?',
      steps: [
        { ctx: ['networth', 'runway'], title: 'Built your profile snapshot', detail: 'Net worth and cash runway are computed from your accounts, not typed in. Runway: 7.4 months.' },
        { ctx: ['cashflow'], title: 'Read your real cash flow', detail: 'Six months of income and spending confirm the $500 is genuinely spare.' },
        { ctx: ['goals'], title: 'Checked what it does to your goals', detail: 'Your home goal stays on track either way.' },
        { action: true, title: 'Asked the decision engine', detail: 'Your two options and your profile go in; a choice, confidence and odds come back.' },
        { action: true, title: 'Saved it to your history', detail: 'Every Pilot chat is searchable, so you can revisit why you chose it.' },
      ],
      result: { title: 'Invest it \u2014 71% confidence', body: 'Your runway is healthy and your expected returns beat your loan rate. Odds: invest 71%, pay down 29%.', cta: 'Kept in your Pilot history' },
      generic: '\u201CIt depends on your interest rate, risk tolerance and goals. Could you share your loan rate, income and savings?\u201D',
    },
    {
      prompt: 'Am I on track to buy a home in three years?',
      steps: [
        { ctx: ['goals'], title: 'Read your goal and its target date', detail: 'Down payment: $31,500 of $60,000.' },
        { ctx: ['cashflow', 'budget'], title: 'Compared what you need with what you save', detail: 'Needs $1,020 a month; your three-month average is $1,150.' },
        { action: true, title: 'Drafted best, expected and worst cases', detail: 'In the scenario sandbox. Nothing touches your real data.' },
        { ctx: ['networth', 'allocation'], title: 'Projected each account at its own growth rate', detail: 'Savings and investments grow differently, so they are modelled separately.' },
      ],
      result: { title: 'On track \u2014 with a $130/mo cushion', body: 'In the worst case you slip about five months. Adopt the expected case as your plan.', cta: 'Adopt this scenario' },
      generic: '\u201CTo estimate that, please share your savings, income, target price and expected returns.\u201D',
    },
    {
      prompt: 'What happens if I lose my job and rates rise?',
      steps: [
        { ctx: ['networth', 'runway', 'cashflow'], title: 'Brought in the Job Loss advisor and asked first', detail: 'Pilot lists what it wants to read. Anything you decline stays private.' },
        { action: true, title: 'Ran each shock as its own specialist', detail: 'Job loss, rate rise and market drop, each analysed separately.' },
        { ctx: ['allocation'], title: 'Found your weakest spot', detail: 'Investments are 68% of your net worth.' },
        { action: true, title: 'Wrote one answer and remembered your choice', detail: 'Next time it can run straight away, and you can revoke access in Settings.' },
      ],
      result: { title: 'Runway holds in the job-loss case', body: 'Six months of expenses stay covered. A market drop is your riskiest scenario \u2014 consider rebalancing.', cta: 'Review in Settings \u203a Advisors' },
      generic: '\u201CLosing a job can be stressful. A good rule is an emergency fund of 3\u20136 months of expenses.\u201D',
    },
    {
      prompt: 'Here is this month\u2019s card statement (PDF).',
      steps: [
        { action: true, title: 'Recognised the statement and matched your account', detail: 'Pilot works out which account it belongs to. You confirm if unsure.' },
        { action: true, title: 'Read the PDF on your computer', detail: 'Every transaction extracted with your own local AI model.' },
        { action: true, title: 'Applied your category rules', detail: 'Your keyword rules always beat the AI\u2019s guess.' },
        { ctx: ['budget'], title: 'Checked it against your budgets', detail: 'Dining is 18% over its monthly budget.' },
        { action: true, title: 'Skipped duplicates and suggested new rules', detail: 'New merchants become suggestions you approve.' },
      ],
      result: { title: '42 transactions ready to review', body: '38 categorised by your rules, 4 need your call. Review them right in the chat; nothing is saved until you apply it.', cta: 'Review & apply' },
      generic: '\u201CPaste the transactions here and I\u2019ll try to sort them. Next month, paste them again.\u201D',
    },
    {
      prompt: 'What is my net worth in CAD?',
      steps: [
        { ctx: ['networth'], title: 'Found accounts in three currencies', detail: 'Canadian dollars, US dollars and rupees.' },
        { action: true, title: 'Fetched today\u2019s exchange rates', detail: 'From a live source, with a backup if it is down. A rate you pinned wins.' },
        { ctx: ['allocation'], title: 'Converted everything into your base currency', detail: 'So one number adds up your whole picture.' },
        { action: true, title: 'Kept the breakdown by currency', detail: 'You can see how much of it sits in each.' },
      ],
      result: { title: 'C$84,210 in total', body: '58% is in CAD, 27% in USD and 15% in INR. Figures are illustrative; yours use your own accounts.', cta: 'Open Currencies' },
      generic: '\u201CI can\u2019t see your accounts. Tell me the balances and today\u2019s rates and I\u2019ll add them up.\u201D',
    },
  ]

  const tabs = Array.from(root.querySelectorAll('.demo-tab'))
  const promptEl = document.getElementById('demo-prompt')
  const caretEl = root.querySelector('.demo-caret')
  const stepsEl = document.getElementById('demo-steps')
  const resultEl = document.getElementById('demo-result')
  const titleEl = document.getElementById('demo-result-title')
  const bodyEl = document.getElementById('demo-result-body')
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
      await wait(1100)
      if (!alive()) return
      li.classList.replace('is-working', 'is-done')
      await wait(250)
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
