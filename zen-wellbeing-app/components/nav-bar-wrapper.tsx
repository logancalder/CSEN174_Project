import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NavBarClient } from './nav-bar-client'

export async function NavBarWrapper() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log("[Server] Session in NavBarWrapper:", session)

  return <NavBarClient isLoggedIn={!!session} />
}
