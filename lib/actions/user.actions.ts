// we need this directive because the action needs to be executed on the server
'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";

 // without this, the action could be executed on the client, which would expose the secret key

// ** Account Creation Flow **
// 
// 1. User enters full name and email address
// 2. check if user already exists using the email
// 3. Send OTP to user's email
// 4. send a secret key for creating a session
// 5. create a new user document if the user does not exist
// 6. return the user's accountId that will be used to complete the logging process
// 7. verify OTP and authenticate the user if it checks out

// Helper functions
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

const sendEmailOTP = async ({email}:{email:string}) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send OTP email");
  }
};


// Our first server action
const createAccount = async ({ fullName, email }:{ fullName:string, email:string }) => {
  // check if user already exists
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({email});
};




