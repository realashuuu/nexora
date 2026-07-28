"use client";

import { PlusIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useAgentsFilters } from "../../hooks/use-agents-filter";
import { AgentsSearchfilters } from "./agents-search-filter";
import { DEFAULT_PAGE } from "@/constants";
import { X509Certificate } from "crypto";
  

export const AgentsListHeader = () => {
  const [ filters, setfilters ] = useAgentsFilters();
  const [isDialogOpen, setIsDialogOpen ] = useState(false);
  
  const isAnyFilterModified = !!filters.search;
  const onClearFilters = ()=>{
    setfilters({
      search: "",
      page: DEFAULT_PAGE,
    });
  }

  return (
    <>
    <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}/>
      <div className="flex flex-col gap-y-4 md:px-8 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-xl font-medium">
              My Agents
            </h5>
            <p className="max-w-2xl text-sm text-muted-foreground pt-1">
              Manage your AI assistants, create new workflows, and keep everything organized in one place.
            </p>
          </div>
      <Button onClick={()=>setIsDialogOpen(true)}>
        <PlusIcon/>
        New Agents
      </Button>
        </div>
      </div>
      <div className="flex items-center gap-x-2 p-1">
        <AgentsSearchfilters/>
        {isAnyFilterModified && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            <XCircleIcon/>
            Clear
          </Button>
        )}
      </div>
</>
  );
};
