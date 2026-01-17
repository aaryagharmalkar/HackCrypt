'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isInitialMount = useRef(true)

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && !pathname?.startsWith('/auth')) {
        router.push('/auth')
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Only handle sign out, and initial sign in (not TOKEN_REFRESHED or other events)
      if (event === 'SIGNED_OUT') {
        router.push('/auth')
        router.refresh()
      } else if (event === 'SIGNED_IN' && isInitialMount.current && pathname?.startsWith('/auth')) {
        // Only redirect to dashboard if we're on the auth page during initial sign in
        router.push('/')
        router.refresh()
      }
      
      if (isInitialMount.current) {
        isInitialMount.current = false
      }
    })

    return () => subscription.unsubscribe()
  }, [router, pathname])

  return <>{children}</>
}
