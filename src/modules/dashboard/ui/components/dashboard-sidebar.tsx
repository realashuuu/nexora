"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarGroup, SidebarMenuButton, SidebarGroupContent,
} from "@/components/ui/sidebar";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { DashboardUserButtons } from "./dashboard-user-buttons";
const firstSection = [
  {
    icon: VideoIcon,
    label: "Meetings",
    href: "/meetings",
  },
  {
    icon: BotIcon,
    label: "Agents",
    href:"/agents",
  },
];
const secondSection = [
  {
    icon: StarIcon,
    label:"Upgrade",
    href: "/upgrade",
    },
  ];

  export const DashboardSidebar = () => {
    const pathname = "/meetings"; // Replace with your logic to get the current pathname
    return (
              <Sidebar>
              {/* Header */}
              <SidebarHeader className="relative z-10 text-sidebar-accent-foreground">
                <Link href="/" className="flex items-center gap-2 px-2 pt-2">
                  <Image
                    src="/nexora_logo.svg"
                    width={180}
                    height={180}
                    alt="Nexora"
                    priority
                  />
                </Link>
                <p className="px-2  text-sm flex items-center text-sidebar-accent-foreground/70">
                  v1.0.0 · AI Intelligence</p>

              </SidebarHeader>

              <div className="relative z-10 px-4 py-2">
                <Separator className="bg-sidebar-border opacity-80" />
              </div>

              {/* Content */}
              <SidebarContent className="relative z-10">
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {firstSection.map((item) => (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                          isActive={pathname === item.href}
                          asChild
                          className={cn("h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                            pathname === item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10 ",
                          )}>
                            <Link href={item.href}>
                              <item.icon className="h-5 w-5" />
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                <div className="relative z-10 px-4 py-2">
                <Separator className="bg-sidebar-border opacity-80" />
              </div>
                 <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {secondSection.map((item) => (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                          isActive={pathname === item.href}
                          asChild
                          className={cn("h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                            pathname === item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10 ",
                          )}>
                            <Link href={item.href}>
                              <item.icon className="h-5 w-5" />
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter className=" text-black">
                      <DashboardUserButtons>
                      </DashboardUserButtons>
              </SidebarFooter>
            </Sidebar>
    );
  }