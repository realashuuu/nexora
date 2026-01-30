"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth.client"; //import the auth client
import { auth } from "@/lib/auth";

export default function Home() {

  const {data: session} = authClient.useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = ()=>{
    authClient.signUp.email({
      email: email,
      password: password,
      name: name
    },{
      onError: ()=>{
        window.alert("Error Signing Up");
      },
      onSuccess: ()=>{
        window.alert("Singed Up Successfully");
      }
    });
  }
  if(session){
    return (
    <div className="flex flex-col gap-y-4 p-4">
      <p>Logged in as {session.user.name}</p>
      <Button onClick={()=> authClient.signOut()}>Sign Out</Button>
    </div>)
  }

  const onLogin = ()=>{
    authClient.signIn.email({
      email: email,
      password: password
    },{
      onError:()=>{
        window.alert("Error Logging In");
      },
      onSuccess:()=>{
        window.alert("Logged In Successfully");
      }
    });
  }

  return (
    <div className="flex flex-col-10 gap-4">
      <div className="p-4 flex flex-col gap-4">
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button onClick={onSubmit}>Sign Up</Button>
    </div>
    <div className="p-4 flex flex-col gap-4">
      
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button onClick={onLogin}>Login</Button>
    </div>
      </div>
  );
}