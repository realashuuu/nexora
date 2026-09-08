import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CallView } from "@/modules/call/ui/views/call-views";

//The [meetingId] is a dynamic route.
interface Props{
  //URL mein jo bhi value aaye, usko meetingId naam se page ko de dena.
  params:Promise<{
    meetingId: string;
  }>;
}

const Page = async ({params}: Props)=>{

  //first checking authentication
  const session = await auth.api.getSession({
    headers: await headers(), //You’re essentially telling Better Auth: Here are the headers from the current   browser request. Use them to identify the user’s session.
  })
  if(!session){
    redirect("/sign-in");
  }

  const {meetingId} = await params;

  const queryClient = getQueryClient();
  //React Query uses this cache so that components don’t unnecessarily fetch the same data again.

  //void means here: Yes, I know this function returns a Promise. I’m intentionally not awaiting it.Is Promise ko start karo, lekin main iske result ka wait/use nahi kar raha.
  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({id: meetingId}),
  );//trpc.meetings.getOne tells you WHICH backend procedure you want, queryOptions() prepares that procedure as a React Query query with the required input, and prefetchQuery() actually fetches it and stores the result in the cache.
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <CallView meetingId={meetingId}/>
    </HydrationBoundary>
  ) 
};
export default Page;