"use client"

import React from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

// shadcn sheet imports
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const MobileNavigation = () => {
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
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export default MobileNavigation