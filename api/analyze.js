import crypto from 'node:crypto'

const SHAPES = ['oval', 'round', 'square', 'long', 'heart', 'diamond']
const hits = new Map() // мягкий лимит; для жёсткого нужен Vercel KV / Upstash
const DAILY_MAX = 10

function telegramUserId(initData, token) {
  const p = new URLSearchParams(initData)
  const hash = p.get('hash')
  if (!hash) return null
  p.delete('hash')
  const str = [...p.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join('\n')
  const secret = crypto.createHmac('sha256', 'WebAppData').update(token).digest()
  if (crypto.createHmac('sha256', secret).update(str).digest('hex') !== hash) return null
  try { return JSON.parse(p.get('user')).id } catch { return null }
}

const SYSTEM = `Ты помогаешь подобрать причёску. По фото определи только геометрическую форму лица (контур, лоб, скулы, челюсть). Не оценивай привлекательность и не делай выводов о человеке.
Ответь ТОЛЬКО JSON без пояснений: {"face":true,"shape":"oval|round|square|long|heart|diamond","note":"одно предложение по-русски о чертах контура"}.
Если на фото нет одного чётко видимого лица: {"face":false}.`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Метод не поддерживается.' })
  const { image, initData } = req.body || {}

  // Если задан BOT_TOKEN, принимаем только запросы из настоящего Telegram-аппа
  const uid = process.env.BOT_TOKEN ? telegramUserId(initData || '', process.env.BOT_TOKEN) : 'dev'
  if (!uid) return res.status(401).json({ error: 'Откройте приложение через Telegram-бота.' })

  const key = `${uid}:${new Date().toISOString().slice(0, 10)}`
  const n = (hits.get(key) || 0) + 1
  hits.set(key, n)
  if (n > DAILY_MAX) return res.status(429).json({ error: 'Лимит на сегодня исчерпан.' })
  if (typeof image !== 'string' || image.length < 1000 || image.length > 3_000_000) {
    return res.status(400).json({ error: 'Не удалось прочитать фото. Попробуйте другое.' })
  }

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: process.env.MODEL || 'claude-sonnet-5-5',
        max_tokens: 300,
        system: SYSTEM,
        messages: [{ role: 'user', content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image } },
          { type: 'text', text: 'Определи форму лица.' }
        ] }]
      })
    })
    if (!r.ok) throw new Error(`API ${r.status}`)
    const data = await r.json()
    const text = (data.content || []).map(c => c.text || '').join('').replace(/```json|```/g, '').trim()
    const out = JSON.parse(text)
    if (!out.face || !SHAPES.includes(out.shape)) {
      return res.status(422).json({ error: 'Не нашли чёткое лицо. Нужно фото анфас при хорошем свете.' })
    }
    return res.json({ shape: out.shape, note: String(out.note || '').slice(0, 240) })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Сервис временно недоступен. Попробуйте позже.' })
  }
}
