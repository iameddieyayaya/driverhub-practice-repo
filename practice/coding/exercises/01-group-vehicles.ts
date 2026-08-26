export type Vehicle = { id: string; make: string; model: string };
/** Prompt: Group vehicles by normalized manufacturer without mutating input.
 * Example: [{make:"Mazda",model:"Miata"},{make:"mazda",model:"RX-7"}] → { Mazda: [both] }
 */
export function groupVehiclesByMake(vehicles: Vehicle[]): Record<string, Vehicle[]> {
  const vehicleMap = new Map<string, string>();

  return vehicles.reduce<Record<string, Vehicle[]>>((groups, vehicle) => {
    const displayKey = vehicle.make.trim();

    if (!displayKey) {
      return groups;
    }

    const normalizedMake = displayKey.toLocaleLowerCase();
    const groupKey = vehicleMap.get(normalizedMake) ?? displayKey;

    vehicleMap.set(normalizedMake, groupKey);
    (groups[groupKey] ??= []).push(vehicle);

    return groups;
  }, {});
}
