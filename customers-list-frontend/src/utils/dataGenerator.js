import { faker } from "@faker-js/faker";
import avatarPlaceholder from "../assets/Avatar.png"; 

export function generateCustomers(count) {
  const customers = [];
  for (let i = 1; i <= count; i++) {
    customers.push({
      id: i,
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      age: faker.number.int({ min: 18, max: 65 }),
      addedBy: faker.person.firstName(),
      lastMessageAt: faker.date.recent({ days: 30 }),
      avatar: avatarPlaceholder, 
    });
  }
  return customers;
}
