// src/lib/gallery.ts
// Server-only: fetches images from Cloudinary, reads EXIF shoot dates,
// and groups photos into Season + Year sessions (most recent first).

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export type Photo   = { file: string; src: string }
export type Session = { id: string; label: string; date: string; photos: Photo[] }

// ── Date helpers ────────────────────────────────────────────────────────────

/** Parse EXIF DateTimeOriginal / DateTime → JS Date, or null if missing/invalid */
function parseExifDate(metadata?: Record<string, string>): Date | null {
  const raw = metadata?.DateTimeOriginal ?? metadata?.DateTime
  if (!raw) return null
  // EXIF format: "YYYY:MM:DD HH:MM:SS"
  const [datePart] = raw.split(' ')
  const [y, m, d] = (datePart ?? '').split(':').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

function getSeason(month: number): 'Winter' | 'Spring' | 'Summer' | 'Fall' {
  if (month <= 2 || month === 12) return 'Winter'
  if (month <= 5) return 'Spring'
  if (month <= 8) return 'Summer'
  return 'Fall'
}

/** Bucket key — e.g. "summer-2025" */
function bucketKey(date: Date): string {
  const m    = date.getMonth() + 1
  const y    = date.getFullYear()
  return `${getSeason(m).toLowerCase()}-${y}`
}

/** Human label — e.g. "Summer 2025" */
function bucketLabel(date: Date): string {
  const m = date.getMonth() + 1
  const y = date.getFullYear()
  return `${getSeason(m)} ${y}`
}

/** Short month-range string shown alongside the label — e.g. "Jun – Aug" */
const SEASON_MONTHS: Record<string, string> = {
  Winter: 'Dec – Feb',
  Spring: 'Mar – May',
  Summer: 'Jun – Aug',
  Fall:   'Sep – Nov',
}

// ── Main export ─────────────────────────────────────────────────────────────

export async function getSessions(): Promise<Session[]> {
  type Resource = {
    public_id:      string
    secure_url:     string
    created_at:     string
    image_metadata?: Record<string, string>
  }

  let resources: Resource[] = []

  try {
    const result = await cloudinary.api.resources({
      type:           'upload',
      max_results:    500,
      resource_type:  'image',
      image_metadata: true,      // pull EXIF shoot date
    })
    resources = result.resources
  } catch {
    return []
  }

  // id → { label, monthRange, newestDate, photos }
  type Bucket = { label: string; monthRange: string; newestDate: Date; photos: Photo[] }
  const buckets = new Map<string, Bucket>()
  const undated: Photo[] = []

  for (const r of resources) {
    const file  = r.public_id.replace(/_[a-z0-9]{6}$/, '')
    const src   = r.secure_url
    const photo: Photo = { file, src }

    // Prefer EXIF shoot date; fall back to Cloudinary upload date
    const date = parseExifDate(r.image_metadata) ?? new Date(r.created_at)

    if (isNaN(date.getTime())) {
      undated.push(photo)
      continue
    }

    const key    = bucketKey(date)
    const label  = bucketLabel(date)
    const season = getSeason(date.getMonth() + 1)

    if (!buckets.has(key)) {
      buckets.set(key, {
        label,
        monthRange: SEASON_MONTHS[season],
        newestDate: date,
        photos:     [],
      })
    }

    const bucket = buckets.get(key)!
    bucket.photos.push(photo)
    if (date > bucket.newestDate) bucket.newestDate = date
  }

  // Sort seasons most-recent-first
  const sessions: Session[] = Array.from(buckets.entries())
    .sort(([, a], [, b]) => b.newestDate.getTime() - a.newestDate.getTime())
    .map(([id, { label, monthRange, photos }]) => ({
      id,
      label,
      date: monthRange,
      photos,
    }))

  if (undated.length > 0) {
    sessions.push({ id: 'undated', label: 'Undated', date: '—', photos: undated })
  }

  return sessions
}
