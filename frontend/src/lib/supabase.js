import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const signUp = async (email, password, name) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
    }
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getSession()
  const token = data?.session?.access_token
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('sb-token', token)
    else localStorage.removeItem('sb-token')
  }
  return { user: data?.session?.user || null, error }
}

export const startAuthListener = () => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    const token = session?.access_token
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('sb-token', token)
      else localStorage.removeItem('sb-token')
    }
  })
}
