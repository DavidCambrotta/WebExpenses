import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
    // on success onAuthStateChange fires → App re-renders with session → Overview shown
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-title">WebExpenses</h1>
        <p className="login-sub">Inicia sessão para continuar</p>

        {error && <p className="login-error">{error}</p>}

        <label className="login-label">
          Email
          <input
            className="login-input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="login-label">
          Palavra-passe
          <input
            className="login-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? 'A entrar…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
