import { faker } from "@faker-js/faker";

export function generateCustomers(count = 1000000) {
  const customers = [];
  for (let i = 0; i < count; i++) {
    customers.push({
      id: i + 1,
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      score: faker.number.int({ min: 0, max: 100 }),
      lastMessageAt: faker.date.recent({ days: 30 }).toISOString(),
      addedBy: faker.person.firstName(),
      avatar: faker.image.avatar(),
    });
  }
  return customers;
}
