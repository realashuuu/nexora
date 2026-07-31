import z from "zod";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { resolve } from "path";
import { TRPCError } from "@trpc/server";
import { agentsInsertSchema } from "../schemas";
import { CarTaxiFront } from "lucide-react";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { Input } from "@/components/ui/input";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { InputOTPSeparator } from "@/components/ui/input-otp";

export const agentsRouter = createTRPCRouter({
  //TODO: change getOne to use protectedprocedure
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input,ctx }) => {
    const [existingAgent] = await db
      .select({
        ...getTableColumns(agents),
        meetingCount: sql<number>`4`,
      })
      .from(agents)
      .where(
        and(
          eq(agents.id, input.id),
          eq(agents.userId, ctx.auth.user.id),
        )
      );
      if(!existingAgent){
        throw new TRPCError({code:"NOT_FOUND", message:"Agents Not Found"});
      }
    return existingAgent;
  }),
  //TODO: change getMany to use protectedprocedure
  getMany: protectedProcedure
    .input(
      z.object({
      page:z.number().default(DEFAULT_PAGE),
      pageSize:z
        .number()
        .min(MIN_PAGE_SIZE)
        .max(MAX_PAGE_SIZE)
        .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish()
    })
  )
    .query(async ({ctx, input}) => {
      const {search, page, pageSize} = input;
      const data = await db
        .select({
            ...getTableColumns(agents),
            meetingCount: sql<number>`4`,
          })
        .from(agents) //Database, select everything from the agents table.
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id), 
            search ? ilike(agents.name, `%${search}%` ) : undefined,   //If the user searches something, filter the agents by their name. If they don’t search anything, don’t apply a search filter.
          )
        )
        .orderBy(desc(agents.createdAt), desc(agents.id)) //    newest agents first.
        .limit(pageSize) //    how many agents per page.
        .offset((page-1) *pageSize) //decides how many previous agents to skip

        const [total] = await db 
          .select({count: count()})
          .from(agents)
          .where( // on both queries ensures we only fetch/count the logged-in user’s agents and, if search exists, only agents matching that search.
            and(
              eq(agents.userId, ctx.auth.user.id),
              search ? ilike(agents.name, `%${search}%`) : undefined
            )
          );
          const totalPages = Math.ceil(total.count / pageSize)
          return{
            items: data,
            total: total.count,
            totalPages,
          }
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