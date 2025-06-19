// we need this directive because the action needs to be executed on the server
'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";

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

// send OTP to the user's email to make sure they have access to the email
const sendEmailOTP = async ({email}:{email:string}) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send OTP email");
  }
};
// ** End of helper functions **


// Our first server action (user account creation) - we export this function so we can use it within our form
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
        avatar: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png',
        accountId,
      }
    )
  }

  // return the accountId of the new user 
  return parseStringify({accountId});  // the parseStringify function is declared in the utils.ts file
};




