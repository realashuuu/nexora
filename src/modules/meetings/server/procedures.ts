import z from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";
import { MeetingStatus } from "../types";
import { generateAvatarUri } from "@/lib/avatar";
import { streamVideo } from "@/lib/stream-video";



export const meetingsRouter = createTRPCRouter({
 generateToken: protectedProcedure.mutation(async ({ ctx })=> {
  await streamVideo.upsertUsers([{
    id: ctx.auth.user.id,
    name:ctx.auth.user.name,
    role: "user",
    image: ctx.auth.user.image ?? generateAvatarUri({ seed: ctx.auth.user.name ?? ctx.auth.user.id, variant: "initials" }),
  }])
  const expirationTime = Math.floor(Date.now()/1000)+3600; // 1 hour from now
  const issuedAt = Math.floor(Date.now()/1000)-60;
  const token = streamVideo.generateUserToken({
    user_id: ctx.auth.user.id, 
    exp: expirationTime, 
    validity_in_seconds: issuedAt,
  });

  return token;
 }),


  remove: protectedProcedure
      .input(z.object({ id: z.string() }) )
      .mutation(async ({ input,ctx }) =>{
        const [ removedMeeting ] = await db
          .delete(meetings)
          .where(
            and(
              eq( meetings.id, input.id),
              eq( meetings.userId, ctx.auth.user.id),
            ),
          )
          .returning();
          if(!removedMeeting){
            throw new TRPCError({
            code:"NOT_FOUND",
            message:"Meeting not found",
          })
          }
          return removedMeeting;
        }
      ),
  update: protectedProcedure
      .input(meetingsUpdateSchema)
      .mutation(async ({ input,ctx }) =>{
        const [ updatedMeeting ] = await db
          .update(meetings)
          .set(input)
          .where(
            and(
              eq( meetings.id, input.id),
              eq( meetings.userId, ctx.auth.user.id),
            ),
          )
          .returning();
          if(!updatedMeeting){
            throw new TRPCError({
            code:"NOT_FOUND",
            message:"Meeting not found",
          })
          }
          return updatedMeeting;
        }
      ),
  create: protectedProcedure
      .input(meetingsInsertSchema)
      .mutation(async ({ input, ctx }) => {
        const [createdMeeting] = await db.insert(meetings).values({
          ...input,
          userId: ctx.auth.user.id,
        }) 
        .returning();
        const call = streamVideo.video.call("default", createdMeeting.id );
        await call.create({
          data:{
            created_by_id: ctx.auth.user.id,
            custom:{
              meetingId: createdMeeting.id,
              meetingName: createdMeeting.name,
            },
            settings_override:{
              transcription: {
                language:"en",
                mode:"auto-on",
                closed_caption_mode:"auto-on"
              },
              recording:{
                quality: "1080p",
                mode:"auto-on",
              },
            },
          },
        });
        const [existingAgent ]= await db
        .select()
        .from(agents)
        .where(eq(agents.id, createdMeeting.agentId))
        if(!existingAgent){
          throw new TRPCError({
            code:"NOT_FOUND",
            message:"Agent not found",
          });
        }
        await streamVideo.upsertUsers([
          {
            id:existingAgent.id,
            name:existingAgent.name,
            role:"user",
            image: generateAvatarUri({
              seed:existingAgent.name,
              variant:"botttsNeutral",
            })
          }
        ])

        return createdMeeting;
      }),
  
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input,ctx }) => {
    const [existingMeeting] = await db
      .select({
        ...getTableColumns(meetings),
        agents: agents, 
        duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
      })
      .from(meetings)
      .innerJoin(agents, eq(meetings.agentId,agents.id))
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
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z.enum([MeetingStatus.Upcoming, MeetingStatus.Active, MeetingStatus.Completed, MeetingStatus.Processing, MeetingStatus.Canceled]).nullish(),
    })
  )
    .query(async ({ctx, input}) => {
      const { page, pageSize, status, search, agentId } = input;
      const data = await db
        .select({
            ...getTableColumns(meetings),
            agents: agents ,
            duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
          })
        .from(meetings) //Database, select everything from the agents table.
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id), 
            search ? ilike(meetings.name, `%${search}%` ) : undefined,   //If the user searches something, filter the agents by their name. If they don’t search anything, don’t apply a search filter.
            status ? eq(meetings.status, status ) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined, 
          )
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id)) //    newest agents first.
        .limit(pageSize) //    how many agents per page.
        .offset((page-1) *pageSize) //decides how many previous agents to skip

        const [total] = await db 
          .select({count: count()})
          .from(meetings)
          .innerJoin(agents, eq(meetings.agentId, agents.id))
          .where( // on both queries ensures we only fetch/count the logged-in user’s agents and, if search exists, only agents matching that search.
            and(
              eq(meetings.userId, ctx.auth.user.id),
              search ? ilike(meetings.name, `%${search}%`) : undefined,
              status ? eq(meetings.status, status ) : undefined,
              agentId ? eq(meetings.agentId, agentId) : undefined,
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