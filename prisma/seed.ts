import { PrismaClient } from '../generated/prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1. Create Admin User
  const email = 'admin@example.com'
  const password = 'password123'
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Admin User',
      password: hashedPassword,
    },
  })
  console.log({ user })

  // 2. Create Vendors
  const vendorsData = [
    { name: 'Luxe Fabrics Co.', contactPerson: 'Sarah Silk', email: 'sarah@luxefabrics.com', phone: '+15550101', serviceType: 'Fabrics & Upholstery' },
    { name: 'Modern Woodworks', contactPerson: 'Mike Carpenter', email: 'mike@modernwood.com', phone: '+15550102', serviceType: 'Carpentry' },
    { name: 'Bright Lights Ltd.', contactPerson: 'Jenny Watt', email: 'jenny@brightlights.com', phone: '+15550103', serviceType: 'Lighting' },
    { name: 'Stone & Tile Masters', contactPerson: 'David Rock', email: 'dave@stonemasters.com', phone: '+15550104', serviceType: 'Flooring' },
  ]

  for (const v of vendorsData) {
    await prisma.vendor.create({ data: v })
  }
  console.log('Vendors seeded')

  // 3. Create Products
  const productsData = [
    { name: 'Velvet Sofa 3-Seater', code: 'FUR-001', costPrice: 800, productPrice: 1200, description: 'Premium blue velvet sofa.' },
    { name: 'Oak Dining Table', code: 'FUR-002', costPrice: 500, productPrice: 850, description: 'Solid oak, seats 6.' },
    { name: 'Pendant Chandelier', code: 'LIG-001', costPrice: 150, productPrice: 300, description: 'Modern gold finish pendant.' },
    { name: 'Italian Marble Tile', code: 'FIN-001', costPrice: 8, productPrice: 15, description: 'Carrara marble, per sqft.' },
    { name: 'Wall Sconce', code: 'LIG-002', costPrice: 45, productPrice: 90, description: 'Minimalist black wall light.' },
  ]

  for (const p of productsData) {
    await prisma.product.create({ data: p })
  }
  console.log('Products seeded')

  // 4. Create Leads
  const leadsData = [
    { name: 'Alice Johnson', email: 'alice@example.com', phone: '+15550201', status: 'NEW', source: 'Website', budgetRange: '15000-25000', notes: 'Interested in living room renovation.' },
    { name: 'Bob Smith', email: 'bob@example.com', phone: '+15550202', status: 'CONTACTED', source: 'Referral', budgetRange: '50000+', notes: 'Full home interior design needed.' },
    { name: 'Charlie Davis', email: 'charlie@example.com', phone: '+15550203', status: 'WON', source: 'Instagram', budgetRange: '30000', notes: 'Kitchen remodel.' },
  ]

  for (const l of leadsData) {
    const lead = await prisma.lead.create({ data: l })
    
    // Add Note to Lead
    await prisma.note.create({
      data: { content: 'Initial consultation call scheduled.', leadId: lead.id }
    })

    // If WON, ensure project exists (auto-created by API usually, but here manually)
    if (lead.status === 'WON') {
      const project = await prisma.project.create({
        data: {
          name: `${lead.name}'s Residence`,
          leadId: lead.id,
          status: 'DESIGN',
          budget: 30000,
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 60)),
        }
      })

      // Add Project Milestones
      await prisma.milestone.createMany({
        data: [
          { name: 'Concept Approval', status: 'COMPLETED', projectId: project.id, dueDate: new Date() },
          { name: 'Material Selection', status: 'PENDING', projectId: project.id, dueDate: new Date(new Date().setDate(new Date().getDate() + 10)) },
          { name: 'Execution Start', status: 'PENDING', projectId: project.id, dueDate: new Date(new Date().setDate(new Date().getDate() + 20)) },
        ]
      })

      // Add Project Tasks
      await prisma.task.createMany({
        data: [
          { title: 'Measure Kitchen dimensions', status: 'DONE', projectId: project.id, assignedTo: 'Junior Designer' },
          { title: 'Create 3D Renders', status: 'IN_PROGRESS', projectId: project.id, assignedTo: 'Senior Designer' },
        ]
      })

      // Add Quotation for this Lead
      const quotation = await prisma.quotation.create({
        data: {
          leadId: lead.id,
          totalAmount: 5000,
          validUntil: new Date(new Date().setDate(new Date().getDate() + 15)),
          items: {
            create: [
              { description: 'Design Fee', quantity: 1, unitPrice: 2000, subtotal: 2000 },
              { description: 'Initial Material Advance', quantity: 1, unitPrice: 3000, subtotal: 3000 }
            ]
          }
        }
      })

      // Create Invoice from Quotation
      await prisma.invoice.create({
        data: {
          leadId: lead.id,
          quotationId: quotation.id,
          amount: 5000,
          status: 'SENT',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        }
      })
    }
  }
  console.log('Leads & Projects seeded')
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
