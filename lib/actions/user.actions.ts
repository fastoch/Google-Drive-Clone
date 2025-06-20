// we need this directive because the action needs to be executed on the server
'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";
import { send } from "process";

 // without this, the action could be executed on the client, which would expose the secret key

// ** Account Creation Flow **
// 
// 1. User enters full name and email address
// 2. check if user already exists using the email
// 3. Send OTP to user's email 
// 4. create a new user document if the user does not exist
// 5. return the user's accountId that will be used to complete the authentication process
// 6. verify OTP and authenticate the user if it checks out


// ** Helper functions **

// find the user via the provided email
const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();
  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])]
  );
  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

// send OTP to the user's email to make sure they have access to the provided email
export const sendEmailOTP = async ({email}:{email:string}) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send OTP email");
  }
};

// ** End of helper functions **


// Our first server action (user account creation) - we export this function so we can use it in AuthForm.tsx
export const createAccount = async ({ fullName, email }:{ fullName:string, email:string }) => {
  // check if user already exists
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({email});
  if(!accountId) throw new Error("Failed to send an OTP");

  // if the user does not exist, create a new user document
  if(!existingUser) {
    const { databases } = await createAdminClient();
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: avatarPlaceholderUrl,
        accountId,
      }
    )
  }

  // return the accountId of the new user 
  return parseStringify({accountId});  // the parseStringify function is declared in the utils.ts file
};

export const verifySecret = async ({accountId, password}:{accountId:string, password:string}) => {
  try { 
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, password);
    (await cookies()).set("appwrite-session", session.secret, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: true,
    });
    return parseStringify({sessionId: session.$id});
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};

// function that fetches the current user's data (called in /app/(root)/layout.tsx)
export const getCurrentUser = async () => {
  const { databases, account } = await createSessionClient();
  const result = await account.get();
  const user = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("accountId", result.$id)]
  );
  // if no user is found
  if(user.total <=0) return null;
  // else return the current user's data
  return parseStringify(user.documents[0]);
};

// Logout functionality: using the deleteSession function from the appwrite SDK
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

// Sign-in functionality
export const signInUser = async ({email}: {email:string}) => {
  try {
    const existingUser = await getUserByEmail(email);
    // if the user exists, send an OTP to the user's email
    if(existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({accountId: existingUser.accountId});
    }
    // if the user does not exist, display an error message
    return parseStringify({accountId: null, error: 'User not found'});
  } catch (error) {
    handleError(error, "Failed to sign in user");
  }
};


