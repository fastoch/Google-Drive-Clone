"use client"; // this is a client component

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { verifySecret } from '@/lib/actions/user.actions'

// shadcn alert-dialog imports
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"

// shadcn input-otp imports
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const OTPModal = ({accountId, email}:{accountId:string, email: string} ) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(true); // initial state is 'true' to show the modal as soon as we get the accountId
  const [password, setPassword] = React.useState(''); // state for the OTP value
  const [isLoading, setIsLoading] = React.useState(false); // state for the loading state

  // OTP submission handler
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // prevents the default form submission behavior (page reload)
    setIsLoading(true); // show the loading spinner while the OTP is being verified
    try {
      // call API to verify the OTP
      const sessionId = await verifySecret({
        accountId,
        password
      });

      if(sessionId) {
        router.push("/"); // redirect to the home page
      }
    } catch(error) {
      console.log('Failed to verify OTP', error);
    }
    setIsLoading(false); // hide the loading spinner
  };

  // for users who haven't used the OTP within 15 minutes
  const handleResendOTP = async() => {
    // call API to resend the OTP email
  }

  return (
    // using the shadcn alert dialog component
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className='shad-alert-dialog'>
        <AlertDialogHeader className='relative flex justify-center'>
          <AlertDialogTitle className='h2 text-center'>
            Enter your OTP
            <Image 
              src="/assets/icons/close-dark.svg" 
              alt="close" 
              width={20} height={20} 
              onClick={() => setIsOpen(false)} 
              className="otp-close-button" 
            />
          </AlertDialogTitle>
          <AlertDialogDescription className='subtitle-2 text-center text-light-100'>
            We have sent a code to <span className='text-brand'>{email}</span>. Please enter it below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* shadcn input-otp component */}
        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className='shad-otp'>
            <InputOTPSlot index={0} className='shad-otp-slot'/>
            <InputOTPSlot index={1} className='shad-otp-slot'/>
            <InputOTPSlot index={2} className='shad-otp-slot'/>
            <InputOTPSlot index={3} className='shad-otp-slot'/>
            <InputOTPSlot index={4} className='shad-otp-slot'/>
            <InputOTPSlot index={5} className='shad-otp-slot'/>
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className='flex w-full flex-col gap-4'>
            <AlertDialogAction 
              onClick={handleSubmit} 
              className='shad-submit-btn h-12'
              type="button"
            >Submit
            {isLoading && (
              <Image 
                src="/assets/icons/loader.svg" 
                alt="loader" 
                width={24} height={24} 
                className="ml-2 animate-spin" 
              />
            )}
            </AlertDialogAction>

            <div className='subtitle-2 mt-2 text-center text-light-100'>
              Didn't get a code?
              <Button 
                type="button" 
                variant="link" 
                className='pl-2 text-brand'
                onClick={handleResendOTP}
              >Resend OTP
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default OTPModal