"use client"
import { format } from "date-fns";
import {humanizeDuration} from "humanize-duration";
import { ColumnDef } from "@tanstack/react-table"
import { MeetingGetMany } from "../../types"
import { GenerateAvatar } from "@/components/generate-avatar"
import { Badge } from "@/components/ui/badge"
import { CornerDownRightIcon, VideoIcon, CircleXIcon, CircleCheckIcon, ClockArrowUpIcon, ClockFading, LoaderIcon, ClockFadingIcon } from "lucide-react"
import { cn } from "@/lib/utils";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

function formatDuration(seconds: number){
  return humanizeDuration(seconds * 1000, {largest: 2, units:[ "h", "m" , "s"] , round: true});
};
const statusIconMap ={
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  canceled: CircleXIcon,
}
const statusColorMap = {
  upComing: "bg-yellow-500/20 text-yellow-800 border-yellow-8 00/5",
  active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
  processing: "bg-rose-500/20 text-rose-800 border-rose-800/5",
  canceled: "bg-gray-500/20 text-gray-800 border-gray-800/5",
}
export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting  Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <span className="font-semibold capitalize">
          {row.original.name}
        </span>
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-1">
          <GenerateAvatar
            seed={row.original.name}
            varient="botttsNeutral"
            className="size-6"
          />
          <span className="font-semibold capitalize">{row.original.name}</span>
          </div>
        </div>
          <div className="flex items-center gap-x-2">
            <CornerDownRightIcon className="size-3 text-muted-foreground"/>
            <span className="text-muted-foreground text-sm max-w-50 truncate capitalize">
              {row.original.agents.name}
            </span>
          <GenerateAvatar
            seed={row.original.agents.name}
            varient="botttsNeutral"
            className="size-6" 
          />
          </div>
        </div>
    ),
  },
  {
   accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const Icon = statusIconMap[row.original.status as keyof typeof statusIconMap];
      return (
        <Badge 
          variant="outline"
          className={cn("text-muted-foreground capitalize [&>svg]:size-4", 
          statusColorMap[row.original.status as keyof typeof statusColorMap])}  
        >
      <Icon className={cn(row.original.status === "processing" && "animate-spin")} />
      {row.original.status} 
    </Badge>
    )  
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <Badge variant="outline" className="items-center flex gap-x-2  capitalize [&>svg]:size-4">
        <ClockFadingIcon className="text-blue-700" />
        {row.original.duration ? formatDuration(row.original.duration) : "No duration"}
      </Badge>
    ),
  },
];
