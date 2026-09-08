"use client";

import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import {
  CameraIcon,
  CameraOffIcon,
  LogInIcon,
  MicIcon,
  MicOffIcon,
  ShieldAlertIcon,
  SparklesIcon,
  VideoIcon,
} from "lucide-react";
import Link from "next/link";

import { authClient } from "@/lib/auth.client";
import { Button } from "@/components/ui/button";
import { generateAvatarUri } from "@/lib/avatar";

import "@stream-io/video-react-sdk/dist/css/styles.css";

interface Props {
  onJoin: () => void;
}

const DefaultVideoPreview = () => {
  const { data } = authClient.useSession();

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-zinc-950">
      <DefaultVideoPlaceholder
        participant={
          {
            name: data?.user.name ?? "",
            image:
              data?.user.image ??
              generateAvatarUri({
                seed: data?.user.name ?? "User",
                variant: "initials",
              }),
          } as StreamVideoParticipant
        }
      />
    </div>
  );
};

const AllowBrowserPermissions = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center bg-zinc-950 text-zinc-100">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 mb-3 border border-amber-500/20 animate-pulse">
        <ShieldAlertIcon className="h-6 w-6" />
      </div>
      <h5 className="font-semibold text-zinc-100 mb-1 text-sm">
        Camera & Microphone Blocked
      </h5>
      <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
        Please allow browser permissions to access your camera and microphone to preview your call.
      </p>
    </div>
  );
};

export const CallLobby = ({ onJoin }: Props) => {
  const { data } = authClient.useSession();
  const { useCameraState, useMicrophoneState } = useCallStateHooks();

  const { hasBrowserPermission: hasMicPermission, isMute: isMicMuted } =
    useMicrophoneState();

  const { hasBrowserPermission: hasCameraPermission, isMute: isCameraMuted } =
    useCameraState();

  const hasBrowserMediaPermission =
    hasMicPermission && hasCameraPermission;

  const isCameraActive = hasCameraPermission && !isCameraMuted;
  const isMicActive = hasMicPermission && !isMicMuted;

return (
  <div className="relative flex min-h-screen h-full w-full flex-col items-center justify-center overflow-hidden bg-background p-4 md:p-8">
    {/* Background ambient lighting */}
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
    <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

    {/* Main Card */}
    <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-y-6 rounded-3xl border border-border/50 bg-card/60 p-6 shadow-2xl backdrop-blur-xl transition-all md:p-8">

      {/* Header */}
      <div className="flex flex-col items-center gap-y-2 text-center">
        <h4 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Ready to Join?
        </h4>

        <p className="text-sm text-muted-foreground">
          Set up your call before joining
        </p>
      </div>

      {/* Video Preview */}
      <VideoPreview
            DisabledVideoPreview={
              hasBrowserMediaPermission
                ? DefaultVideoPreview
                : AllowBrowserPermissions
            }
          />
          <div className="flex items-center gap-x-2 left-3 z-20  rounded-full border border-white/15 bg-black/60 p-2 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:bg-black/75">
            <ToggleVideoPreviewButton />
            <ToggleAudioPreviewButton />
          </div>
    
      {/* Action Controls */}
      <div className="flex w-full items-center justify-between gap-x-3 pt-2">
        <Button
          asChild
          variant="ghost"
          className="h-11 rounded-xl px-5 border-gray-50 font-medium hover:bg-muted/80"
        >
          <Link href="/meetings">
            Cancel
          </Link>
        </Button>

        <Button
          onClick={onJoin}
          className="h-11 gap-x-2 rounded-xl bg-green-600 px-7 font-semibold text-white shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02] hover:bg-green-700 hover:shadow-green-600/30 active:scale-[0.98]"
        >
          <LogInIcon className="h-4 w-4" />
          Join Call
        </Button>
      </div>
    </div>
    </div>
);
};