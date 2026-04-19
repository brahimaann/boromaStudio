'use client'

// src/app/capabilities/IntakeDrawer.tsx

import { useState, useEffect } from 'react'

type Props = {
  selectedService: string
  onClose: () => void
}

export default function IntakeDrawer({ selectedService, onClose }: Props) {
  const [step, setStep]               = useState(1)
  const [name, setName]               = useState('')
  const [email, setEmail]             = useState('')
  const [budgetFrom, setBudgetFrom]   = useState('')
  const [budgetTo, setBudgetTo]       = useState('')
  const [scope, setScope]             = useState('')
  const [submitting, setSubmitting]   = useState(false)
  const [submitted, setSubmitted]     = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // ESC closes the drawer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError('')

    const budgetRange = budgetTo.trim()
      ? `${budgetFrom.trim()} — ${budgetTo.trim()}`
      : budgetFrom.trim()

    const payload = {
      service:   selectedService,
      name:      name.trim(),
      email:     email.trim(),
      budget:    budgetRange,
      scope:     scope.trim(),
      timestamp: new Date().toISOString(),
    }

    try {
      const res = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || 'Unknown error')
      setSubmitted(true)
      setTimeout(onClose, 2000)
    } catch {
      setSubmitError('Something went wrong — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const canContinue = name.trim().length > 0 && email.trim().length > 0
  const canSubmit   = budgetFrom.trim().length > 0 && scope.trim().length > 0

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* ── Drawer panel ──────────────────────────────────────────────── */}
      <div
        className="drawer-enter fixed bottom-0 md:top-0 md:right-0 md:bottom-auto z-50
                   w-full md:w-[460px] md:h-full
                   flex flex-col"
        style={{ background: '#FAFAFA', color: '#000' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-black/8 shrink-0">
          <div>
            <p className="font-mono text-[8px] uppercase tracking-[3px] text-black/35 mb-1">
              start a project
            </p>
            <p className="font-mono text-[11px] tracking-wide text-black/80">
              {selectedService}
            </p>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-[9px] uppercase tracking-[3px] text-black/35 hover:text-black/80 transition-colors duration-150 mt-1"
          >
            close
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex gap-1.5 px-8 pt-5 pb-1 shrink-0">
          {[1, 2].map(n => (
            <div
              key={n}
              className="h-[2px] w-8 transition-colors duration-300"
              style={{ background: step >= n ? '#000' : '#00000020' }}
            />
          ))}
          <span className="font-mono text-[8px] text-black/30 ml-2 self-center tracking-widest">
            {step} / 2
          </span>
        </div>

        {/* Form body — scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-8">

          {/* ── Step 1 ─────────────────────────────────────────────── */}
          {step === 1 && (
            <div className="flex flex-col gap-8">
              <p className="font-mono text-[10px] leading-loose text-black/45 tracking-wide">
                Tell us who you are. We'll follow up within 48 hours.
              </p>

              <div className="flex flex-col gap-6">
                {/* Name */}
                <label className="flex flex-col gap-2">
                  <span className="font-mono text-[8px] uppercase tracking-[3px] text-black/35">
                    Name
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Full name"
                    autoFocus
                    className="font-mono text-[11px] text-black bg-transparent border-b border-black/20
                               focus:border-black/60 outline-none pb-2 transition-colors duration-150
                               placeholder:text-black/20 w-full"
                  />
                </label>

                {/* Email */}
                <label className="flex flex-col gap-2">
                  <span className="font-mono text-[8px] uppercase tracking-[3px] text-black/35">
                    Email
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="font-mono text-[11px] text-black bg-transparent border-b border-black/20
                               focus:border-black/60 outline-none pb-2 transition-colors duration-150
                               placeholder:text-black/20 w-full"
                  />
                </label>
              </div>
            </div>
          )}

          {/* ── Step 2 ─────────────────────────────────────────────── */}
          {step === 2 && (
            <div className="flex flex-col gap-8">

              {/* Budget range — free form */}
              <div className="flex flex-col gap-3">
                <span className="font-mono text-[8px] uppercase tracking-[3px] text-black/35">
                  Budget Range
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[8px] text-black/25 tracking-widest">From</span>
                    <div className="flex items-baseline gap-1 border-b border-black/20 focus-within:border-black/60 transition-colors duration-150 pb-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={budgetFrom}
                        onChange={e => setBudgetFrom(e.target.value)}
                        placeholder="$$"
                        className="font-mono text-[11px] text-black bg-transparent outline-none w-full placeholder:text-black/20"
                      />
                    </div>
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[8px] text-black/25 tracking-widest">To <span className="text-black/15">(optional)</span></span>
                    <div className="flex items-baseline gap-1 border-b border-black/20 focus-within:border-black/60 transition-colors duration-150 pb-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={budgetTo}
                        onChange={e => setBudgetTo(e.target.value)}
                        placeholder="$$$$"
                        className="font-mono text-[11px] text-black bg-transparent outline-none w-full placeholder:text-black/20"
                      />
                    </div>
                  </label>
                </div>
              </div>

              {/* Scope */}
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[8px] uppercase tracking-[3px] text-black/35">
                  Scope Definition
                </span>
                <textarea
                  value={scope}
                  onChange={e => setScope(e.target.value)}
                  placeholder="Describe the project — deliverables, timeline, and any specific requirements."
                  rows={6}
                  className="font-mono text-[11px] text-black bg-transparent border border-black/15
                             focus:border-black/40 outline-none p-3 transition-colors duration-150
                             placeholder:text-black/20 w-full resize-none leading-loose"
                />
              </label>

            </div>
          )}
        </div>

        {/* Footer actions */}
        <div
          className="flex items-center justify-between px-8 py-6 border-t border-black/8 shrink-0"
          style={{ background: '#FAFAFA' }}
        >
          {step === 1 ? (
            <>
              <span />
              <button
                onClick={() => setStep(2)}
                disabled={!canContinue}
                className={[
                  'font-mono text-[9px] uppercase tracking-[3px] transition-colors duration-150 px-4 py-2 border',
                  canContinue
                    ? 'border-black/60 text-black hover:bg-black hover:text-white'
                    : 'border-black/10 text-black/20 cursor-not-allowed',
                ].join(' ')}
              >
                Continue →
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="font-mono text-[9px] uppercase tracking-[3px] text-black/40 hover:text-black/80 transition-colors duration-150"
              >
                ← Back
              </button>
              <div className="flex flex-col items-end gap-1">
                {submitError && (
                  <p className="font-mono text-[8px] text-red-500 tracking-wide">
                    {submitError}
                  </p>
                )}
                {submitted ? (
                  <p className="font-mono text-[9px] uppercase tracking-[3px] text-black/50">
                    We'll be in touch ✓
                  </p>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit || submitting}
                    className={[
                      'font-mono text-[9px] uppercase tracking-[3px] transition-all duration-150 px-4 py-2 border',
                      canSubmit && !submitting
                        ? 'border-black bg-black text-white hover:bg-transparent hover:text-black'
                        : 'border-black/10 text-black/20 cursor-not-allowed',
                    ].join(' ')}
                  >
                    {submitting ? 'Sending...' : 'Submit'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
