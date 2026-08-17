import { createSchema } from "graphql-yoga";
import type { Event, Vehicle } from "@prisma/client";
import { prisma } from "@/src/server/database/prisma";
import type { SessionUser } from "@/src/server/auth/session";
import { VehicleService } from "@/src/server/services/vehicle-service";
import { EventService } from "@/src/server/services/event-service";

export type GraphQLContext = { user: SessionUser };

type IdArgs = { id: string };
type VehicleArgs = { input: unknown };
type UpdateVehicleArgs = { id: string; input: unknown };
type EventsArgs = { limit?: number };
type FavoriteArgs = { eventId: string; favorite: boolean };

const vehicleService = new VehicleService(prisma);
const eventService = new EventService(prisma);

export const schema = createSchema<GraphQLContext>({
  typeDefs: /* GraphQL */ `
    type Vehicle { id: ID!, year: Int!, make: String!, model: String!, nickname: String, vin: String, imageUrl: String, isFavorite: Boolean!, createdAt: String!, updatedAt: String! }
    type Event { id: ID!, name: String!, description: String!, location: String!, startDate: String!, endDate: String!, imageUrl: String, isFavorite: Boolean!, favoriteCount: Int! }
    input VehicleInput { year: Int!, make: String!, model: String!, nickname: String, vin: String, imageUrl: String, isFavorite: Boolean }
    type Query { vehicles: [Vehicle!]!, vehicle(id: ID!): Vehicle, events(limit: Int): [Event!]!, event(id: ID!): Event }
    type Mutation { createVehicle(input: VehicleInput!): Vehicle!, updateVehicle(id: ID!, input: VehicleInput!): Vehicle!, deleteVehicle(id: ID!): Boolean!, favoriteEvent(eventId: ID!, favorite: Boolean!): Event! }
  `,
  resolvers: {
    Vehicle: {
      createdAt: (vehicle: Vehicle) => vehicle.createdAt.toISOString(),
      updatedAt: (vehicle: Vehicle) => vehicle.updatedAt.toISOString()
    },
    Event: {
      startDate: (event: Event) => event.startDate.toISOString(),
      endDate: (event: Event) => event.endDate.toISOString(),
      // TODO(PRACTICE): Diagnose this N+1 resolver in DevTools/logs and replace it with batching or an aggregate included in the parent query.
      favoriteCount: (event: Event) => prisma.favoriteEvent.count({ where: { eventId: event.id } })
    },
    Query: {
      vehicles: (_root: unknown, _args: unknown, context: GraphQLContext) => vehicleService.list(context.user.id),
      vehicle: (_root: unknown, args: IdArgs, context: GraphQLContext) => vehicleService.get(context.user.id, args.id),
      events: (_root: unknown, args: EventsArgs, context: GraphQLContext) => eventService.list(context.user.id, args.limit),
      event: (_root: unknown, args: IdArgs, context: GraphQLContext) => eventService.get(context.user.id, args.id)
    },
    Mutation: {
      createVehicle: (_root: unknown, args: VehicleArgs, context: GraphQLContext) => vehicleService.create(context.user.id, args.input),
      updateVehicle: (_root: unknown, args: UpdateVehicleArgs, context: GraphQLContext) => vehicleService.update(context.user.id, args.id, args.input),
      deleteVehicle: (_root: unknown, args: IdArgs, context: GraphQLContext) => vehicleService.delete(context.user.id, args.id),
      favoriteEvent: (_root: unknown, args: FavoriteArgs, context: GraphQLContext) => eventService.favorite(context.user.id, args.eventId, args.favorite)
    }
  }
});
