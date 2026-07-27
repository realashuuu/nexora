"use client"

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import {  useSuspenseQuery } from "@tanstack/react-query"

import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";
import { EmptyState } from "@/components/empty-state";

export const AgentsView = () =>{

  const trpc = useTRPC();
  const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
        <DataTable data={data} columns={columns}/>
        {data.length === 0 && (
          <EmptyState 
          title="Create your first Agent"
          description="Create an Agents to join your meetings Each Agents will follow your instructions and can interract with participants during the call"/>
        )}
    </div>
  );
};
export const AgentsViewLoading = ()=>{
  return (
    <LoadingState 
      title="Loading Agents"
      description="This may take a few seconds"
      />
  )
}
export const AgentsViewError =  ()=>{
  return(
    <ErrorState 
      title="Error Loading Agents"
      description="Please try again later"
      />
  )
}
/*
👤 React:
"I need all agents."
↓
📞 tRPC:
"I know which backend procedure to call."
↓
🧠 React Query:
"I'll make the request, cache the result, and manage loading."
↓
🖥️ Server:
"Executing getMany..."
↓
🗄️ Database:
"Here are the agents."
↓
🖥️ Server:
"Returning the data."
↓
🧠 React Query:
"I've received it and updated the cache."
↓
👤 React:
"Now I'll render the agents."*/