import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const email = "siddiquishahan217@gmail.com"
  const user = await prisma.user.update({
    where: { email },
    data: { isAdmin: true }
  })
  console.log(`User ${user.name} is now an admin.`)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
