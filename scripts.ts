import { PrismaClient, Role } from '@prisma/client';
import { connect } from 'http2';

const prisma = new PrismaClient();

async function main() {
  //delete all users
  await prisma.user.deleteMany();

  //create user with prefrence
  const user = await prisma.user.create({
    data: {
      name: 'test user',
      email: 'test_user@gmail.com',
      role: Role.EDITOR,
      age: 24,
      userPrefrence: {
        create: {
          emailUpdates: false,
          notifications: true,
        },
      },
    },
    include: {
      userPrefrence: true,
    },
  });
  console.log('user:', user);

  //create post with user
  const post = await prisma.post.create({
    data: {
      content: 'fjdskfljdsklfjsdlgk',
      published: true,
      rating: 2.0,
      author: {
        connect: {
          email: 'test_user@gmail.com',
        },
      },
    },
    include: {
      author: true,
    },
  });

  console.log(post);

  const user1 = await prisma.user.findUnique({
    where: { email: 'test_user@gmail.com' },
  });
  console.log(user1);

  const allusers = await prisma.user.findMany();
  console.log(allusers);

  //create user with multiple [posts]
  const createUserWithManyPost = await prisma.user.create({
    data: {
      email: 'saanvi@prisma.io',
      name: 'saanvi',
      role: Role.BASIC,
      age: 22,
      posts: {
        createMany: {
          data: [
            {
              content: 'My first post',
              published: false,
              rating: 2.0,
            },
            {
              content: 'My second post',
              published: false,
              rating: 2.0,
            },
          ],
        },
      },
    },
    include: {
      posts: true,
    },
  });

  console.log(createUserWithManyPost);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
