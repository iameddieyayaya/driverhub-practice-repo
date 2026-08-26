// @vitest-environment node

import {
  buildSchema,
  GraphQLInputObjectType,
  GraphQLObjectType,
} from "graphql";
import { describe, expect, it } from "vitest";
import { typeDefs } from "../src/schema";

function objectFields(schemaSource: string, typeName: string) {
  const type = buildSchema(schemaSource).getType(typeName);
  expect(type, `${typeName} must exist`).toBeInstanceOf(GraphQLObjectType);
  if (!(type instanceof GraphQLObjectType)) throw new Error(`${typeName} missing`);
  return type.getFields();
}

function inputFields(schemaSource: string, typeName: string) {
  const type = buildSchema(schemaSource).getType(typeName);
  expect(type, `${typeName} must exist`).toBeInstanceOf(GraphQLInputObjectType);
  if (!(type instanceof GraphQLInputObjectType)) {
    throw new Error(`${typeName} missing`);
  }
  return type.getFields();
}

describe("GraphQL Vehicle API schema", () => {
  it("defines the required Vehicle fields", () => {
    const fields = objectFields(typeDefs, "Vehicle");

    expect(String(fields.id?.type)).toBe("ID!");
    expect(String(fields.year?.type)).toBe("Int!");
    expect(String(fields.make?.type)).toBe("String!");
    expect(String(fields.model?.type)).toBe("String!");
    expect(String(fields.userId?.type)).toBe("ID!");
  });

  it("defines the vehicle and paginated vehicles queries", () => {
    const fields = objectFields(typeDefs, "Query");

    expect(String(fields.vehicle?.type)).toBe("Vehicle");
    expect(String(fields.vehicle?.args.find((arg) => arg.name === "id")?.type)).toBe(
      "ID!",
    );
    expect(String(fields.vehicles?.type)).toBe("VehiclePage!");
    expect(fields.vehicles?.args.map((arg) => arg.name)).toEqual([
      "page",
      "pageSize",
    ]);
  });

  it("defines create, update, and delete mutations", () => {
    const fields = objectFields(typeDefs, "Mutation");

    expect(String(fields.createVehicle?.type)).toBe("Vehicle!");
    expect(String(fields.updateVehicle?.type)).toBe("Vehicle!");
    expect(String(fields.deleteVehicle?.type)).toBe("Boolean!");
    expect(
      fields.updateVehicle?.args.map((argument) => argument.name),
    ).toEqual(["id", "input"]);
  });

  it("keeps userId out of caller-controlled vehicle inputs", () => {
    const createFields = inputFields(typeDefs, "CreateVehicleInput");
    const updateFields = inputFields(typeDefs, "UpdateVehicleInput");

    expect(Object.keys(createFields)).toHaveLength(3);
    expect(Object.keys(createFields)).toEqual(
      expect.arrayContaining(["year", "make", "model"]),
    );
    expect(Object.keys(updateFields)).toHaveLength(3);
    expect(Object.keys(updateFields)).toEqual(
      expect.arrayContaining(["year", "make", "model"]),
    );
    expect(createFields.userId).toBeUndefined();
    expect(updateFields.userId).toBeUndefined();
  });

  it("defines pagination metadata and an owner field for the batching exercise", () => {
    const pageFields = objectFields(typeDefs, "VehiclePage");
    const vehicleFields = objectFields(typeDefs, "Vehicle");

    expect(String(pageFields.items?.type)).toBe("[Vehicle!]!");
    expect(String(pageFields.totalItems?.type)).toBe("Int!");
    expect(String(pageFields.totalPages?.type)).toBe("Int!");
    expect(String(vehicleFields.owner?.type)).toBe("User!");
  });
});
