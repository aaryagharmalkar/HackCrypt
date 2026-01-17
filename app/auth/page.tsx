'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ShieldCheck, ArrowRight, Mail, Lock, User, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        if (data.user) {
          router.push('/')
          router.refresh()
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        })

        if (error) throw error

        if (data.user) {
          setError('Success! Check your email to verify your account.')
        }
      }
    } catch (err) {
      setError((err as Error).message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20" />

      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4 shadow-lg">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Finora</h1>
          <p className="text-muted text-xs font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            Financial Wellness Platform
          </p>
        </div>

        <Card className="border-border shadow-xl bg-background">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader className="space-y-2 pb-6">
                <CardTitle className="text-2xl font-bold text-slate-900">
                  {isLogin ? 'Welcome back' : 'Create your account'}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {isLogin
                    ? 'Enter your credentials to access your financial dashboard.'
                    : 'Join thousands managing their finances smarter.'}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-4">
                    {!isLogin && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <Input
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required={!isLogin}
                            className="pl-11 text-slate-900"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-11 text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Password
                        </label>
                        {isLogin && (
                          <button type="button" className="text-[10px] font-bold text-emerald-600 hover:underline uppercase tracking-wider">
                            Forgot?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                          className="pl-11 text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {isLogin && (
                    <div className="flex items-center gap-2 ml-1">
                      <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20"
                      />
                      <label htmlFor="remember" className="text-xs font-medium text-slate-600 cursor-pointer">
                        Remember this device for 30 days
                      </label>
                    </div>
                  )}


                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "text-xs font-bold p-4 rounded-xl border flex items-start gap-3",
                        error.includes('Success')
                          ? 'bg-secondary/10 text-secondary border-secondary/20'
                          : 'bg-accent/10 text-accent border-accent/20'
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border mt-0.5",
                        error.includes('Success') ? 'border-secondary' : 'border-accent'
                      )}>
                        {error.includes('Success') ? '✓' : '!'}
                      </div>
                      <span className="leading-relaxed">{error}</span>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    variant={isLogin ? "primary" : "secondary"}
                    className="w-full h-12 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {isLogin ? 'Sign In to Dashboard' : 'Create My Account'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>

                  <div className="text-center pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin)
                        setError(null)
                      }}
                      className="text-xs text-slate-600 hover:text-slate-900 transition-colors font-bold uppercase tracking-wider"
                    >
                      {isLogin
                        ? "New here? Create an account"
                        : 'Already registered? Sign in'}
                    </button>
                  </div>
                </form>
              </CardContent>
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* Footer */}
        <p className="text-center text-[10px] font-medium text-slate-500 mt-6 leading-relaxed">
          By continuing, you agree to our{' '}
          <span className="text-slate-900 font-bold cursor-pointer hover:underline">Terms</span>
          {' '}and{' '}
          <span className="text-slate-900 font-bold cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  )
}
