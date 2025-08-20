import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL as string | undefined
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD as string | undefined

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { 
    document.title = 'Login - Newsec Drift'
    
    // Testa Supabase connection
    const testConnection = async () => {
      console.log('🔗 Testing Supabase connection...')
      console.log('🔗 URL:', import.meta.env.VITE_SUPABASE_URL)
      console.log('🔗 Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
      
      try {
        const { data, error } = await supabase.from('properties').select('count').limit(1)
        console.log('🔗 Connection test result:', { data, error })
      } catch (err) {
        console.error('🔗 Connection test failed:', err)
      }
    }
    
    testConnection()
  }, [])

  const signIn = async (e?: React.FormEvent, creds?: { email: string; password: string }) => {
    if (e) e.preventDefault()
    setError(null); setLoading(true)
    
    console.log('🔐 Attempting sign in with:', creds?.email ?? email)
    
    const { error } = await supabase.auth.signInWithPassword({
      email: creds?.email ?? email,
      password: creds?.password ?? password,
    })
    
    console.log('🔐 Sign in result:', { error })
    
    setLoading(false)
    if (error) return setError(error.message)
    navigate('/', { replace: true })
  }

  const handleDevBypass = () => {
    // Set a session storage flag to indicate dev bypass
    sessionStorage.setItem('devBypassAuth', 'true')
    console.log('🔧 Dev bypass enabled - navigating to dashboard')
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#fff' }}>
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded" style={{ background: '#161C3B' }} />
          <div className="text-2xl font-semibold" style={{ color: '#161C3B' }}>Newsec Drift</div>
        </div>
        
        {DEMO_EMAIL && DEMO_PASSWORD && (
          <div className="rounded-lg border bg-white p-3 text-sm">
            <div className="font-medium mb-1" style={{ color: '#161C3B' }}>Demo-inlogg</div>
            <div className="text-gray-700">E‑post: {DEMO_EMAIL}</div>
            <div className="text-gray-700 mb-2">Lösenord: {DEMO_PASSWORD}</div>
            <div className="flex gap-2">
              <button
                className="px-3 py-2 rounded border text-sm"
                onClick={() => { setEmail(DEMO_EMAIL); setPassword(DEMO_PASSWORD) }}
              >Fyll i demo</button>
              <button
                className="px-3 py-2 rounded text-white text-sm"
                style={{ background: '#4F6CF5' }}
                onClick={() => signIn(undefined, { email: DEMO_EMAIL, password: DEMO_PASSWORD })}
              >Logga in som demo</button>
            </div>
          </div>
        )}

        <form onSubmit={signIn} className="w-full rounded-lg border bg-white p-6 space-y-4 shadow-sm">
          <h1 className="text-xl font-semibold" style={{ color: '#161C3B' }}>Logga in</h1>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <input
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2"
            style={{ borderColor: '#E5E7EB', outlineColor: '#4F6CF5' }}
            placeholder="E‑post"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2"
            style={{ borderColor: '#E5E7EB', outlineColor: '#4F6CF5' }}
            placeholder="Lösenord"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button disabled={loading} className="px-3 py-2 rounded text-white w-full" style={{ background: '#161C3B' }}>
            {loading ? 'Loggar in…' : 'Logga in'}
          </button>
          <div className="text-xs text-gray-500 text-center">
            Behöver du hjälp? <span className="font-medium" style={{ color: '#FF6000' }}>Kontakta support</span>
          </div>
        </form>

        {/* Dev Tools */}
        <div className="mt-4 p-3 bg-yellow-50 border rounded">
          <div className="text-sm font-medium mb-2">🔧 Dev Tools</div>
          <div className="space-y-2">
            <button 
              onClick={handleDevBypass}
              className="px-3 py-2 bg-yellow-500 text-white rounded text-sm w-full"
            >
              Bypass Login (Dev)
            </button>
            <button 
              onClick={() => console.log('🔐 Current env:', { 
                url: import.meta.env.VITE_SUPABASE_URL,
                keyExists: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
                devBypass: import.meta.env.VITE_DEV_BYPASS_AUTH,
                sessionBypass: sessionStorage.getItem('devBypassAuth')
              })}
              className="px-3 py-2 bg-gray-500 text-white rounded text-sm w-full"
            >
              Log Environment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}