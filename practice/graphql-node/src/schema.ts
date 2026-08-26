/**
 * TODO(PRACTICE): Replace this placeholder with the Vehicle API schema.
 *
 * Required operations:
 * - Query.vehicles(page, pageSize)
 * - Query.vehicle(id)
 * - Mutation.createVehicle(input)
 * - Mutation.updateVehicle(id, input)
 * - Mutation.deleteVehicle(id)
 *
 * Add Vehicle, VehiclePage, PageInfo/input types as required by the tests.
 */
export const typeDefs = /* GraphQL */ `
  type Query {
    practice: Boolean
    vehicle(id: ID!): Vehicle
    vehicles(page: Int, pageSize: Int): VehiclePage!
  }

  type Mutation {
    createVehicle(input: CreateVehicleInput!): Vehicle!
    updateVehicle(id: ID!, input: UpdateVehicleInput!): Vehicle!
    deleteVehicle(id: ID!): Boolean!
  }

  type Vehicle {
    id: ID!
    year: Int!
    make: String!
    model: String!
    userId: ID!
    owner: User!
  }

  type User {
    id: ID!
    displayName: String!
  }

  type VehiclePage {
    items: [Vehicle!]!
    page: Int!
    pageSize: Int !
    totalItems: Int!
    totalPages: Int!
  }

  input CreateVehicleInput {
    year: Int!
    make: String!
    model: String!
  }

  input UpdateVehicleInput {
    year: Int!
    make: String!
    model: String!
  }

`;

