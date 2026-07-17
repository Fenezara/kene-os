import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Helper to seed/retrieve mock prerequisites (Tenant, Site, Employee, Service, Client)
async function getPrerequisites() {
  // 1. Get or create Tenant
  let tenant = await db.tenant.findFirst()
  if (!tenant) {
    // We need a Country first
    let country = await db.country.findUnique({ where: { code: 'CI' } })
    if (!country) {
      country = await db.country.create({
        data: {
          code: 'CI',
          name: "Côte d'Ivoire",
          currencyCode: 'XOF',
          language: 'fr-CI',
          ohada: true,
          config: '{}'
        }
      })
    }
    // We need a Currency
    let currency = await db.currency.findUnique({ where: { code: 'XOF' } })
    if (!currency) {
      currency = await db.currency.create({
        data: {
          code: 'XOF',
          name: 'Franc CFA UEMOA',
          symbol: 'FCFA',
        }
      })
    }
    
    tenant = await db.tenant.create({
      data: {
        name: 'Kènè Institut Cocody',
        legalName: 'Kènè Beauté SAS',
        type: 'institut',
        countryCode: 'CI',
        currencyCode: 'XOF',
        address: '{}',
      }
    })
  }

  // 2. Get or create Site
  let site = await db.site.findFirst({ where: { tenantId: tenant.id } })
  if (!site) {
    site = await db.site.create({
      data: {
        tenantId: tenant.id,
        name: 'Cabine Principale Cocody',
        address: '{}',
        phone: '+2250102030405',
      }
    })
  }

  // 3. Get or create Employee (Praticienne)
  let employee = await db.employee.findFirst({ where: { tenantId: tenant.id } })
  if (!employee) {
    employee = await db.employee.create({
      data: {
        tenantId: tenant.id,
        siteId: site.id,
        firstName: 'Mariama',
        lastName: 'Diallo',
        birthDate: new Date('1995-04-12'),
        gender: 'female' as any,
        phone: '+2250708091011',
        address: '{}',
        hireDate: new Date('2024-01-15'),
        position: 'Esthéticienne Experte',
        baseSalary: 250000,
        documents: '[]',
      }
    })
  }

  // 4. Get or create Service (Prestation)
  let service = await db.service.findFirst({ where: { tenantId: tenant.id } })
  if (!service) {
    service = await db.service.create({
      data: {
        tenantId: tenant.id,
        name: 'Soin Botanique Clarifiant Moringa',
        category: 'Visage',
        durationMin: 60,
        price: 25000,
        resourcesRequired: '[]',
      }
    })
  }

  // 5. Get or create Client
  let client = await db.client.findFirst({ where: { tenantId: tenant.id } })
  if (!client) {
    // Find first global User or create
    let user = await db.user.findFirst()
    if (!user) {
      user = await db.user.create({
        data: {
          phone: '+2250102030405',
          firstName: 'Fatou',
          lastName: 'Bamba',
        }
      })
    }
    client = await db.client.create({
      data: {
        tenantId: tenant.id,
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        allergies: '[]',
        treatments: '[]',
      }
    })
  }

  return { tenant, site, employee, service, client }
}

export async function GET(request: Request) {
  try {
    const { tenant } = await getPrerequisites()
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    const metadata = searchParams.get('metadata') === 'true'

    if (metadata) {
      const services = await db.service.findMany({
        where: { tenantId: tenant.id, active: true }
      })
      const employees = await db.employee.findMany({
        where: { tenantId: tenant.id, status: 'active' }
      })
      return NextResponse.json({ success: true, services, employees })
    }

    const whereClause: any = { tenantId: tenant.id }
    if (clientId) {
      whereClause.clientId = clientId
    }

    const appointments = await db.appointment.findMany({
      where: whereClause,
      include: {
        client: true,
        service: true,
        employee: true,
      },
      orderBy: { startAt: 'asc' },
    })

    return NextResponse.json({ success: true, appointments })
  } catch (error: any) {
    console.error('[APPOINTMENTS GET ERROR]', error)
    return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tenant, site, employee, service, client } = await getPrerequisites()

    const { clientId, serviceId, employeeId, startAt: startStr, amount, depositAmount: depAmt, paymentMethod, notes } = body

    const targetClientId = clientId || client.id
    const targetServiceId = serviceId || service.id
    const targetEmployeeId = employeeId || employee.id
    const depositAmount = parseFloat(depAmt || '0')

    // Find service duration
    let durationMin = service.durationMin
    if (targetServiceId !== service.id) {
      const selectedService = await db.service.findUnique({
        where: { id: targetServiceId }
      })
      if (selectedService) durationMin = selectedService.durationMin
    }

    const startAt = new Date(startStr || Date.now())
    const endAt = new Date(startAt.getTime() + durationMin * 60 * 1000)

    // 1. Handle wallet deposit payment deduction if applicable
    if (paymentMethod === 'wallet' && depositAmount > 0) {
      const clientRecord = await db.client.findUnique({
        where: { id: targetClientId },
        include: { user: true }
      })
      if (!clientRecord || !clientRecord.user) {
        return NextResponse.json({ error: { message: 'Client account user not found' } }, { status: 400 })
      }

      const wallet = await db.wallet.findUnique({
        where: { userId: clientRecord.user.id }
      })

      if (!wallet || wallet.balance < depositAmount) {
        return NextResponse.json({ error: { message: 'Solde insuffisant sur le portefeuille de la cliente.' } }, { status: 400 })
      }

      // Deduct
      await db.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: depositAmount } }
      })

      // Log transaction
      await db.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'debit',
          amount: depositAmount,
          reason: 'payment',
        }
      })
    }

    // 2. Create the appointment
    const newAppointment = await db.appointment.create({
      data: {
        tenantId: tenant.id,
        siteId: site.id,
        clientId: targetClientId,
        serviceId: targetServiceId,
        employeeId: targetEmployeeId,
        startAt,
        endAt,
        amount: parseFloat(amount || service.price),
        depositAmount,
        notes: notes || 'Créé via Kènè en ligne',
        status: 'pending',
        source: 'online' as any,
      },
    })

    // 3. Log the payment and accounting double entry if a deposit was paid
    if (depositAmount > 0) {
      const payment = await db.payment.create({
        data: {
          tenantId: tenant.id,
          saleId: null as any,
          appointmentId: newAppointment.id,
          amount: depositAmount,
          method: (paymentMethod || 'cash') as any,
          status: 'confirmed',
          paidAt: new Date()
        }
      })

      try {
        const totalEntries = await db.accountingEntry.count({ where: { tenantId: tenant.id } })
        const entryNumber = `ECR-2026-${(totalEntries + 1).toString().padStart(4, '0')}`

        const accountingLines = [
          {
            accountNumber: paymentMethod === 'cash' ? '5711' : (paymentMethod === 'wallet' ? '4191' : '5212'),
            accountName: paymentMethod === 'cash' ? 'Caisse Principale' : (paymentMethod === 'wallet' ? 'Clients, Avances Reçues (Wallet)' : 'Banque Mobile Money'),
            debit: depositAmount,
            credit: 0
          },
          {
            accountNumber: '4191',
            accountName: 'Clients, Avances et Acomptes Reçus (Acompte RDV)',
            debit: 0,
            credit: depositAmount
          }
        ]

        await db.accountingEntry.create({
          data: {
            tenantId: tenant.id,
            entryNumber,
            journal: paymentMethod === 'cash' ? 'caisse' : 'banque',
            entryDate: new Date(),
            reference: `ACPT-${newAppointment.id.substring(0, 8)}`,
            description: `Acompte reçu pour RDV ${newAppointment.id.substring(0, 8)}`,
            lines: JSON.stringify(accountingLines),
            status: 'posted'
          }
        })
      } catch (acctErr) {
        console.error('[SYSCOHADA APPOINTMENT DEPOSIT ERROR]', acctErr)
      }
    }

    // 4. Log simulated SMS notification in AuditLog table
    try {
      const fullClient = await db.client.findUnique({
        where: { id: targetClientId }
      })
      const clientPhone = fullClient?.phone || client.phone
      const clientName = fullClient ? `${fullClient.firstName} ${fullClient.lastName}` : 'Chère cliente'
      const clientUserId = fullClient?.userId || client.userId

      const selectedServ = await db.service.findUnique({
        where: { id: targetServiceId }
      })
      const serviceName = selectedServ?.name || 'Soin Kènè'

      await db.auditLog.create({
        data: {
          tenantId: tenant.id,
          userId: clientUserId || 'system',
          action: 'send_sms_notification',
          entityType: 'appointment',
          entityId: newAppointment.id,
          changes: JSON.stringify({
            to: clientPhone,
            channel: 'SMS',
            message: `Bonjour ${clientName}, votre rendez-vous pour le soin "${serviceName}" le ${startAt.toLocaleString('fr-FR')} est bien programmé. Acompte de ${depositAmount.toLocaleString()} F reçu. À bientôt chez Kènè !`
          })
        }
      })
    } catch (auditErr) {
      console.error('[SMS LOG ERROR]', auditErr)
    }

    return NextResponse.json({ success: true, appointment: newAppointment })
  } catch (error: any) {
    console.error('[APPOINTMENTS POST ERROR]', error)
    return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  }
}
