import { PrismaClient } from '@prisma/client';
import { links } from '../data/links';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  console.log('Deleted records in User table');

  await prisma.link.deleteMany();
  console.log('Deleted records in Link table');

  await prisma.$queryRaw`ALTER TABLE User AUTO_INCREMENT = 1`;
  console.log('reset User auto increment to 1');

  await prisma.$queryRaw`ALTER TABLE Link AUTO_INCREMENT = 1`;
  console.log('reset Link auto increment to 1');

  await prisma.user.create({
    data: {
      email: `sebi@gmail.io`,
      role: 'ADMIN',
    },
  });

  await prisma.link.createMany({
    data: links,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
