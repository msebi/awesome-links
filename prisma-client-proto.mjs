import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// https://www.prisma.io/docs/concepts/components/prisma-client

const users = prisma.user.findMany();
console.log("users: " + JSON.stringify(users));

const links = prisma.link.findMany();
console.log("links: " + JSON.stringify(links));

const newUser = await prisma.user.create({
  data: {
    email: "alice@prisma.io",
    createdAt: "2022-12-02T16:02:49.659Z",
    role: "ADMIN",
  },
});

console.log("new user: " + JSON.stringify(newUser));
