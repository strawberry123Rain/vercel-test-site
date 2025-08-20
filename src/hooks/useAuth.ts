import { useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { DbUser, Role } from '../lib/types'

export interface AuthState {
  isLoading: boolean
  session: Session | null
  user: User | null
  profile: DbUser | null
}

// TEMPORÄRT: Bypassa auth för utveckling
const DEV_BYPASS_AUTH = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true'

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isLoading: DEV_BYPASS_AUTH ? false : true,
    session: DEV_BYPASS_AUTH ? {} as any : null,
    user: DEV_BYPASS_AUTH ? { id: 'dev-user', email: 'dev@test.se' } as any : null,
    profile: DEV_BYPASS_AUTH ? { id: 'dev-user', role: 'admin', name: 'Dev User', email: 'dev@test.se' } as any : null,
  })

  if (DEV_BYPASS_AUTH) {
    console.log('🔐 DEV MODE: Auth bypassed')
    return { ...state, role: 'admin', signOut: async () => console.log('Dev signout') }
  }

  useEffect(() => {
    let isMounted = true
    console.log('🔐 useAuth: Starting auth check...')

    const init = async () => {
      try {
        console.log('🔐 useAuth: Getting session...')
        const { data, error } = await supabase.auth.getSession()
        console.log('🔐 useAuth: Session data:', data, 'Error:', error)
        
        const session = data.session
        let profile: DbUser | null = null
        
        if (session?.user) {
          console.log('🔐 useAuth: User found:', session.user.email)
          const { data: profileRows, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()
          console.log('🔐 useAuth: Profile data:', profileRows, 'Error:', profileError)
          profile = (profileRows as unknown as DbUser) ?? null
        } else {
          console.log('🔐 useAuth: No session found')
        }
        
        if (isMounted) {
          setState({ isLoading: false, session: session ?? null, user: session?.user ?? null, profile })
        }
      } catch (err) {
        console.error('🔐 useAuth: Error in init:', err)
      }
    }

    init()

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('🔐 useAuth: Auth state changed:', _event, session?.user?.email)
      let profile: DbUser | null = null
      if (session?.user) {
        const { data: profileRows } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()
        profile = (profileRows as unknown as DbUser) ?? null
      }
      if (isMounted) setState({ isLoading: false, session: session ?? null, user: session?.user ?? null, profile })
    })

    return () => {
      isMounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const role: Role | null = useMemo(() => state.profile?.role ?? null, [state.profile])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { ...state, role, signOut }
}


