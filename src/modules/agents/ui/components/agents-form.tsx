import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../types";
// import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { agentsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GenerateAvatar } from "@/components/generate-avatar";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import z from "zod";// -> Define what valid Agent data looks like once, then reuse that definition wherever Agent data enters your application. it act as the security checker for data shape.
import { toast } from "sonner";

interface AgentFromProps {
  onSuccess?: ()=>void;
  onCancel?: ()=>void;
  initialValues?: AgentGetOne;
}

export const AgentForm = ({onSuccess, onCancel, initialValues }:AgentFromProps)=>{
  const trpc= useTRPC(); //→ talk to your backend
  // const router = useRouter(); //→ move to another page
  const queryClient = useQueryClient(); //→ manage already-fetched data

                    /*Create Agent → mutation
                    Update Agent   → mutation
                    Delete Agent.  → mutation
                    Get Agents     → query
                    Get Agent      → query*/

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSettled:()=>{
        onSuccess: async()=>{
          await queryClient.invalidateQueries(
            trpc.agents.getMany.queryOptions({}),  //->which eventually inserts them into the database.
          );
          //todo => invalidate free tier usage 
        }
        onSuccess?.();
      },
      onError:(error)=>{
        toast.error(error.message)
      },
    }),
  );
  const UpdateAgent = useMutation(
    trpc.agents.update.mutationOptions({

        onSuccess: async()=>{
          await queryClient.invalidateQueries(
            trpc.agents.getMany.queryOptions({}),  //->which eventually inserts them into the database.
          );
          if(initialValues?.id){
           await queryClient.invalidateQueries(
              trpc.agents.getOne.queryOptions({id: initialValues .id}),
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
  const form =useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues:{
      name: initialValues?.name ?? "" ,
      instructions: initialValues?.instructions ?? "",
    }
  })
  const isEdit = !!initialValues?.id;  //give false/true value
  const isPending = createAgent.isPending || UpdateAgent.isPending;
  const onSubmit =(values : z.infer<typeof agentsInsertSchema>)=>{
    if(isEdit){
      //Upadte
      UpdateAgent.mutate({ ...values, id: initialValues.id });
    }else{
      //create
      createAgent.mutate(values);
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
    <Form {...form}>
      <form className="space-y-4 " onSubmit={form.handleSubmit(onSubmit)}>
          <GenerateAvatar
          seed={form.watch("name")}
          varient="botttsNeutral"
          className="border size-16"
          />
          <FormField 
            name="name"
            control={form.control}
            render={({field})=>(
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Michael  "/>
                </FormControl>
                <FormMessage/>
              </FormItem>
             )} />
             <FormField 
            name="instructions"
            control={form.control}
            render={({field})=>(
              <FormItem>
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Describe your agent’s role, goals, behavior, and response style..."/>
                </FormControl>
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
  )
}

