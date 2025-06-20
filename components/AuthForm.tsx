"use client"

import React, { useState } from 'react';

import { set, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signInUser } from '@/lib/actions/user.actions';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from 'next/image';
import Link from 'next/link';
import { create } from 'domain';
import { createAccount } from '@/lib/actions/user.actions';
import OTPModal from './OTPModal';

// default form schema provided by shadcn
// const formSchema = z.object({
//   username: z.string().min(2).max(50),
// })

type FormType = 'sign-in' | 'sign-up';

// our custom form schema where the fullName field only shows when the user is signing up
const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName: formType === 'sign-up' ? z.string().min(2).max(50) : z.string().optional(),
  })
}

const AuthForm = ({ type }: { type: FormType }) => {
  // adding a loading state for the form submit button
  const [isLoading, setIsLoading] = useState(false);
  // error message state
  const [errorMessage, setErrorMessage] = useState('');
  // accountId state for when a new user is created (sign-up)
  const [accountId, setAccountId] = useState(null);

  const formSchema = authFormSchema(type); // using our custom form schema and passing in the form type

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: '',
    },
  })
 
  // 2. Define a submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true); // set loading state to true because we're about to send a request to the server
    setErrorMessage(''); // clears any previous error message from the UI before a new submission attempt

    // create a new user account if not already existing (see user.actions.ts)
    try {
      const user = 
        // if the user is signing up, create a new user account
        type === 'sign-up' ? 
          await createAccount({  
          fullName: values.fullName || '',  // empty string if the user is trying to sign in
          email: values.email 
          })
        // else, sign in the user
        : await signInUser({email: values.email});
      setAccountId(user.accountId);  // set the accountId state to the user's accountId
    } catch {
      setErrorMessage("Failed to create an account. Please try again.");
    } finally {
      setIsLoading(false); // set loading state to false because we're done with the request
    }
  }

  return (
    // wrapping the form in an empty React fragment because our component returns other sibling elements => OTP verification
    // https://www.perplexity.ai/search/why-wrapping-a-form-into-an-em-HaLJWLdJSO6dBpw7E7qKGw
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "sign-in" ? "Sign In" : "Sign Up"} 
          </h1>
          {/* The fullName form field will only show if the user is signing up */}
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" className="shad-input" {...field} />
                    </FormControl>
                  </div>  
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}
          {/* The email form field will always show */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" className="shad-input" {...field} />
                  </FormControl>
                </div>  
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          {/* since we're using OTP verification, we don't need a password field */}

          {/* disable the button if the page is loading, so the user can't click it */}
          <Button type="submit" className="form-submit-button" disabled={isLoading}>
            {type === "sign-in" ? "Sign In" : "Sign Up"}
            {isLoading && (
              <Image src="/assets/icons/loader.svg" alt="loader" width={24} height={24} className="ml-2 animate-spin" />
            )}
          </Button>
          
          {/* show the error message if there is one */}
          {errorMessage && (
            <p className="error-message">*{errorMessage}</p>
          )}

          <div className='body-2 flex justify-center'>
            <p className='text-light-100'>
              {type === "sign-in" ? "Don't have an account?" : "Already have an account?"}
            </p>
            {/* send the user to the proper auth page */}
            <Link href={type === "sign-in" ? "/sign-up" : "/sign-in"} className="ml-2 font-medium text-brand">
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>

      {/* OTP Verification */}
      {/* show the OTP modal once we get the accountId from the server */}
      {accountId && <OTPModal email={form.getValues('email')} accountId={accountId} />}
    </>
  )
}

export default AuthForm