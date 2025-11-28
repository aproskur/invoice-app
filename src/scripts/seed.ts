import { PrismaClient, PaymentTerms, InvoiceStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  // 1. Ensure user exists
  const user = await prisma.user.upsert({
    where: { email: 'trigontarb@example.com' },
    update: {},
    create: {
      email: 'trigontarb@example.com',
      name: 'Trigonotarb Freelancer',
      street: '15 Street St',
      city: 'Cardiff',
      postalCode: 'CF11 1NS',
      country: 'United Kingdom',
    },
  })

  // 2. Ensure client exists
  const client = await prisma.client.upsert({
    where: { email: 'client@acme.com' },
    update: {},
    create: {
      name: 'Acme Corp',
      email: 'client@acme.com',
      street: '456 Client Ave',
      city: 'Manchester',
      postalCode: 'M1 1AE',
      country: 'United Kingdom',
    },
  })

  // 3. Define invoice items
  const items = [
    { description: 'Website Design', unitPrice: 500, quantity: 1 },
    { description: 'WordPress Update', unitPrice: 200, quantity: 2 },
  ]

  const itemData = items.map((item) => ({
    ...item,
    totalPrice: item.unitPrice * item.quantity,
  }))

  const totalAmount = itemData.reduce((sum, i) => sum + i.totalPrice, 0)
  const invoiceNumber = 'INV-2024-0001'
  const invoiceDate = new Date('2024-01-10')
  const paymentDue = new Date('2024-01-24')

  // 4. Upsert invoice to keep script idempotent
  const invoice = await prisma.invoice.upsert({
    where: { invoiceNumber },
    update: {
      description: 'Landing page and maintenance',
      invoiceDate,
      paymentDue,
      paymentTerms: PaymentTerms.NET_14,
      status: InvoiceStatus.pending,
      totalAmount,
      items: {
        deleteMany: {},
        create: itemData,
      },
    },
    create: {
      invoiceNumber,
      description: 'Landing page and maintenance',
      invoiceDate,
      paymentDue,
      paymentTerms: PaymentTerms.NET_14,
      status: InvoiceStatus.pending,
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
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
