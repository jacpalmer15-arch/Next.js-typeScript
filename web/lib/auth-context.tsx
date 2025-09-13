'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/supabase'
import { AuthState, User, Session } from '@/lib/auth-types'

const AuthContext = createContext<{
  authState: AuthState
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}>({
  authState: { user: null, session: null, loading: true },
  signIn: async () => ({ error: 'Not implemented' }),
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  })
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await auth.getSession()
        if (session?.user) {
          setAuthState({
            user: session.user as User,
            session: session as Session,
            loading: false,
          })
        } else {
          setAuthState({
            user: null,
            session: null,
            loading: false,
          })
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        setAuthState({
          user: null,
          session: null,
          loading: false,
        })
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setAuthState({
            user: session.user as User,
            session: session as Session,
            loading: false,
          })
        } else {
          setAuthState({
            user: null,
            session: null,
            loading: false,
          })
          if (event === 'SIGNED_OUT') {
            router.push('/auth/login')
          }
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await auth.signInWithPassword(email, password)
      if (error) {
        return { error: error.message }
      }
      if (data?.user) {
        setAuthState({
          user: data.user as User,
          session: data.session as Session,
          loading: false,
        })
        router.push('/')
      }
      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    try {
      await auth.signOut()
      setAuthState({
        user: null,
        session: null,
        loading: false,
      })
      router.push('/auth/login')
    } catch {
      console.error('Error signing out')
    }
  }

  return (
    <AuthContext.Provider value={{ authState, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}