import { PrismaClient } from '../../generated/prisma'

const prisma = new PrismaClient()

async function seed() {
  // 1. Create user
  const user = await prisma.user.create({
    data: {
      email: 'trigontarb@example.com',
      name: 'Trigonotarb Freelancer',
      street: '15 Street st',
      city: 'Cardiff',
      postalCode: 'CF11 1NS',
      country: 'UK',
    },
  })

  // 2. Create client
  const client = await prisma.client.create({
    data: {
      name: 'Acme Corp',
      email: 'client@acme.com',
      street: '456 Client Ave',
      city: 'Manchester',
      postalCode: 'M1 1AE',
      country: 'UK',
    },
  })

  // 3. Define invoice items
  const items = [
    { description: 'Website Design', unitPrice: 500, quantity: 1 },
    { description: 'WordPress Update', unitPrice: 200, quantity: 2 },
  ]

  const itemData = items.map(item => ({
    ...item,
    totalPrice: item.unitPrice * item.quantity,
  }))

  const totalAmount = itemData.reduce((sum, i) => sum + i.totalPrice, 0)

  // 4. Create invoice
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-0001',
      projectDesc: 'Landing page and maintenance',
      paymentTerms: 'Due in 14 days',
      status: 'pending',
      totalAmount,
      user: { connect: { id: user.id } },
      client: { connect: { id: client.id } },
      items: {
        create: itemData,
      },
    },
    include: {
      items: true,
      client: true,
      user: true,
    },
  })

  console.log('Seeded Invoice:', invoice)
}

seed()
  .catch((e) => {
    console.error('Seeding failed:', e)
  })
  .finally(() => prisma.$disconnect())
