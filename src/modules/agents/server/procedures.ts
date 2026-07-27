import z from "zod";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { resolve } from "path";
import { TRPCError } from "@trpc/server";
import { agentsInsertSchema } from "../schemas";
import { CarTaxiFront } from "lucide-react";
import { eq } from "drizzle-orm";
import { Input } from "@/components/ui/input";

export const agentsRouter = createTRPCRouter({
  //TODO: change getOne to use protectedprocedure
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, input.id));
    return existingAgent;
  }),
  //TODO: change getMany to use protectedprocedure
  getMany: protectedProcedure.query(async () => {
    const data = await db.select().from(agents); //Database, select everything from the agents table.

    return data;
  }),
  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdAgent] = await db.insert(agents).values({
        ...input,
        userId: ctx.auth.user.id,
      })
      .returning();
      return createdAgent;
    }),
})
//A tRPC procedure acts as a bridge between the frontend and the database—it receives requests from the frontend, performs the required server-side work (such as querying the database), and safely returns the result.