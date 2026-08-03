import z from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { meetings } from "@/db/schema";

import { TRPCError } from "@trpc/server";


import { and, count, desc, eq, getTableColumns, ilike } from "drizzle-orm";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";


export const meetingsRouter = createTRPCRouter({
  
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input,ctx }) => {
    const [existingMeeting] = await db
      .select({
        ...getTableColumns(meetings),

      })
      .from(meetings)
      .where(
        and(
          eq(meetings.id, input.id),
          eq(meetings.userId, ctx.auth.user.id),
        )
      );
      if(!existingMeeting){
        throw new TRPCError({code:"NOT_FOUND", message:"Meeting Not Found"});
      }
    return existingMeeting;
  }),

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
            ...getTableColumns(meetings),

          })
        .from(meetings) //Database, select everything from the agents table.
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id), 
            search ? ilike(meetings.name, `%${search}%` ) : undefined,   //If the user searches something, filter the agents by their name. If they don’t search anything, don’t apply a search filter.
          )
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id)) //    newest agents first.
        .limit(pageSize) //    how many agents per page.
        .offset((page-1) *pageSize) //decides how many previous agents to skip

        const [total] = await db 
          .select({count: count()})
          .from(meetings)
          .where( // on both queries ensures we only fetch/count the logged-in user’s agents and, if search exists, only agents matching that search.
            and(
              eq(meetings.userId, ctx.auth.user.id),
              search ? ilike(meetings.name, `%${search}%`) : undefined
            )
          );
          const totalPages = Math.ceil(total.count / pageSize)
          return{
            items: data,
            total: total.count,
            totalPages,
          }
    }),
  
})
//A tRPC procedure acts as a bridge between the frontend and the database—it receives requests from the frontend, performs the required server-side work (such as querying the database), and safely returns the result.