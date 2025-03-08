import { faker } from "@faker-js/faker";
import {
  Comment,
  Post,
  PrismaClient,
  Reaction,
  ReactionType,
  Site,
  User,
} from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// Number of records to create
const NUM_USERS = 5;
const SITES_PER_USER = 1;
const POSTS_PER_SITE = 5;
const COMMENTS_PER_POST = 3;
const REACTIONS_PER_POST = 10;

async function main(): Promise<void> {
  console.log("🌱 Starting seed process...");

  // Create users with credentials
  const users = await createUsers(NUM_USERS);
  console.log(`✅ Created ${users.length} users`);

  // Create sites for each user
  const sites = await createSites(users);
  console.log(`✅ Created ${sites.length} sites`);

  // Create posts for each site
  const posts = await createPosts(sites);
  console.log(`✅ Created ${posts.length} posts`);

  // Create comments for each post
  const comments = await createComments(posts, users);
  console.log(`✅ Created ${comments.length} comments`);

  // Create reactions for each post
  const reactions = await createReactions(posts, users);
  console.log(`✅ Created ${reactions.length} reactions`);

  console.log("🎉 Seed process completed successfully!");
}

async function createUsers(count: number): Promise<User[]> {
  const users: User[] = [];

  // Create a test user with known credentials
  const testUserEmail = "test@example.com";
  const testUserPassword = "password123";
  const hashedPassword = await hash(testUserPassword, 10);

  const testUser = await prisma.user.upsert({
    where: { email: testUserEmail },
    update: {},
    create: {
      email: testUserEmail,
      name: "Test User",
      image: faker.image.avatar(),
      accounts: {
        create: {
          type: "credentials",
          provider: "credentials",
          providerAccountId: "test-user",
          hashedPassword,
        },
      },
    },
  });

  users.push(testUser);

  // Create random users
  for (let i = 0; i < count - 1; i++) {
    const email = faker.internet.email().toLowerCase();
    const hashedPassword = await hash(faker.internet.password(), 10);

    const user = await prisma.user.create({
      data: {
        email,
        name: faker.person.fullName(),
        image: faker.image.avatar(),
        accounts: {
          create: {
            type: "credentials",
            provider: "credentials",
            providerAccountId: email,
            hashedPassword,
          },
        },
      },
    });

    users.push(user);
  }

  return users;
}

async function createSites(users: User[]): Promise<Site[]> {
  const sites: Site[] = [];

  for (const user of users) {
    for (let i = 0; i < SITES_PER_USER; i++) {
      const name = faker.company.name();
      // Create a URL-friendly subdomain
      const subdomain = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .substring(0, 20);

      const site = await prisma.site.create({
        data: {
          name,
          description: faker.company.catchPhrase(),
          subdomain,
          userId: user.id,
        },
      });

      sites.push(site);
    }
  }

  return sites;
}

async function createPosts(sites: Site[]): Promise<Post[]> {
  const posts: Post[] = [];

  for (const site of sites) {
    for (let i = 0; i < POSTS_PER_SITE; i++) {
      const title = faker.lorem.sentence(5);
      // Create a URL-friendly slug
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 50);

      const post = await prisma.post.create({
        data: {
          title,
          slug,
          content: faker.lorem.paragraphs(5),
          published: true,
          siteId: site.id,
        },
      });

      posts.push(post);
    }
  }

  return posts;
}

async function createComments(
  posts: Post[],
  users: User[]
): Promise<Comment[]> {
  const comments: Comment[] = [];

  for (const post of posts) {
    // Create top-level comments
    const topLevelComments: Comment[] = [];
    for (let i = 0; i < COMMENTS_PER_POST; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      const comment = await prisma.comment.create({
        data: {
          content: faker.lorem.paragraph(),
          postId: post.id,
          userId: randomUser.id,
        },
      });

      topLevelComments.push(comment);
      comments.push(comment);
    }

    // Create some replies to top-level comments
    for (const comment of topLevelComments) {
      // 50% chance to have a reply
      if (Math.random() > 0.5) {
        const randomUser = users[Math.floor(Math.random() * users.length)];

        const reply = await prisma.comment.create({
          data: {
            content: faker.lorem.paragraph(),
            postId: post.id,
            userId: randomUser.id,
            parentId: comment.id,
          },
        });

        comments.push(reply);
      }
    }
  }

  return comments;
}

async function createReactions(
  posts: Post[],
  users: User[]
): Promise<Reaction[]> {
  const reactions: Reaction[] = [];
  const reactionTypes = Object.values(ReactionType);

  for (const post of posts) {
    // Create a random number of reactions for each post
    const numReactions = Math.floor(Math.random() * REACTIONS_PER_POST) + 1;

    // Keep track of users who have already reacted to avoid duplicates
    const reactedUsers = new Set<string>();

    for (let i = 0; i < numReactions; i++) {
      // Get a random user who hasn't reacted to this post yet
      let randomUser: User;
      do {
        randomUser = users[Math.floor(Math.random() * users.length)];
      } while (reactedUsers.has(randomUser.id));

      reactedUsers.add(randomUser.id);

      // Get a random reaction type
      const randomType =
        reactionTypes[Math.floor(Math.random() * reactionTypes.length)];

      try {
        const reaction = await prisma.reaction.create({
          data: {
            type: randomType,
            postId: post.id,
            userId: randomUser.id,
          },
        });

        reactions.push(reaction);
      } catch (error) {
        // Skip if we hit a unique constraint error
        console.log(
          `Skipping duplicate reaction for post ${post.id} and user ${randomUser.id}`
        );
      }
    }
  }

  return reactions;
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
