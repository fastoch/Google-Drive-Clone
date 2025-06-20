# Tech Stack

- Next.js 15 (a framework for building web applications with React components)
- TypeScript
- Tailwind CSS (custom classes declared in the `globals.css` file)
- shadcn/ui (a UI component library)
- Chart.js (customizable charting library for JavaScript apps)
- appwrite (provides backend functionality: database, storage, authentication)

# Features

- authentication page (sign in) + registration page (sign up)
- secured OTP authentication (one-time password)
- dashboard that allows us to track storage and recent uploads
- upload button 
- multi-file upload
- different file types organized into categories (images, documents, media, others)
- file management: share, rename, download, preview, delete, check details
- files can be sorted by name, size, date
- global search to find any uploaded file 
- responsive UI that works on all devices

---

# Implementing the project

- to run the app in dev mode, run `npm run dev`
- then go to http://localhost:3000/sign-up or http://localhost:3000/sign-in

---

## Authentication pages

- Login page
- Registration page

The files for that part are located in the `app/(auth)` folder of our project.  
- This route group folder contains a sign-in folder and a sign-up folder. 
- each of thesee folders contains a `page.tsx` file 
By creating the (auth) route group, we can implement a shared UI for both pages: `layout.tsx`.  

This common layout allows us to implement the left side of both our authentication pages.  
Now we can focus on the right side of the pages, the authentication Form.

## Implementing the authentication form

- we create a new folder called `components`, and within it, we create a file named `AuthForm.tsx`
- We will use the React Hook Form from shadcn/ui to implement this form
- this form will be common to both the sign-in and sign-up pages

https://ui.shadcn.com/docs/components/form#create-a-form-schema  

### Note - about the form

We wrap the form into an empty React fragment `<></>` because our component will render multiple elements:
- the form
- the submit button
- a link to the sign-in or sign-up page
- the OTP verification window

More info: https://www.perplexity.ai/search/why-wrapping-a-form-into-an-em-HaLJWLdJSO6dBpw7E7qKGw

---

# Appwrite (backend)

We will use Appwrite as our backend service. This will allow us to:
- register new users
- authenticate users
- store files in the cloud

Our environment variables are stored in the `.env.local` file.  
Since this file is gitignored, we need to export our env variables via the `/lib/appwrite/config.ts` file.  
Then we can import them into the `index.ts` file: `import { appwriteConfig } from '@/lib/appwrite/config';` 

## Allowing our users to sign up (first server action)

see `lib/actions/user.actions.ts` + submit handler in `components/AuthForm.tsx`  
This component is functional, we can sign up and are redirected to the home page.

## OTP Modal (only used on the sign-up page)

see `components/OTPModal.tsx` + at the bottom of `components/AuthForm.tsx`  

once again, we'll use shadcn/ui to implement this OTP modal: 
- `npx shadcn@latest add alert-dialog`
- `npx shadcn@latest add input-otp`

Note: the InputOTP component has to be placed between the AlertDialogHeader and the AlertDialogFooter components.  

# Implementing the dashboard (home page)

- in our `app` folder, we create a new route group (like we did for the auth pages) called `(root)`
- within it, we create a new `layout.tsx` file
- type `rafce` to create a new React functional component (requires React snippet extension for VSCodium)
- as any layout, it will receive a `children` prop
- move the `page.tsx` file from the `app/` folder to the `app/(root)` folder
- within the `components` folder, we create new files called:
  - `Sidebar.tsx`
  - `MobileNavigation.tsx`
  - `Header.tsx`
  - `Searcch.tsx`
  - `FileUploader.tsx`

## Sidebar component

For the list items in the navbar of our Sidebar component (aside > nav > ul): 
- we created a dedicated folder named `constants` at the root of our project.  
- this folder contains a file named `index.ts` that will populate the list items.

### Note - about using CDNs for our assets

- we can use a CDN (Content Delivery Network) to host our assets (images, videos, etc.)
- but to do that with Next.js, we need to configure each host in our `next.config.ts` file

https://nextjs.org/docs/messages/next-image-unconfigured-host

### Fetch the current user (so we can use fullName and email in the sidebar)

The session data (email, fullName) is provided by the `layout.tsx `file located in the `app/(root)` folder.  
That is because this file "supplies" our different components: sidebar, Header, etc.  

To access the session data, we need to:
- create a new function in our `user.actions.ts` file. This function will fetch the current user
- we can then use this function

### Tip - remove the Next.js indicator while in dev mode

- in the `next.config.ts` file, add the following code:
```ts
const nextConfig: NextConfig = {
  devIndicators: false,
  ...
}
```

## MobileNavigation component

- once again, we will use a `shadcn/ui` component to implement the mobile navigation
- more specifically, we will use a shadcn `Sheet`: https://ui.shadcn.com/docs/components/sheet
- as usual, open a terminal and run: `npx shadcn@latest add sheet`
- we'll also install a shadcn separator: `npx shadcn@latest add separator`

## Finalize the Auth (sign-in & logout)

- to implement the logout functionality, we'll use the Appwrite Assistant
  - from the Appwrite dashboard, press Ctrl + K and select "Ask the AI"
  - then ask: "how can I log my user out?"
  - the assistant will tell you to use the `deleteSession` method from the Appwrite SDK

Here is the `signOutUser` function defined in the `user.actions.ts` file:
```ts
export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    // Delete the current session
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  } finally {
    // Redirect the user to the sign-in page
    redirect("/sign-in");
  }
};
```




---
EOF