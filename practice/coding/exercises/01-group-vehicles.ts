export type Vehicle = { id: string; make: string; model: string };
/** Prompt: Group vehicles by normalized manufacturer without mutating input.
 * Example: [{make:"Mazda",model:"Miata"},{make:"mazda",model:"RX-7"}] → { Mazda: [both] }
 */
export function groupVehiclesByMake(vehicles: Vehicle[]): Record<string, Vehicle[]> {

}
