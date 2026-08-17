import { PrismaClient, MembershipStatus, MembershipTier } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const eventSeeds = [
  ["Sunrise Cars & Coffee", "A low-key morning meet for interesting cars and their people.", "Boulder, CO", 9],
  ["High Desert Driver Tour", "Two days of scenic roads, navigation checkpoints, and shared meals.", "Bend, OR", 16],
  ["Vintage Track Evening", "A relaxed lapping session for pre-2000 sports cars.", "Monterey, CA", 24],
  ["Mountain Workshop Social", "Hands-on maintenance demos with local marque specialists.", "Denver, CO", 31],
  ["Coastal Miata Run", "A top-down drive with overlooks and a picnic finish.", "Santa Cruz, CA", 38],
  ["German Icons Gathering", "A curated field of classic and modern German performance cars.", "Tacoma, WA", 45],
  ["Women Who Drive Meetup", "Stories, skills, and a welcoming afternoon drive.", "Portland, OR", 52],
  ["Night Shift Garage Tour", "An after-hours visit to three working restoration shops.", "Los Angeles, CA", 60],
  ["Autocross Fundamentals", "Instruction, course walks, and timed runs for every experience level.", "Phoenix, AZ", 67],
  ["British Car Field Day", "Roadsters, saloons, and a friendly preservation class.", "Austin, TX", 74],
  ["Great Lakes Rally", "A waypoint rally along lake roads with a lakeside finish.", "Traverse City, MI", 82],
  ["Radwood Weekend", "A celebration of automotive culture from the 1980s and 1990s.", "Atlanta, GA", 90],
  ["Motorsport Photography Walk", "Practice panning and paddock storytelling with a working photographer.", "Savannah, GA", 98],
  ["Winter Storage Clinic", "Fluids, batteries, tires, covers, and spring recommissioning.", "Chicago, IL", 106],
  ["Member Garage Open House", "Members share the cars, tools, and stories inside their garages.", "Nashville, TN", 115]
] as const;

async function main() {
  await prisma.favoriteEvent.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.event.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.notificationPreference.deleteMany();
  await prisma.memberProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("driverhub123", 12);
  const users = await Promise.all([
    prisma.user.create({ data: { email: "alex@driverhub.local", passwordHash, firstName: "Alex", lastName: "Morgan", profile: { create: { phone: "303-555-0142", city: "Boulder", state: "CO" } }, notificationPreference: { create: { emailEnabled: true, smsEnabled: false, eventReminders: true, marketingEnabled: false } } } }),
    prisma.user.create({ data: { email: "maya@driverhub.local", passwordHash, firstName: "Maya", lastName: "Chen", profile: { create: { phone: "503-555-0188", city: "Portland", state: "OR" } }, notificationPreference: { create: { emailEnabled: true, smsEnabled: true, eventReminders: true, marketingEnabled: true } } } }),
    prisma.user.create({ data: { email: "sam@driverhub.local", passwordHash, firstName: "Sam", lastName: "Rivera", profile: { create: { city: "Austin", state: "TX" } }, notificationPreference: { create: {} } } })
  ]);

  const now = new Date();
  const daysFromNow = (days: number) => new Date(now.getTime() + days * 86_400_000);
  await prisma.membership.createMany({ data: [
    { userId: users[0].id, tier: MembershipTier.TOURING, status: MembershipStatus.ACTIVE, startDate: daysFromNow(-230), renewalDate: daysFromNow(135) },
    { userId: users[0].id, tier: MembershipTier.ROAD, status: MembershipStatus.EXPIRED, startDate: daysFromNow(-600), renewalDate: daysFromNow(-235) },
    { userId: users[1].id, tier: MembershipTier.COMPETITION, status: MembershipStatus.ACTIVE, startDate: daysFromNow(-90), renewalDate: daysFromNow(275) },
    { userId: users[1].id, tier: MembershipTier.TOURING, status: MembershipStatus.CANCELED, startDate: daysFromNow(-500), renewalDate: daysFromNow(-135) },
    { userId: users[2].id, tier: MembershipTier.ROAD, status: MembershipStatus.ACTIVE, startDate: daysFromNow(-30), renewalDate: daysFromNow(335) }
  ] });

  await prisma.vehicle.createMany({ data: [
    { userId: users[0].id, year: 2022, make: "Subaru", model: "BRZ", nickname: "Blue Hour", isFavorite: true },
    { userId: users[0].id, year: 1990, make: "Mazda", model: "Miata", nickname: "Little Red" },
    { userId: users[0].id, year: 2016, make: "Porsche", model: "911 Carrera S" },
    { userId: users[0].id, year: 1967, make: "Ford", model: "Mustang Fastback", nickname: "June" },
    { userId: users[1].id, year: 2011, make: "BMW", model: "M3", nickname: "Alpine" },
    { userId: users[1].id, year: 1994, make: "Toyota", model: "Supra Turbo" },
    { userId: users[1].id, year: 1972, make: "Datsun", model: "240Z" },
    { userId: users[2].id, year: 2024, make: "Ford", model: "Mustang Dark Horse" },
    { userId: users[2].id, year: 2005, make: "Honda", model: "S2000" },
    { userId: users[2].id, year: 1987, make: "Buick", model: "Grand National" }
  ] });

  const events = [];
  for (const [name, description, location, days] of eventSeeds) {
    events.push(await prisma.event.create({ data: { name, description, location, startDate: daysFromNow(days), endDate: daysFromNow(days + 1) } }));
  }
  await prisma.favoriteEvent.createMany({ data: [
    { userId: users[0].id, eventId: events[0].id },
    { userId: users[0].id, eventId: events[2].id },
    { userId: users[1].id, eventId: events[1].id }
  ] });
  await prisma.activity.createMany({ data: [
    { userId: users[0].id, type: "VEHICLE_ADDED", summary: "Added the 1967 Ford Mustang to the garage", createdAt: daysFromNow(-2) },
    { userId: users[0].id, type: "EVENT_FAVORITED", summary: "Saved Vintage Track Evening", createdAt: daysFromNow(-4) },
    { userId: users[0].id, type: "PROFILE_UPDATED", summary: "Updated notification preferences", createdAt: daysFromNow(-8) }
  ] });
  console.log("Seeded DriverHub. Sign in with alex@driverhub.local / driverhub123");
}

main().finally(async () => prisma.$disconnect());
