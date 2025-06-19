"use client"; // required because we use a React hook (usePathname)

import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { navItems } from '@/constants'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className='sidebar'>
      {/* link to home page */}
      <Link href="/"> 
        {/* Logo for larger screens */}
        <Image 
          src="/assets/icons/logo-full-brand.svg" 
          alt="logo" 
          width={160} height={50} 
          className='hidden h-auto lg:block'
        />
        {/* Logo for smaller screens */}
        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52}
          className='lg:hidden'
        />
      </Link>

      <nav className='sidebar-nav'>
        <ul className='flex flex-1 flex-col gap-6'>
          {/* populating the list via @/constants/index.ts */}
          {navItems.map(({name, icon, url}) => {
            const active = pathname === url; // if the current pathname is the same as the item's url, then it's active
            return <Link href={url}></Link>  // if active, then render the link
          })}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar