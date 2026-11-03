import './style.css'

const tg = window.Telegram?.WebApp
const user = tg?.initDataUnsafe?.user
if (tg) {
  tg.ready(); tg.expand()
  tg.setHeaderColor('#101114'); tg.setBackgroundColor('#101114')
}
const buzz = (t = 'light') => tg?.HapticFeedback?.impactOccurred(t)

const svg = d => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`
const ic = {
  home: svg('<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>'),
  hair: svg('<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12"/>'),
  style: svg('<path d="M8 3l-5 3 2 4 3-1v12h8V9l3 1 2-4-5-3a4 4 0 0 1-8 0z"/>'),
  words: svg('<path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/><path d="M4 16a4 4 0 0 1 4-4h12"/>'),
  profile: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
  heart: svg('<path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/>'),
  star: svg('<path d="M12 3l2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6z"/>'),
  check: svg('<path d="M5 12l5 5 9-10"/>'),
  arrow: svg('<path d="M7 17L17 7M8 7h9v9"/>')
}

const hair = [
  { id: 'h1', name: 'Текстурный кроп', desc: 'Короткие бока, живая текстура сверху.', faces: ['Овальное', 'Квадратное', 'Круглое'], care: 1, tip: 'Матовая паста на сухие волосы, 2–3 минуты на укладку.' },
  { id: 'h2', name: 'Центральный пробор', desc: 'Волосы средней длины, мягко разведены в стороны.', faces: ['Овальное', 'Квадратное'], care: 2, tip: 'Сушите феном вниз, а потом зафиксируйте солевым спреем.' },
  { id: 'h3', name: 'Бокс и полубокс', desc: 'Минимум укладки, максимум опрятности.', faces: ['Овальное', 'Вытянутое'], care: 1, tip: 'Стригитесь раз в 2–3 недели, иначе линия теряет чёткость.' },
  { id: 'h4', name: 'Небрежная чёлка', desc: 'Рваная чёлка с естественным объёмом.', faces: ['Вытянутое', 'Квадратное'], care: 3, tip: 'Нужна текстурная пудра или глина и регулярная стрижка кончиков.' }
]
const styles = [
  { id: 's1', name: 'Минимализм', desc: 'Простые формы, спокойные цвета.', colors: ['#e9e6df', '#8c8f94', '#2b2d31', '#0f0f10'], pieces: 'Белая футболка, прямые брюки, чистые кеды.' },
  { id: 's2', name: 'Стритвир', desc: 'Свободный крой, кроссовки, уличная культура.', colors: ['#3b4a3a', '#c9a227', '#1d1d1d', '#d9d9d9'], pieces: 'Оверсайз-худи, карго, массивные кроссовки.' },
  { id: 's3', name: 'Old money', desc: 'Сдержанная классика без громких логотипов.', colors: ['#f2ead8', '#1f3a5f', '#6b4f3a', '#2c2c2c'], pieces: 'Поло, лоферы, пальто, трикотажный кардиган.' },
  { id: 's4', name: 'Техвир', desc: 'Функциональные ткани и многослойность.', colors: ['#18191b', '#4a4f55', '#7d8a6a', '#b5b9bd'], pieces: 'Мембранная куртка, карго со стропами, трекинговая обувь.' }
]
const glossary = [
  ['Looksmaxxing', 'Работа над внешностью: уход, стиль, форма.'],
  ['Mogging', 'Интернет-сленг: превосходить кого-то по внешнему впечатлению.'],
  ['PSL', 'Шкала, по которой в сообществе обсуждают эстетику внешности.'],
  ['Grooming', 'Уход за волосами, кожей и бородой, общая опрятность.'],
  ['Aesthetic', 'Узнаваемая визуальная стилистика или атмосфера образа.']
]

let page = 'home'
const saved = (() => { try { return new Set(JSON.parse(localStorage.getItem('lr-saved') || '[]')) } catch { return new Set() } })()
const persist = () => { try { localStorage.setItem('lr-saved', JSON.stringify([...saved])) } catch {} }
const all = [...hair.map(h => ({ ...h, kind: 'hair' })), ...styles.map(s => ({ ...s, kind: 'style' }))]

const favBtn = id => `<span class="fav ${saved.has(id) ? 'on' : ''}" role="button" aria-label="Сохранить" data-fav="${id}">${ic.heart}</span>`
const head = (title, text) => `<section class="page-head"><h1>${title}</h1><p class="lead">${text}</p></section>`
const dots = n => `<div class="dots">${[1, 2, 3].map(i => `<s class="${i <= n ? 'on' : ''}"></s>`).join('')}</div>`

const hairCard = h => `
  <article class="item" data-item>
    <button class="item-head" data-toggle><div><h3>${h.name}</h3><p>${h.desc}</p></div>${favBtn(h.id)}</button>
    <div class="more"><div><div class="more-in">
      <div><b>Подходит для лица</b><div class="tags">${h.faces.map(f => `<span class="tag">${f}</span>`).join('')}</div></div>
      <div><b>Сложность укладки</b>${dots(h.care)}</div>
      <div><b>Совет</b>${h.tip}</div>
    </div></div></div>
  </article>`

const styleCard = s => `
  <article class="item" data-item>
    <button class="item-head" data-toggle><div><h3>${s.name}</h3><p>${s.desc}</p><div class="sw">${s.colors.map(c => `<s style="background:${c}"></s>`).join('')}</div></div>${favBtn(s.id)}</button>
    <div class="more"><div><div class="more-in"><div><b>Базовые вещи</b>${s.pieces}</div></div></div></div>
  </article>`

const pages = {
  home: () => `
    <section class="hero"><i></i><i></i><i></i><i></i>
      <p class="muted">${user ? `Привет, ${user.first_name}` : 'Добро пожаловать'}</p>
      <h1>Найди свой образ</h1>
      <p class="lead">Причёски, стили и сленг looksmaxxing в одном месте.</p>
      <button class="btn" data-page="style">Выбрать стиль ${ic.arrow}</button>
    </section>
    <div class="bento">
      <button class="tile tall" data-page="hair">${ic.hair}<div><h3>Причёски</h3><p>Что подойдёт вашему лицу</p></div></button>
      <button class="tile tall" data-page="style">${ic.style}<div><h3>Стили</h3><p>Палитры и базовые вещи</p></div></button>
      <button class="tile row" data-page="words">${ic.words}<div><h3>Словарь</h3><p>Термины сообщества</p></div></button>
      <button class="tile row pro" data-page="premium">${ic.star}<div><h3>Premium</h3><p>Расширенные гайды</p></div></button>
    </div>
    <p class="quote">Стиль — это способ говорить о себе. <span>Не гонитесь за чужими стандартами.</span></p>`,
  hair: () => head('Причёски', 'Нажмите на карточку, чтобы увидеть, кому подходит и как укладывать.') + hair.map(hairCard).join(''),
  style: () => head('Стили', 'Выберите направление и начните с базовых вещей.') + styles.map(styleCard).join(''),
  words: () => head('Словарь', 'Термины, которые встречаются в сообществе.') + `
    <input id="search" class="search" type="search" placeholder="Найти термин" autocomplete="off" />
    <div id="gloss">${glossary.map(([w, d]) => `<article class="item gl"><div class="item-head"><div><h3>${w}</h3><p>${d}</p></div></div></article>`).join('')}</div>
    <div id="gloss-empty" class="empty" hidden>Ничего не найдено. Попробуйте другое слово.</div>`,
  profile: () => {
    const mine = all.filter(i => saved.has(i.id))
    return head('Профиль', 'Ваши сохранённые причёски и стили.') + `
    <div class="me"><div class="avatar">${user?.photo_url ? `<img src="${user.photo_url}" alt="" />` : (user?.first_name?.[0] || 'LR')}</div>
      <div><h3>${user ? [user.first_name, user.last_name].filter(Boolean).join(' ') : 'Гость'}</h3><span class="badge">Бесплатный доступ</span></div></div>
    <p class="sec">Сохранённое</p>
    ${mine.length ? mine.map(i => (i.kind === 'hair' ? hairCard(i) : styleCard(i))).join('') : `<div class="empty">Пока пусто. Нажмите на сердечко у причёски или стиля, чтобы сохранить.<br><button class="btn ghost" data-page="hair">Смотреть причёски</button></div>`}
    <button class="btn full" data-page="premium">Попробовать Premium</button>`
  },
  premium: () => head('Premium', 'Больше гайдов и подборок для тех, кто хочет глубже.') + `
    <ul class="perks">${['Расширенные гайды по уходу и стилю', 'Дополнительные подборки образов', 'История сохранённых материалов', 'Новые материалы для участников'].map(t => `<li>${ic.check}${t}</li>`).join('')}</ul>
    <button class="btn full" id="soon">Скоро будет доступно</button>
    <p class="muted" style="text-align:center;margin-top:10px">Оплата пока не подключена</p>`
}

const tabs = [['home', 'Главная'], ['hair', 'Причёски'], ['style', 'Стили'], ['words', 'Словарь'], ['profile', 'Профиль']]
const app = document.querySelector('#app')

function render() {
  const tab = page === 'premium' ? 'profile' : page
  app.innerHTML = `
    <header class="top"><div class="logo">LOOK<b>RATE</b></div>
      <button class="avatar" data-page="profile" aria-label="Профиль">${user?.photo_url ? `<img src="${user.photo_url}" alt="" />` : (user?.first_name?.[0] || 'LR')}</button></header>
    <main class="enter">${pages[page]()}</main>
    <nav class="nav">${tabs.map(([id, t]) => `<button class="${tab === id ? 'on' : ''}" data-page="${id}">${ic[id]}${t}</button>`).join('')}</nav>
    <div id="toast" class="toast"></div>`
  if (tg?.BackButton) page === 'premium' ? tg.BackButton.show() : tg.BackButton.hide()
}
function go(p) { page = p; render(); window.scrollTo(0, 0) }
tg?.BackButton?.onClick(() => go('profile'))

function toast(msg) {
  const el = document.querySelector('#toast'); if (!el) return
  el.textContent = msg; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2200)
}

app.addEventListener('click', e => {
  const fav = e.target.closest('[data-fav]')
  if (fav) {
    e.stopPropagation()
    const id = fav.dataset.fav
    saved.has(id) ? saved.delete(id) : saved.add(id)
    persist(); buzz('medium')
    document.querySelectorAll(`[data-fav="${id}"]`).forEach(b => b.classList.toggle('on', saved.has(id)))
    toast(saved.has(id) ? 'Сохранено в профиле' : 'Убрано из сохранённого')
    return
  }
  const nav = e.target.closest('[data-page]')
  if (nav) { buzz(); return go(nav.dataset.page) }
  const tog = e.target.closest('[data-toggle]')
  if (tog) { buzz('light'); tog.closest('[data-item]').classList.toggle('open'); return }
  if (e.target.closest('#soon')) toast('Premium скоро появится')
})

app.addEventListener('input', e => {
  if (e.target.id !== 'search') return
  const q = e.target.value.trim().toLowerCase()
  let n = 0
  document.querySelectorAll('.gl').forEach(el => {
    const hit = el.textContent.toLowerCase().includes(q)
    el.hidden = !hit; if (hit) n++
  })
  document.querySelector('#gloss-empty').hidden = n > 0
})

render()
