import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { seedPosts } from './seed-data/posts'
import { seedComments } from './seed-data/comments'

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      username: 'admin',
      description: 'Admin user',
      birthDate: new Date('1990-01-01'),
      passwordDigest: await hash('12345678', 10),
      role: 'ADMIN',
    },
  })

  const posts = await seedPosts(prisma, admin.publicId)
  await seedComments(prisma, admin.publicId, posts)

  console.log('Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
