"use client"

import React from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

// shadcn sheet imports
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
          </SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </SheetDescription>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export default MobileNavigation