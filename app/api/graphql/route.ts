import { createYoga } from "graphql-yoga";
import { schema, type GraphQLContext } from "@/src/server/graphql/schema";
import { requireUser, isTrustedMutation } from "@/src/server/auth/authorize";
import { withRequestLogging } from "@/src/server/observability/logger";

const yoga = createYoga<GraphQLContext>({
  schema,
  graphqlEndpoint: "/api/graphql",
  graphiql: process.env.NODE_ENV !== "production",
  context: async () => ({ user: await requireUser() }),
  maskedErrors: process.env.NODE_ENV === "production"
});

function handle(request: Request): Promise<Response> {
  return withRequestLogging(request, async () => {
    if (request.method === "POST" && !isTrustedMutation(request)) return Response.json({ error: "Untrusted request origin" }, { status: 403 });
    return yoga.fetch(request);
  });
}

export { handle as GET, handle as POST, handle as OPTIONS };
