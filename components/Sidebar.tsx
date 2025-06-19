"use client"; // required because we use a React hook (usePathname)

import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { navItems } from '@/constants'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils';
import { avatarPlaceholderUrl } from '@/constants';

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
          {/* populating the list via navItems declared in @/constants/index.ts */}
          {navItems.map(({name, icon, url}) => (
            <Link key={name} href={url} className='lg:w-full'>
              <li className={cn(                      // cn is a utility function from shadcn/ui
                'sidebar-nav-item',                   // this class is always applied
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
                <p className='hidden lg:block'>{name}</p>
              </li>
            </Link>  
          ))}
        </ul>
      </nav>

      <Image 
        src="/assets/images/files-2.png"
        alt="logo"
        width={506}
        height={418}
        className='w-full'
      />

      <div className='sidebar-user-info'>
        <Image 
          src={avatarPlaceholderUrl}
          alt="avatar"
          width={44}
          height={44}
          className='sidebar-user-avatar'
        />
      </div>
    </aside>
  )
}

export default Sidebar