// This component is a server component, which is why we pass an action to the form
// The action is the signOutUser function from the user.actions.ts file
// passing an action to a form is a React 19 feature

import React from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Search from '@/components/Search'
import FileUploader from '@/components/FileUploader'
import { signOutUser } from '@/lib/actions/user.actions'

const Header = () => {
  return (
    <header className='header'>
      <Search />
      <div className='header-wrapper'>
        <FileUploader />
        <form action={async () => {
          'use server';  // the code below will be executed on the server
          await signOutUser();
        }}>
          <Button type='submit' className='sign-out-button' title='Logout' >
            <Image src="/assets/icons/logout.svg" alt="logout" width={24} height={24} className='w-6' />
          </Button>
        </form>
      </div>
    </header>
  )
}

export default Header