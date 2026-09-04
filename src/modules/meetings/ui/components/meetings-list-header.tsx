"use client";

import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DEFAULT_PAGE } from "@/constants";

import { useMeetingsFilters } from "../../hooks/use-meetings-filter";
import { AgentIdFilters } from "./agent-id-filters";
import { MeetingsSearchfilters } from "./meetings-search-filter";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { StatusFilters } from "./status-filters";

export const MeetingsListHeader = () => {
  const [filters, setFilters] = useMeetingsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModified =
    !!filters.search ||
    !!filters.status ||
    !!filters.agentId;

  const onClearFilters = () => {
    setFilters({
      status: null,
      agentId: "",
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <>
      <NewMeetingDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      <div className="flex flex-col gap-y-4 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-xl font-medium">
              My Meetings
            </h5>

            <p className="max-w-2xl pt-1 text-sm text-muted-foreground">
              Manage your AI assistants, create new workflows, and keep
              everything organized in one place.
            </p>
          </div>

          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            New Meeting
          </Button>
        </div>

        <ScrollArea>
          <div className="flex items-center gap-x-2 p-1">
            <MeetingsSearchfilters />
            <StatusFilters />
            <AgentIdFilters />

            {isAnyFilterModified && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
              >
                <XCircleIcon className="size-4" />
                Clear Filters
              </Button>
            )}
          </div>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};