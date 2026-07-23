"use client"

//Zod is a schema validation library
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";

import {FcGoogle} from "react-icons/fc";
import {FaGithub} from "react-icons/fa";
import {FaFacebook} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Field } from "@/components/ui/field";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { OctagonAlertIcon } from "lucide-react";
import { authClient } from "@/lib/auth.client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Provider } from "@radix-ui/react-tooltip";
import { router } from "better-auth/api";


// Before sending anything to server Zod checks Is email valid format? Is password empty? If invalid: stops here, shows error via FormMessage.. if valid then move for next step 
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, {message: "Password is required"}),
});

export const SignInViews = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending ] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    email: "",
    password:"",
  },
  });
  const onSubmit= (data:z.infer<typeof formSchema>) =>{
    setError(null);
    setPending(true);

    //API CALL (authClient) This is where frontend talks to backend
    authClient.signIn.email({
      email:data.email,
      password:data.password,
      callbackURL: "/",
    },
    {
      onSuccess:()=>{
        setPending(false);
        router.push("/");  

      },
        onError:({ error })=>{
        setError(error.message);
        setPending(false);
      }

    }
  );
};

const onSocial= (provider: "google" | "github" | "facebook") =>{
    setError(null);
    setPending(true);

    //API CALL (authClient) This is where frontend talks to backend
    authClient.signIn.social({
      provider: provider,
      callbackURL: "/",
    },
    {
      onSuccess:()=>{
        setPending(false);
      },
        onError:({ error })=>{
        setError(error.message);
        setPending(false);
      }

    }
  );
};



  

  return (
    <div className="relative flex flex-col gap-6 items-center justify-center overflow-hidden ">
      {/* Main content */}
      
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">

            {/* LEFT SIDE */}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center justify-center bg-background/95 p-8 md:p-10">
              <div className="w-full max-w-sm">
                <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
                <p className="mt-2 text-muted-foreground">
                  Welcome back to Nexora
                </p>
                <div className=" grid gap-3 mt-1.5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                      <FormItem className="mt-4">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=" grid gap-3 mt-1.5 mb-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({field}) =>(
                      <FormItem className="mt-4">
                        <FormLabel>Password</FormLabel>
                        <FormControl> 
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!!error &&(
                  <Alert className="bg-destructive/10" >
                    <OctagonAlertIcon className=" !text-destructive" />
                        <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
                <Button  disabled={pending} className="w-full mt-6 mb-2.5" type="submit">
                  Sign In
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border after:content-['']">
                  <span className="relative z-10 bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div> 

                <div className="grid grid-cols-3 gap-1.5 mt-2.5">
                <Button variant="outline"
                className="w-full flex"
                type="button"
                disabled={pending}
                onClick={()=> onSocial("google")}
                > 
                <FcGoogle className="" />
                Google
                </Button>
                <Button variant="outline"
                className="w-full flex"
                type="button"
                disabled={pending}
                onClick={()=> onSocial("github")}
                > 
                <FaGithub className="" />
                Github
                </Button>
                  <Button
                variant="outline"
                className="w-full flex"
                type="button"
                disabled={pending}
                onClick={() => onSocial("facebook")}
                > 
                <FaFacebook className="" />
                Facebook
                </Button>
                </div>
                <div className="text-sm text-center mt-5 -mb-2.5">
                  don&apos;t have and account <Link href="/sign-up" className="text-orange-500 underline underline-offset-4">
                  Sign up</Link>
                </div>

              </div>
                  </form>
          </Form>

            {/* RIGHT SIDE */}
            <div className="relative hidden overflow-hidden bg-black md:flex items-center justify-center">

              {/* Animated premium background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_25%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(139,92,246,0.16),transparent_30%),linear-gradient(135deg,#020617,#030712,#0f172a,#111827,#1e1b4b,#020617)] bg-[length:200%_200%] animate-[gradientMove_15s_ease_infinite]"></div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.03)_45%,transparent_70%)] animate-[shine_8s_linear_infinite]"></div>

              {/* Glow blobs */}
              <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-[120px]"></div>
              <div className="absolute top-1/3 right-10 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]"></div>
              <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-[120px]"></div>

              {/* Logo */}
              <div className="relative z-10 flex items-center justify-center px-6">
                <img
                  src="/nexora_logo.svg"
                  alt="Nexora Logo"
                  className="w-[280px] md:w-[380px] drop-shadow-[0_0_50px_rgba(56,189,248,0.25)]"
                />
              </div>
            </div>

          </CardContent>
        </Card>
                <div className="text-muted-foreground text-center text-xs text-balance">
          By clicking continue, you agree to our{" "}
          <a
            href="#"
            className="underline underline-offset-4 text-primary "
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline underline-offset-4 text-primary"
          >
            Privacy Policy
          </a>.
        </div>
      </div>

  )
}