// components/nav-bar.tsx
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { NavBarClient } from '@/components/nav-bar-client'

export async function NavBarWrapper() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  const isLoggedIn = !!session

  return <NavBarClient isLoggedIn={isLoggedIn} />
}
