"use client"

import React, { useState } from 'react';

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from 'next/image';

const formSchema = z.object({
  fullName: z.string().min(2).max(50),
  email: z.string().email(),
})

type FormType = 'sign-in' | 'sign-up';

const AuthForm = ({ type }: { type: FormType }) => {
  // adding a loading state
  const [isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  })
 
  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
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
          {/* The form field will only show if the user is signing up */}
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
          <Button type="submit" className="form-submit-button">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
            {isLoading && (
              <Image src="/assets/icons/loader.svg" alt="loader" width={24} height={24} className="ml-2 animate-spin" />
            )}
          </Button>
        </form>
      </Form>

      {/* OTP Verification (one-time password) will happen here */}
    </>
    
  )
}

export default AuthForm