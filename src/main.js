import './style.css'
// Telegram Mini App initialization
const tg = window.Telegram?.WebApp

if (tg) {
  tg.ready()
  tg.expand()

  tg.setHeaderColor('#090909')
  tg.setBackgroundColor('#090909')

  console.log('LOOKRATE connected to Telegram!')
} else {
  console.log('LOOKRATE running in browser mode')
}

const app = document.querySelector('#app')

const icons = {
  home: '⌂',
  hair: '✂️',
  fashion: '◇',
  glossary: '▤',
  profile: '◉'
}

const glossary = [
  {
    word: 'Looksmaxxing',
    description: 'Работа над своим стилем, уходом и внешним образом.'
  },
  {
    word: 'Mogging',
    description: 'Интернет-сленг для сравнения образов или внешнего впечатления.'
  },
  {
    word: 'PSL',
    description: 'Интернет-система обсуждения эстетики внешности.'
  },
  {
    word: 'Grooming',
    description: 'Уход за волосами, кожей и общая опрятность.'
  },
  {
    word: 'Aesthetic',
    description: 'Определённая визуальная стилистика или атмосфера.'
  }
]

let currentPage = 'home'

function header() {
  return `
    <header class="header">
      <div class="logo">LOOK<span>RATE</span></div>
      <button class="profile-button" data-page="profile">LR</button>
    </header>
  `
}

function homePage() {
  return `
    <section class="hero">
      <div class="eyebrow">YOUR PERSONAL STYLE GUIDE</div>
      <h1>DISCOVER<br>YOUR <span>STYLE.</span></h1>
      <p>Explore new aesthetics. Find your own identity.</p>
      <button class="primary-button" data-page="fashion">
        EXPLORE NOW <span>↗️</span>
      </button>
      <div class="hero-number">01 / 05</div>
    </section>

    <section class="section">
      <div class="section-heading">
        <div>
          <div class="eyebrow">EXPLORE</div>
          <h2>Discover</h2>
        </div>
        <span class="muted">01 — 04</span>
      </div>

      <div class="feature-grid">
        <article class="feature-card" data-page="hair">
          <div class="card-icon">✂️</div>
          <div class="card-bottom">
            <h3>Hair Guide</h3>
            <p>Hairstyles & care</p>
          </div>
          <span class="card-arrow">↗️</span>
        </article>

        <article class="feature-card" data-page="fashion">
          <div class="card-icon">◇</div>
          <div class="card-bottom">
            <h3>Fashion</h3>
            <p>Find your aesthetic</p>
          </div>
          <span class="card-arrow">↗️</span>
        </article>

        <article class="feature-card" data-page="glossary">
          <div class="card-icon">▤</div>
          <div class="card-bottom">
            <h3>Glossary</h3>
            <p>Learn the language</p>
          </div>
          <span class="card-arrow">↗️</span>
        </article>

        <article class="feature-card premium-card" data-page="premium">
          <div class="card-icon">✦</div>
          <div class="card-bottom">
            <h3>Premium</h3>
            <p>Unlock more features</p>
          </div>
          <span class="card-arrow">↗️</span>
        </article>
      </div>
    </section>

    <section class="quote-card">
      <div class="eyebrow">LOOKRATE PHILOSOPHY</div>
      <h2>STYLE IS A<br>FORM OF <span>EXPRESSION.</span></h2>
      <p>Build your own aesthetic. Don't chase somebody else's standards.</p>
    </section>
  `
}

function hairPage() {
  return `
    <section class="page-intro">
      <div class="eyebrow">01 / HAIR GUIDE</div>
      <h1>YOUR HAIR.<br><span>YOUR STYLE.</span></h1>
      <p>Explore popular hairstyles and learn how to care for your hair.</p>
    </section>

    <div class="info-card">
      <div class="eyebrow">HAIRSTYLE COLLECTION</div>
      <h2>Find your look.</h2>
      <p>Выбирай причёску по длине волос, предпочтениям и удобству укладки.</p>
    </div>

    <div class="list-card">
      <h3>Textured Crop</h3>
      <p>Короткая текстурированная стрижка с естественной укладкой.</p>
    </div>
    <div class="list-card">
      <h3>Middle Part</h3>
      <p>Причёска с центральным пробором и свободно уложенными волосами.</p>
    </div>
    <div class="list-card">
      <h3>Buzz Cut</h3>
      <p>Очень короткая стрижка с минимальными требованиями к укладке.</p>
    </div>
    <div class="list-card">
      <h3>Messy Fringe</h3>
      <p>Небрежная укладка с текстурированной чёлкой.</p>
    </div>
  `
}

function fashionPage() {
  return `
    <section class="page-intro">
      <div class="eyebrow">02 / FASHION</div>
      <h1>DEFINE<br><span>YOUR LOOK.</span></h1>
      <p>Explore different fashion aesthetics.</p>
    </section>

    <div class="list-card">
      <h3>Minimalism</h3>
      <p>Простые формы, спокойные цвета и функциональность.</p>
    </div>
    <div class="list-card">
      <h3>Streetwear</h3>
      <p>Свободные силуэты, кроссовки и уличная культура.</p>
    </div>
    <div class="list-card">
      <h3>Old Money</h3>
      <p>Сдержанная классика, базовые вещи и лаконичные сочетания.</p>
    </div>
    <div class="list-card">
      <h3>Techwear</h3>
      <p>Функциональная одежда, технические ткани и многослойность.</p>
    </div>
  `
}

function glossaryPage() {
  return `
    <section class="page-intro">
      <div class="eyebrow">03 / GLOSSARY</div>
      <h1>KNOW THE<br><span>LANGUAGE.</span></h1>
      <p>Popular terms from the looksmaxxing community.</p>
    </section>

    <div class="search-wrap">
      <input id="search" type="text" placeholder="Search terms..." />
    </div>

    <div id="glossary-list">
      ${glossary.map(item => `
        <article class="list-card glossary-item">
          <h3>${item.word}</h3>
          <p>${item.description}</p>
        </article>
      `).join('')}
    </div>
  `
}

function profilePage() {
  return `
    <section class="page-intro">
      <div class="eyebrow">04 / PERSONAL AREA</div>
      <h1>YOUR<br><span>PROFILE.</span></h1>
      <p>Твой личный раздел LOOKRATE.</p>
    </section>

    <div class="profile-card">
      <div class="avatar">LR</div>
      <h2>LOOKRATE USER</h2>
      <span class="muted">FREE MEMBERSHIP</span>
    </div>

    <div class="list-card">
      <h3>Account</h3>
      <p>Здесь появится информация о твоём Telegram-аккаунте.</p>
    </div>

    <button class="primary-button full-button" data-page="premium">
      EXPLORE PREMIUM ↗️
    </button>
  `
}

function premiumPage() {
  return `
    <section class="page-intro">
      <div class="eyebrow">05 / MEMBERSHIP</div>
      <h1>UNLOCK<br><span>YOUR PRO.</span></h1>
      <p>More tools. More inspiration. More possibilities.</p>
    </section>

    <div class="premium-box">
      <div class="premium-label">LOOKRATE MEMBERSHIP</div>
      <h2>PREMIUM<span>+</span></h2>
      <p>Расширенные возможности и дополнительные материалы.</p>

      <div class="premium-feature">✓ Расширенные гайды</div>
      <div class="premium-feature">✓ Дополнительные подборки</div>
      <div class="premium-feature">✓ История сохранённых материалов</div>
      <div class="premium-feature">✓ Новые материалы для участников</div>

      <button class="primary-button full-button" id="premium-button">
        COMING SOON
      </button>
      <div class="muted small">Оплата пока не подключена</div>
    </div>
  `
}

const pages = {
  home: homePage,
  hair: hairPage,
  fashion: fashionPage,
  glossary: glossaryPage,
  profile: profilePage,
  premium: premiumPage
}

function navigation() {
  const items = [
    ['home', 'HOME'],
    ['hair', 'HAIR'],
    ['fashion', 'STYLE'],
    ['glossary', 'WORDS'],
    ['profile', 'PROFILE']
  ]

  return `
    <nav class="bottom-nav">
      ${items.map(([id, title]) => `
        <button class="nav-item ${currentPage === id ? 'active' : ''}"
          data-page="${id}">
          <span>${icons[id]}</span>
          <small>${title}</small>
        </button>
      `).join('')}
    </nav>
  `
}

function render() {
  app.innerHTML = `
    ${header()}
    <main class="content">
      ${pages[currentPage]()}
    </main>
    ${navigation()}
    <div id="toast" class="toast"></div>
  `

  document.querySelectorAll('[data-page]').forEach(button => {
    button.addEventListener('click', () => {
      currentPage = button.dataset.page
      render()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  })

  const search = document.querySelector('#search')

  if (search) {
    search.addEventListener('input', event => {
      const value = event.target.value.toLowerCase()

      document.querySelectorAll('.glossary-item').forEach(item => {
        item.style.display = item.innerText.toLowerCase().includes(value)
          ? 'block'
          : 'none'
      })
    })
  }

  const premiumButton = document.querySelector('#premium-button')

  if (premiumButton) {
    premiumButton.addEventListener('click', () => {
      showToast('Premium скоро появится!')
    })
  }
}

function showToast(message) {
  const toast = document.querySelector('#toast')
  if (!toast) return

  toast.textContent = message
  toast.classList.add('show')

  setTimeout(() => toast.classList.remove('show'), 2500)
}

render()