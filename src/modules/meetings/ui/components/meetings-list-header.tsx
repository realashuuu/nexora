"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { useState } from "react";




  

export const MeetingsListHeader = () => {
  const [ isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
    <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}/>
      <div className="flex flex-col gap-y-4 md:px-8 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-xl font-medium">
              My Meetings
            </h5>
            <p className="max-w-2xl text-sm text-muted-foreground pt-1">
              Manage your AI assistants, create new workflows, and keep everything organized in one place.
            </p>
          </div>
      <Button onClick={()=>setIsDialogOpen(true)}>
        <PlusIcon/>
        New Meeting
      </Button>
        </div>
      </div>
      <div className="flex items-center gap-x-2 p-1">
        todo: filters
      </div>
</>
  );
};
