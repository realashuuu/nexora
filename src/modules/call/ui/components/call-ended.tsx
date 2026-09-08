"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const CallEnded = () => {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4 md:p-8">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Main Card */}
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-y-6 rounded-3xl border border-border/50 bg-card/60 p-6 shadow-2xl backdrop-blur-xl transition-all md:p-8">

        {/* Header */}
        <div className="flex flex-col items-center gap-y-2 text-center">
          <h4 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            You have ended the call
          </h4>

          <p className="text-sm text-muted-foreground">
            Summary will appear in a few minutes
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="h-11 gap-x-2 rounded-xl bg-green-600 text-white hover:bg-green-700 hover:text-white lg:w-auto"
        >
          <Link href="/meetings">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to meetings
          </Link>
        </Button>
      </div>
    </div>
  );
};