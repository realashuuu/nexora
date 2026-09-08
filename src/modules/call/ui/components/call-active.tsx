"use client"

import Image from "next/image";
import Link from "next/link";
import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";

interface Props{
  onLeave: ()=> void;
  meetingName: string;
}

export const CallActive = ({onLeave, meetingName}: Props)=>{
  return (
    <div className="flex flex-col justify-between p-4 h-full text-white">
      <div className="rounded-full p-4 flex items-center gap-4 bg-[#101213]  ">
        <Link href="/" className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit" />
        <Image src="/nexora_logo.svg" width={22} height={22} alt="logo"/>
        <h4 className="text-base">
          {meetingName}
        </h4>
      </div>
      <SpeakerLayout/>
      <div className="rounded-full px-4 bg-[#101213] ">
        <CallControls onLeave={onLeave}/>
      </div>
    </div>
  )
}