import { useTRPC } from "@/trpc/client";

// import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { CommandSelect } from "@/components/command-select";
import { GenerateAvatar } from "@/components/generate-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel, FormDescription } from "@/components/ui/form";
import z from "zod";// -> Define what valid Agent data looks like once, then reuse that definition wherever Agent data enters your application. it act as the security checker for data shape.
import { toast } from "sonner";
import { MeetingGetOne } from "../../types";
import { meetingsInsertSchema } from "../../schemas";
import { useState } from "react";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";

interface MeetingFromProps {
  onSuccess?: (id?: string)=>void;
  onCancel?: ()=>void;
  initialValues?: MeetingGetOne;
}

export const MeetingForm = ({onSuccess, onCancel, initialValues }:MeetingFromProps)=>{
  const trpc= useTRPC(); //→ talk to your backend
  // const router = useRouter(); //→ move to another page
  const queryClient = useQueryClient(); //→ manage already-fetched data
  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
  const [agentSearch, setAgentSearch ] =  useState("");

  const agents =useQuery( 
    trpc.agents.getMany.queryOptions({
      pageSize:100,
      search:  agentSearch,

    }),
  );

                    /*Create Agent → mutation
                    Update Agent   → mutation
                    Delete Agent.  → mutation
                    Get Agents     → query
                    Get Agent      → query*/

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
        onSuccess: async(data)=>{
          await queryClient.invalidateQueries(
            trpc. meetings.getMany.queryOptions({}),  //->which eventually inserts them into the database.
          );
          //todo => invalidate free tier usage 
        onSuccess?.(data.id);
      },
       onError: (error) => {
      toast.error(error.message);
    },
  })
);
  const UpdateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({

        onSuccess: async()=>{
          await queryClient.invalidateQueries(
            trpc.meetings.getMany.queryOptions({}),  //->which eventually inserts them into the database.
          );
          if(initialValues?.id){
           await queryClient.invalidateQueries(
              trpc.meetings.getOne.queryOptions({id: initialValues .id}),
            );
          }
          onSuccess?.();
        },
      onError:(error)=>{
        toast.error(error.message)
      },
    }),
  );
  //useForm->I have a form with multiple inputs. I need something to manage them.
  const form =useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues:{
      name: initialValues?.name ?? "" ,
      agentId: initialValues?.agentId ?? "",
    }
  })
  const isEdit = !!initialValues?.id;  //give false/true value
  const isPending = createMeeting.isPending || UpdateMeeting.isPending;
  const onSubmit =(values : z.infer<typeof meetingsInsertSchema>)=>{
    if(isEdit){
      //Upadte
      UpdateMeeting.mutate({ ...values, id: initialValues.id });
    }else{
      //create
      createMeeting.mutate(values);
    }
  };

                      /* handleSubmit
                          ↓
                      Check Zod validation
                          ↓
                      Valid?
                      ↓        ↓
                      No       Yes
                      ↓         ↓
                      errors   onSubmit(values)
                                      ↓
                              createAgent.mutate(values)
                                      ↓
                                  Backend       */
  return (
    <> 
    <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog}/>
    <Form {...form}>
      <form className="space-y-4 " onSubmit={form.handleSubmit(onSubmit)}>
        
          <FormField 
            name="name"
            control={form.control}
            render={({field})=>(
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Math Consultations   "/>
                </FormControl>
                <FormMessage/>
              </FormItem>
             )} />
              <FormField 
            name="agentId"
            control={form.control}
            render={({field})=>(
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                 options={(agents.data?.items ?? []).map((agent) => ({
                  id: agent.id,
                  value: agent.id,
                  children: (
                    <div className="flex items-center gap-2">
                      <GenerateAvatar
                        seed={agent.name}
                        variant="botttsNeutral"
                        className="border size-6"
                      />
                      <span>{agent.name}</span>
                    </div>
                  ),
                }))}
                  onSelect={field.onChange}
                  onSearch={setAgentSearch}
                  value={field.value}
                  placeholder="Select an Agent"
                  />
                </FormControl>
                <FormDescription>
                  Not found what your&apos;re looking for?{" "}
                 <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-primary"
                    onClick={() => setOpenNewAgentDialog(true)}
                  >
                    Create a new Agent
                  </Button>
                </FormDescription>
                <FormMessage/>
              </FormItem>
             )} />
             
             <div className=" flex gap-x-2 justify-between">
              {onCancel &&(
                <Button
                variant= "ghost"
                disabled={isPending}
                type="button" 
                onClick={() => onCancel()}
                >
                  Cancel
                </Button>
              )}
              <Button disabled={isPending} type="submit">
              {isEdit ? "Update" : "Create"}
              </Button>
             </div>
      </form>
    </Form>
    </>
  )
}

