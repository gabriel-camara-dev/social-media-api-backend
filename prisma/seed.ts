import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

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

  const post1 = await prisma.posts.create({
    data: {
      content: 'Primeiro post do admin! Bem-vindos à plataforma!',
      author: {
        connect: { publicId: admin.publicId },
      },
    },
  })

  const post2 = await prisma.posts.create({
    data: {
      content: 'Segundo post aqui. Como estão todos hoje?',
      author: {
        connect: { publicId: admin.publicId },
      },
    },
  })

  const post3 = await prisma.posts.create({
    data: {
      content:
        'Terceiro post do admin. Obrigado por fazerem parte desta comunidade!',
      author: {
        connect: { publicId: admin.publicId },
      },
    },
  })

  const comment1_post1 = await prisma.comment.create({
    data: {
      content: 'Ótimo primeiro post, admin!',
      author: {
        connect: { publicId: admin.publicId },
      },
      post: {
        connect: { publicId: post1.publicId },
      },
    },
  })

  const comment2_post1 = await prisma.comment.create({
    data: {
      content: 'Adorei a iniciativa!',
      author: {
        connect: { publicId: admin.publicId },
      },
      post: {
        connect: { publicId: post1.publicId },
      },
    },
  })

  const comment3_post1 = await prisma.comment.create({
    data: {
      content: 'Parabéns pelo lançamento!',
      author: {
        connect: { publicId: admin.publicId },
      },
      post: {
        connect: { publicId: post1.publicId },
      },
    },
  })

  const comment1_post2 = await prisma.comment.create({
    data: {
      content: 'Estou ótimo, obrigado!',
      author: {
        connect: { publicId: admin.publicId },
      },
      post: {
        connect: { publicId: post2.publicId },
      },
    },
  })

  const comment2_post2 = await prisma.comment.create({
    data: {
      content: 'Tudo bem por aqui!',
      author: {
        connect: { publicId: admin.publicId },
      },
      post: {
        connect: { publicId: post2.publicId },
      },
    },
  })

  const comment3_post2 = await prisma.comment.create({
    data: {
      content: 'Excelente dia hoje!',
      author: {
        connect: { publicId: admin.publicId },
      },
      post: {
        connect: { publicId: post2.publicId },
      },
    },
  })

  const comment1_post3 = await prisma.comment.create({
    data: {
      content: 'Obrigado por criar esta plataforma!',
      author: {
        connect: { publicId: admin.publicId },
      },
      post: {
        connect: { publicId: post3.publicId },
      },
    },
  })

  const comment2_post3 = await prisma.comment.create({
    data: {
      content: 'Comunidade incrível!',
      author: {
        connect: { publicId: admin.publicId },
      },
      post: {
        connect: { publicId: post3.publicId },
      },
    },
  })

  const comment3_post3 = await prisma.comment.create({
    data: {
      content: 'Estou adorando participar!',
      author: {
        connect: { publicId: admin.publicId },
      },
      post: {
        connect: { publicId: post3.publicId },
      },
    },
  })

  await prisma.comment.createMany({
    data: [
      {
        content: 'Concordo plenamente!',
        authorId: admin.publicId,
        postId: post1.publicId,
        parentId: comment1_post1.publicId,
      },
      {
        content: 'Muito bem dito!',
        authorId: admin.publicId,
        postId: post1.publicId,
        parentId: comment1_post1.publicId,
      },
      {
        content: 'Também achei excelente!',
        authorId: admin.publicId,
        postId: post1.publicId,
        parentId: comment1_post1.publicId,
      },
      {
        content: 'A iniciativa é realmente maravilhosa!',
        authorId: admin.publicId,
        postId: post1.publicId,
        parentId: comment2_post1.publicId,
      },
      {
        content: 'Estou muito animado!',
        authorId: admin.publicId,
        postId: post1.publicId,
        parentId: comment2_post1.publicId,
      },
      {
        content: 'Todos estão adorando!',
        authorId: admin.publicId,
        postId: post1.publicId,
        parentId: comment2_post1.publicId,
      },
      {
        content: 'Realmente parabéns!',
        authorId: admin.publicId,
        postId: post1.publicId,
        parentId: comment3_post1.publicId,
      },
      {
        content: 'Merece muitos elogios!',
        authorId: admin.publicId,
        postId: post1.publicId,
        parentId: comment3_post1.publicId,
      },
      {
        content: 'Sucesso garantido!',
        authorId: admin.publicId,
        postId: post1.publicId,
        parentId: comment3_post1.publicId,
      },
      {
        content: 'Que bom que está bem!',
        authorId: admin.publicId,
        postId: post2.publicId,
        parentId: comment1_post2.publicId,
      },
      {
        content: 'Fico feliz em saber!',
        authorId: admin.publicId,
        postId: post2.publicId,
        parentId: comment1_post2.publicId,
      },
      {
        content: 'Excelente notícia!',
        authorId: admin.publicId,
        postId: post2.publicId,
        parentId: comment1_post2.publicId,
      },
      {
        content: 'Ótimo saber que está tudo bem!',
        authorId: admin.publicId,
        postId: post2.publicId,
        parentId: comment2_post2.publicId,
      },
      {
        content: 'Isso que importa!',
        authorId: admin.publicId,
        postId: post2.publicId,
        parentId: comment2_post2.publicId,
      },
      {
        content: 'Continua assim!',
        authorId: admin.publicId,
        postId: post2.publicId,
        parentId: comment2_post2.publicId,
      },
      {
        content: 'Dia maravilhoso mesmo!',
        authorId: admin.publicId,
        postId: post2.publicId,
        parentId: comment3_post2.publicId,
      },
      {
        content: 'O tempo está ótimo!',
        authorId: admin.publicId,
        postId: post2.publicId,
        parentId: comment3_post2.publicId,
      },
      {
        content: 'Perfeito para conversar!',
        authorId: admin.publicId,
        postId: post2.publicId,
        parentId: comment3_post2.publicId,
      },
      {
        content: 'A plataforma é incrível!',
        authorId: admin.publicId,
        postId: post3.publicId,
        parentId: comment1_post3.publicId,
      },
      {
        content: 'Muito obrigado ao admin!',
        authorId: admin.publicId,
        postId: post3.publicId,
        parentId: comment1_post3.publicId,
      },
      {
        content: 'Está sendo fantástico!',
        authorId: admin.publicId,
        postId: post3.publicId,
        parentId: comment1_post3.publicId,
      },
      {
        content: 'A comunidade está crescendo!',
        authorId: admin.publicId,
        postId: post3.publicId,
        parentId: comment2_post3.publicId,
      },
      {
        content: 'Pessoas maravilhosas aqui!',
        authorId: admin.publicId,
        postId: post3.publicId,
        parentId: comment2_post3.publicId,
      },
      {
        content: 'Todos são muito legais!',
        authorId: admin.publicId,
        postId: post3.publicId,
        parentId: comment2_post3.publicId,
      },
      {
        content: 'Eu também estou adorando!',
        authorId: admin.publicId,
        postId: post3.publicId,
        parentId: comment3_post3.publicId,
      },
      {
        content: 'Participação ativa é tudo!',
        authorId: admin.publicId,
        postId: post3.publicId,
        parentId: comment3_post3.publicId,
      },
      {
        content: 'Vamos continuar assim!',
        authorId: admin.publicId,
        postId: post3.publicId,
        parentId: comment3_post3.publicId,
      },
    ],
  })

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
