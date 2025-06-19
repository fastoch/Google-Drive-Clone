import React from 'react'
import Sidebar from '@/components/Sidebar'
import MobileNavigation from '@/components/MobileNavigation'
import Header from '@/components/Header'
import { getCurrentUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'

const layout = async ({children}: {children: React.ReactNode}) => {
  const currentUser = await getCurrentUser(); // fetch the current user's data (used in sidebar)
  if(!currentUser) return redirect('/sign-in'); // if no current user, redirect to sign-in page

  return (
    <main className='flex h-screen'>
      <Sidebar {...currentUser} /> {/* pass the currentUser data to the Sidebar component */}

      <section className='flex h-full flex-1 flex-col'>
        <MobileNavigation />
        <Header />
        <div className='main-content'>
          {children}
        </div>
      </section>
    </main>
  )
}

export default layout