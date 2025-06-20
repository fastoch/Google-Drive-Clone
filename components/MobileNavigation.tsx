"use client"

import React from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { navItems } from '@/constants'
import { cn } from '@/lib/utils';
import Link from 'next/link'
import { Button } from './ui/button'
import FileUploader from './FileUploader' 
import { signOutUser } from '@/lib/actions/user.actions'

// shadcn sheet imports
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// shadcn separator
import { Separator } from "@/components/ui/separator"

interface Props {
  ownerId: string;  // file owner's ID
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}

const MobileNavigation = ({ ownerId, accountId, fullName, avatar, email}: Props) => {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className='mobile-header'>
      <Image src="/assets/icons/logo-full-brand.svg" alt="search" width={120} height={52} className='h-auto' />
      {/* shadcn sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image src="/assets/icons/menu.svg" alt="hamburger" width={30} height={30} />
        </SheetTrigger>
        <SheetContent className='shad-sheet h-screen px-3'>
          <SheetTitle>
            <div className='header-user'>
              <Image src={avatar} alt="avatar" width={44} height={44} className='header-user-avatar' />
              <div className='sm:hidden lg:block'>
                <p className='subtitle-2 capitalize'>{fullName}</p>
                <p className='caption'>{email}</p>
              </div>
            </div>
            <Separator className='mb-4 bg-light-200/20' />
          </SheetTitle>
          
          <nav className='mobile-nav'>
            <ul className='mobile-nav-list'>
              {/* populating the list via navItems declared in @/constants/index.ts */}
              {navItems.map(({name, icon, url}) => (
                <Link key={name} href={url} className='lg:w-full'>
                  <li className={cn(                      // cn is a utility function from shadcn/ui
                    'mobile-nav-item',                   // this class is always applied
                    pathname === url && 'shad-active')}   // if pathname is equal to url, add the class "shad-active"
                  > 
                    <Image 
                      src={icon} 
                      alt={name}
                      width={24}
                      height={24}
                      className={cn(
                        'nav-icon',                         // every image will have this class applied
                        pathname === url && 'nav-icon-active'   // only add "shad-active" if pathname is equal to url
                      )}
                    />
                    <p>{name}</p>
                  </li>
                </Link>  
              ))}
            </ul>
          </nav>
          
          <Separator className='my-5 bg-light-200/20' />

          <div className='flex flex-col justify-between gap-5 pb-5'>
            <FileUploader />
            <Button 
              type='submit' 
              className='mobile-sign-out-button' 
              title="Log Out" 
              onClick={async () => await signOutUser()}
            >
              <Image src="/assets/icons/logout.svg" alt="logout" width={24} height={24} />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export default MobileNavigation