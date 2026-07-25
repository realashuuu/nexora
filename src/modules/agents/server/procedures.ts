import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { db } from "@/db";
import { agent } from "@/db/schema";
import { resolve } from "path";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async() =>{
    const data = await db.select().from(agent); //Database, select everything from the agent table.

    await new Promise((resolve) => setTimeout(resolve, 3000));
    // throw new TRPCError({ code: "BAD_REQUEST"});
    return data;
  })
})
//A tRPC procedure acts as a bridge between the frontend and the database—it receives requests from the frontend, performs the required server-side work (such as querying the database), and safely returns the result.