import { PrismaClient } from '../../generated/prisma' 
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  console.log('Users:', users)

  const clients = await prisma.client.findMany()
  console.log('Clients:', clients)

  const invoices = await prisma.invoice.findMany({
    include: { items: true, client: true, user: true }
  })
  console.log('Invoices:', JSON.stringify(invoices, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
