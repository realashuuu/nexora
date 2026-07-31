import { AgentIdView, AgentsIdViewError, AgentsIdViewLoading } from "@/modules/agents/ui/view/agent-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


interface Props{
  params:Promise< {agentId : string}>
} //localhost:3000/agents/123  -> Whatever value appears after /agents/, call it agentId.You decide which URL pattern by creating the folders

 const Page= async ({ params }:Props)=>{
  const  { agentId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getOne.queryOptions({id: agentId}),
  );

  return(
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsIdViewLoading/>}>
        <ErrorBoundary fallback={<AgentsIdViewError/>}>
            <AgentIdView agentId={agentId}/>
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>

  );
}
export default Page;