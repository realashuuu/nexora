import {authClient} from "@/lib/auth.client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GenerateAvatar } from "@/components/generate-avatar";
import { ChevronDown, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription, DrawerTrigger} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";


export const DashboardUserButtons = () => {
  const{data, isPending} = authClient.useSession();
  const isMobile = useIsMobile();
  const router = useRouter();
  const handleLogout = async()=>{
    await authClient.signOut({
      fetchOptions: {
        onSuccess:()=>{ router.push("/sign-in") }
      },
    });
  };

  if(isPending || !data?.user){
    return null;
  }

  if(isMobile){
    return (
      <Drawer>
        <DrawerTrigger className="
    w-full
    flex items-center justify-between
    rounded-xl
    border border-border/20
    bg-white/5
    p-3
    overflow-hidden
    ring-1 ring-border/30
    hover:bg-white/10
    transition-all
    focus:outline-none
    focus:ring-1
    focus:ring-border/30
    focus-visible:outline-none
    focus-visible:ring-1
    focus-visible:ring-border/30
  "
>
  {data.user.image ? (
    <Avatar className="h-9 w-9 border border-white/20">
      <AvatarImage
        src={data.user.image}
        referrerPolicy="no-referrer"
      />
      <AvatarFallback>
        {data.user.name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  ) : (
    <GenerateAvatar
      seed={data.user.name}
      varient="initials"
      className="size-9"
    />
  )}

  <div className="flex flex-1 min-w-0 flex-col pl-2 text-left">
    <p className="truncate text-[15px] font-medium">
      {data.user.name}
    </p>
  </div>

  <ChevronDown className="size-4 shrink-0 opacity-50" />
  </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{data.user.name}</DrawerTitle>
            <DrawerDescription>{data.user.email}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button variant="outline"
            onClick={()=>{}}>
                <CreditCardIcon className="size-4 text-black"/>
                Billing
            </Button>
             <Button variant="outline"
              onClick={handleLogout}>
                <LogOutIcon className="size-4 text-black"/>
                Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
  className="
    w-full
    flex items-center justify-between
    rounded-xl
    border border-border/20
    bg-white/5
    p-3
    overflow-hidden
    ring-1 ring-border/30
    hover:bg-white/10
    transition-all
    focus:outline-none
    focus:ring-1
    focus:ring-border/30
    focus-visible:outline-none
    focus-visible:ring-1
    focus-visible:ring-border/30
  "
>
  {data.user.image ? (
    <Avatar className="h-9 w-9 border border-white/20">
      <AvatarImage
        src={data.user.image}
        referrerPolicy="no-referrer"
      />
      <AvatarFallback>
        {data.user.name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  ) : (
    <GenerateAvatar
      seed={data.user.name}
      varient="initials"
      className="size-9"
    />
  )}

  <div className="flex flex-1 min-w-0 flex-col pl-2 text-left">
    <p className="truncate text-[15px] font-medium">
      {data.user.name}
    </p>
  </div>

  <ChevronDown className="size-4 shrink-0 opacity-50" />
</DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-70">
      <DropdownMenuLabel>
        <div className="flex flex-col gap-1">
          <span className="font medium truncate">{data.user.name}</span>
          <span className="text-sm text-muted-foreground truncate">{data.user.email}</span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer flex items-center justify-between" >
          Billing
          <CreditCardIcon className="size-4text-black"></CreditCardIcon>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer flex items-center justify-between" >
          Logout
          <LogOutIcon className="size-4 text-black"></LogOutIcon>
        </DropdownMenuItem>
      </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};   
