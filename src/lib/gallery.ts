// src/lib/gallery.ts
// Server-only: fetches public/works images from Cloudinary and groups into sessions.

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export type Photo = { file: string; src: string }
export type Session = { id: string; label: string; date: string; photos: Photo[] }

type Rule = {
  id: string
  label: string
  date: string
  match: (filename: string) => boolean
}

// Rules are tested in order — first match wins.
const RULES: Rule[] = [
  { id: 'mo-2x',    label: 'Mo 2x',        date: '07.20.25', match: f => f.startsWith('mo 2x') },
  { id: 'mini',     label: 'Mini',          date: '07.09.25', match: f => f.startsWith('mini ') },
  { id: 'ash-rv',   label: 'Ash — RV',      date: '08.29.25', match: f => f.startsWith('ASH RV') },
  { id: 'ash-atl',  label: 'Ash — Atlanta', date: '06.21.25', match: f => f.startsWith('ASH ATL') },
  { id: 'dec-2025', label: 'December',      date: '12.12.25', match: f => f.startsWith('20251212') },
  { id: 'moni',     label: 'Moni',          date: '10.2022',  match: f => f.startsWith('MONI') },
  { id: 'fuji',     label: 'Fuji',          date: '—',        match: f => f.startsWith('DSCF') },
  { id: 'iphone',   label: 'iPhone',        date: '—',        match: f => f.startsWith('IMG_') },
  { id: 'canon',    label: 'Canon',         date: '—',        match: f => f.startsWith('_MG_') },
]

export async function getSessions(): Promise<Session[]> {
  let resources: { public_id: string; secure_url: string }[] = []

  try {
    const result = await cloudinary.api.resources({
      type:        'upload',
      prefix:      'works/',
      max_results: 500,
      resource_type: 'image',
    })
    resources = result.resources
  } catch {
    // Credentials not set or folder empty — return empty gallery
    return []
  }

  const buckets = new Map<string, Photo[]>(RULES.map(r => [r.id, []]))
  const unmatched: Photo[] = []

  for (const resource of resources) {
    // public_id is like "works/filename" — extract just the filename part
    const file = resource.public_id.replace(/^works\//, '')
    const src  = resource.secure_url
    const photo: Photo = { file, src }
    const rule = RULES.find(r => r.match(file))
    if (rule) {
      buckets.get(rule.id)!.push(photo)
    } else {
      unmatched.push(photo)
    }
  }

  const sessions: Session[] = []
  for (const rule of RULES) {
    const photos = buckets.get(rule.id)!
    if (photos.length > 0) {
      sessions.push({ id: rule.id, label: rule.label, date: rule.date, photos })
    }
  }

  if (unmatched.length > 0) {
    sessions.push({ id: 'misc', label: 'Misc', date: '—', photos: unmatched })
  }

  return sessions
}
