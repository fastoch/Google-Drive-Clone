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

### Note (tip)

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



---
EOF