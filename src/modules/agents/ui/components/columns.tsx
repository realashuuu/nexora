"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AgentGetMany } from "../../types"
import { GenerateAvatar } from "@/components/generate-avatar"
import { Badge } from "@/components/ui/badge"
import { CornerDownRightIcon, VideoIcon } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<AgentGetMany>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-2">
          <GenerateAvatar
            seed={row.original.name}
            varient="botttsNeutral"
            className="size-6"
          />
          <span className="font-semibold capitalize">{row.original.name}</span>
        </div>
          <div className="flex items-center gap-x-2">
            <CornerDownRightIcon className="size-3 text-muted-foreground"/>
            <span className="text-muted-foreground text-sm max-w-50 truncate capitalize">
              {row.original.instructions}
            </span>
          </div>
        </div>
    ),
  },
  {
   accessorKey: "meeting",
    header: "Meeting Name",
    cell: ({ row }) => (
    <Badge 
    variant="outline"
    className="flex items-center gap-x-2 [&>svg]:size-4">
      <VideoIcon className="text-blue-700"/>
      {row.original.meetingCount} {row.original.meetingCount === 1 ? "meeting" : "meetings"}
    </Badge>
    )  
    }
]
