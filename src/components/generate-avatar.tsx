import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";
import { cn } from "@/lib/utils";
import{ Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GenerateAvatarProps {
  seed: string;
  className?: string;
  varient: "botttsNeutral" | "initials";
}

export const GenerateAvatar = ({ seed, className, varient }: GenerateAvatarProps) => {
  let avatar;
  if (varient === "botttsNeutral") {
    avatar = createAvatar(botttsNeutral, {
      seed: seed,
    });
  } else {
    avatar = createAvatar(initials, {
      seed: seed,
      fontWeight: 500,
      fontSize: 42,
    });
  }

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatar.toDataUri()} alt="Avatar" />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}