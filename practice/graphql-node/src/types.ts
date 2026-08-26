export type Vehicle = {
  id: string;
  year: number;
  make: string;
  model: string;
  userId: string;
};

export type CreateVehicleInput = {
  year: number;
  make: string;
  model: string;
};

export type UpdateVehicleInput = Partial<CreateVehicleInput>;

export type PaginationInput = {
  page: number;
  pageSize: number;
};

export type VehiclePage = {
  items: Vehicle[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type AuthenticatedUser = {
  id: string;
};

export type UserSummary = {
  id: string;
  displayName: string;
};

