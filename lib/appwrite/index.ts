// we need this directive to avoid exposing the secret key to the client
'use server'; 

// we will use the "node-appwrite" SDK (installed via npm)
// node-appwrite will allow us to use Appwrite in a Node.js environment

import { Client, Account, Databases, Storage, Avatars } from "node-appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { cookies } from "next/headers";

// first, we create an appwrite client. It will be used to initialize our services
export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  const session = (await cookies()).get('appwrite-session')

  if(!session || !session.value) {
    throw new Error("No session found");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    }
  }
}

// we also create an admin client for actions on the server that require admin privileges
export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.secretKey); // this will allow us to perform admin actions

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    }
  }
}

// for security reasons, we always create a new client connection for each request