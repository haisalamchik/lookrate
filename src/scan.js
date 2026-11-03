const tg = window.Telegram?.WebApp
const LIMIT = 3
const BOT_LINK = 'https://t.me/YOUR_BOT' // TODO: ссылка на вашего бота

const sil = {
  oval: '<ellipse cx="50" cy="60" rx="32" ry="44"/>',
  round: '<circle cx="50" cy="60" r="38"/>',
  square: '<rect x="18" y="24" width="64" height="72" rx="14"/>',
  long: '<ellipse cx="50" cy="60" rx="28" ry="50"/>',
  heart: '<path d="M18 34Q50 6 82 34Q80 70 50 100Q20 70 18 34Z"/>',
  diamond: '<path d="M50 10L84 56L50 108L16 56Z" stroke-linejoin="round"/>'
}
const shapes = {
  oval: { name: 'Овальное', desc: 'Сбалансированные пропорции. Подходит почти любая стрижка.', avoid: 'Тяжёлая чёлка до бровей прячет главное достоинство формы.', picks: [['h1', 'Подчёркивает скулы, не нарушая пропорции.'], ['h2', 'Пробор сохраняет природную гармонию.'], ['h3', 'Овал выдерживает даже самую короткую стрижку.']] },
  round: { name: 'Круглое', desc: 'Мягкие линии и почти равные ширина и высота. Цель: добавить высоты и углов.', avoid: 'Объём по бокам и ровная чёлка визуально расширяют лицо.', picks: [['h1', 'Высота сверху и короткие бока вытягивают лицо.'], ['h4', 'Асимметричная чёлка ломает круглый контур.']] },
  square: { name: 'Квадратное', desc: 'Выраженная челюсть и широкий лоб. Это сильная геометрия, её не нужно прятать.', avoid: 'Слишком короткие бока без текстуры делают линии жёсткими.', picks: [['h1', 'Текстура смягчает углы и сохраняет характер.'], ['h2', 'Пробор балансирует широкую челюсть.'], ['h4', 'Рваная чёлка добавляет мягкости лбу.']] },
  long: { name: 'Вытянутое', desc: 'Лицо заметно выше, чем шире. Цель: добавить ширины, не добавляя высоты.', avoid: 'Высокий начёс и очень короткие бока ещё сильнее вытягивают лицо.', picks: [['h4', 'Чёлка укорачивает лоб и визуально сокращает длину.'], ['h2', 'Волосы по бокам добавляют ширину.'], ['h3', 'Аккуратный бокс, если лицо с чёткой челюстью.']] },
  heart: { name: 'Сердцевидное', desc: 'Широкий лоб, скулы заметны, подбородок уже. Цель: уравновесить лоб.', avoid: 'Объём у висков и зачёс назад открывают лоб слишком сильно.', picks: [['h2', 'Волосы вдоль лица смягчают линию лба.'], ['h4', 'Чёлка перекрывает самую широкую часть лба.'], ['h1', 'Подходит, если оставить длину сверху.']] },
  diamond: { name: 'Ромбовидное', desc: 'Скулы шире лба и челюсти. Цель: добавить ширины в зоне лба.', avoid: 'Короткие бока рядом со скулами сильнее выделяют их.', picks: [['h4', 'Чёлка добавляет ширину лбу и уравновешивает скулы.'], ['h2', 'Объём у висков смягчает линию скул.'], ['h1', 'Работает при небольшой длине по бокам.']] }
}

let ctx
let st = { phase: 'idle' }
const today = () => new Date().toISOString().slice(0, 10)
const left = () => { try { const d = JSON.parse(localStorage.getItem('lr-scans') || '{}'); return LIMIT - (d.day === today() ? d.n : 0) } catch { return LIMIT } }
const spend = () => { try { const d = JSON.parse(localStorage.getItem('lr-scans') || '{}'); localStorage.setItem('lr-scans', JSON.stringify({ day: today(), n: (d.day === today() ? d.n : 0) + 1 })) } catch {} }

export const initScan = c => { ctx = c }
const frame = inner => `<div class="frame"><i></i><i></i><i></i><i></i>${inner}</div>`
const face = key => `<svg class="sil" viewBox="0 0 100 120" aria-hidden="true">${sil[key]}</svg>`

export function scanView() {
  const { head, ic } = ctx
  if (st.phase === 'loading') return head('Анализируем', 'Определяем форму лица. Это займёт несколько секунд.') + frame(`<img src="${st.img}" alt="" /><span class="beam"></span>`)
  if (st.phase === 'error') return head('Не получилось', st.msg) + `<button class="btn full" data-scan="reset">Попробовать снова</button>`
  if (st.phase === 'result') {
    const s = shapes[st.shape]
    const cards = s.picks.map(([id, why]) => {
      const h = ctx.hair.find(x => x.id === id)
      return ctx.card({ ...h, why }).replace('class="item"', 'class="item open"')
    }).join('')
    return head('Ваша форма лица', 'Мы подобрали причёски под вашу геометрию.') + `
      <div class="shape-card">${face(st.shape)}<div><h2>${s.name}</h2><p class="muted">${s.desc}</p>${st.note ? `<p class="note">${st.note}</p>` : ''}</div></div>
      <p class="sec">Что подойдёт</p>${cards}
      <div class="avoid"><b>Чего лучше избегать</b>${s.avoid}</div>
      <button class="btn full" data-scan="share">Поделиться результатом</button>
      <button class="btn ghost full" data-scan="reset">Сканировать другое фото</button>`
  }
  return head('Форма лица', 'Загрузите фото, и ИИ подберёт причёски под ваш контур.') + `
    <label class="drop">${frame(`${ic.scan}<b>Выбрать или снять фото</b><span>Анфас, мягкий свет, лоб открыт</span>`)}<input id="file" type="file" accept="image/*" hidden /></label>
    <p class="muted center">Попыток сегодня: ${left()} из ${LIMIT}</p>
    <p class="muted center">Фото отправляется на анализ и нигде не сохраняется.</p>`
}

async function shrink(file) {
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const k = Math.min(1, 768 / Math.max(bmp.width, bmp.height))
  const c = document.createElement('canvas')
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k)
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height)
  return c.toDataURL('image/jpeg', 0.82)
}

const fail = msg => { st = { phase: 'error', msg }; ctx.render() }

export async function scanChange(e) {
  if (e.target.id !== 'file' || !e.target.files[0]) return
  if (left() <= 0) return fail('Лимит на сегодня исчерпан. Возвращайтесь завтра.')
  try {
    const url = await shrink(e.target.files[0])
    st = { phase: 'loading', img: url }; ctx.render()
    const r = await fetch('/api/analyze', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ image: url.split(',')[1], initData: tg?.initData || '' })
    })
    const data = await r.json()
    if (!r.ok) return fail(data.error || 'Что-то пошло не так.')
    spend(); tg?.HapticFeedback?.notificationOccurred('success')
    st = { phase: 'result', shape: data.shape, note: data.note }; ctx.render(); window.scrollTo(0, 0)
  } catch { fail('Не удалось обработать фото. Попробуйте другое.') }
}

export function scanClick(e) {
  const b = e.target.closest('[data-scan]')
  if (!b) return false
  if (b.dataset.scan === 'reset') { st = { phase: 'idle' }; ctx.render() }
  if (b.dataset.scan === 'share') {
    const text = `Моя форма лица: ${shapes[st.shape].name}. Узнай свою и подбери причёску:`
    tg ? tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(BOT_LINK)}&text=${encodeURIComponent(text)}`)
       : navigator.share?.({ text, url: BOT_LINK })
  }
  return true
}
