import { inferRouterOutputs } from "@trpc/server"; 

import type { AppRoute } from "next/dist/build/swc/types";

export type AgentGetOne = inferRouterOutputs<AppRoute>["agents"]["getOne"];
 