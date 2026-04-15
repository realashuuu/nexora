"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth.client"; //import the auth client
import { useRouter } from "next/navigation"; //import the router to navigate after sign out



export const HomeView =()=>{
  const { data:session } =authClient.useSession();
  const router = useRouter();
  if(!session){
    return ("Loading...")
  }
    return (
    <div className="flex flex-col gap-y-4 p-4">
      <p>Logged in as {session.user.name}</p>
      <Button 
      onClick={()=> authClient.signOut({
        fetchOptions: {
          onSuccess:()=> router.push("/sign-in")
        }
      })
      }
      >Sign Out</Button>
    </div>)
}






 