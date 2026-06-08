import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Layers, ArrowRight, Sparkles } from 'lucide-react'

export default function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
    const payload = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
    }

    try {
      const { data } = await axios.post(endpoint, payload)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setToken(data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred')
    }
  }

  return (
    <div className="app-shell relative flex min-h-screen items-center justify-center overflow-hidden p-4 font-sans text-accent-ink">
      <div className="aurora-grid absolute inset-0 opacity-80" />
      <div className="orbit-line -left-[18%] top-[4%] h-[680px] w-[860px] rotate-[-18deg]" />
      <div className="orbit-line right-[-22%] top-[-24%] h-[760px] w-[960px] rotate-[22deg]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#100d18] via-[#211736]/50 to-transparent" />

      <div className="relative z-10 grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="hidden lg:block">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/58 px-4 py-2 text-sm font-bold text-accent-ink/64 shadow-sm backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-accent-mint" />
            Project board online
          </div>

          <h1 className="max-w-3xl text-balance text-6xl font-bold leading-[0.98] tracking-tight text-accent-ink xl:text-7xl">
            Shape your work into a calmer flow.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-accent-ink/58">
            A polished Kanban workspace for planning, assigning, and shipping tasks with a team.
          </p>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {[
              ['08', 'Open lanes'],
              ['24', 'Active tasks'],
              ['99%', 'Focused view'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-[24px] border border-white/65 bg-white/48 p-4 shadow-[0_18px_50px_rgba(39,27,67,0.09)] backdrop-blur-2xl">
                <p className="font-mono text-2xl font-bold text-accent-ink">{value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-accent-ink/38">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="graphite-panel rounded-[30px] p-4 text-white">
            <div className="mb-7 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-accent-ink shadow-lg">
                  <Layers size={23} />
                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-accent-mint ring-2 ring-[#4f4c54]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">TaskFlow</h2>
                  <p className="text-xs font-medium text-white/42">{isLogin ? 'Welcome back' : 'Create workspace'}</p>
                </div>
              </div>
              <Sparkles size={18} className="text-accent-mint" />
            </div>

            {error && (
              <div className="mb-4 rounded-2xl border border-red-300/25 bg-red-400/10 p-3 text-sm font-semibold text-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <Field label="Name">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="auth-input"
                    placeholder="John Doe"
                  />
                </Field>
              )}

              <Field label="Email">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="you@example.com"
                />
              </Field>

              <Field label="Password">
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="********"
                />
              </Field>

              <button
                type="submit"
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-bold text-accent-ink shadow-lg transition hover:-translate-y-0.5 hover:bg-[#f6f1ff]"
              >
                {isLogin ? 'Sign In' : 'Sign Up'}
                <ArrowRight size={16} />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-white/50">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setIsLogin(!isLogin); setError('') }}
                className="font-bold text-white transition hover:text-accent-mint"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-white/42">{label}</label>
      {children}
    </div>
  )
}
