import React from 'react'
import { Button } from '@/components/ui/button'

const Header = () => {
  return (
    <header className='header'>
      Search
      <div className='header-wrapper'>
        FileUploader component
        <form>
          <Button type='submit' className='sign-out-button'>

          </Button>
        </form>
      </div>
    </header>
  )
}

export default Header