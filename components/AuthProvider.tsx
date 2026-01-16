'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && !window.location.pathname.startsWith('/auth')) {
        router.push('/auth')
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/')
        router.refresh()
      } else if (event === 'SIGNED_OUT') {
        router.push('/auth')
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  return <>{children}</>
}
