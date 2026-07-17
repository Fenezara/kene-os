import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Helper to get Tenant, Site, and Cashier Employee
async function getPrerequisites() {
  let tenant = await db.tenant.findFirst()
  if (!tenant) {
    // Create standard default country & currency first
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

  return { tenant, site, employee }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tenant, site, employee } = await getPrerequisites()

    const { clientId, items, subtotal, vatAmount, total, method } = body

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: { message: 'Les articles ou prestations vendus sont requis.' } },
        { status: 400 }
      )
    }

    // 1. If method is wallet, fetch and check client wallet
    let clientUser: any = null
    let wallet: any = null

    if (clientId) {
      const clientRecord = await db.client.findUnique({
        where: { id: clientId },
        include: { user: true }
      })
      if (clientRecord && clientRecord.user) {
        clientUser = clientRecord.user
        wallet = await db.wallet.findUnique({
          where: { userId: clientUser.id }
        })
      }
    }

    if (method === 'wallet') {
      if (!wallet || wallet.balance < parseFloat(total)) {
        return NextResponse.json(
          { error: { message: 'Solde insuffisant sur le portefeuille de la cliente.' } },
          { status: 400 }
        )
      }
    }

    // Generate unique sequential invoice number
    const totalSales = await db.sale.count({ where: { tenantId: tenant.id } })
    const invoiceNumber = `FAC-2026-${(totalSales + 1).toString().padStart(4, '0')}`

    const newSale = await db.sale.create({
      data: {
        tenantId: tenant.id,
        siteId: site.id,
        invoiceNumber,
        clientId: clientId || null,
        cashierId: employee.id,
        items: JSON.stringify(items),
        subtotal: parseFloat(subtotal),
        vatAmount: parseFloat(vatAmount),
        total: parseFloat(total),
        status: 'completed' as any,
      },
    })

    // Log the associated payment
    await db.payment.create({
      data: {
        tenantId: tenant.id,
        saleId: newSale.id,
        amount: parseFloat(total),
        method: (method || 'cash') as any,
        status: 'confirmed' as any,
        paidAt: new Date(),
      }
    })

    // 2. Perform wallet deduction if paid via wallet
    if (method === 'wallet' && wallet) {
      await db.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: parseFloat(total) } }
      })
      await db.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'debit',
          amount: parseFloat(total),
          reason: 'payment',
          referenceId: newSale.id
        }
      })
    }

    // 3. Reward 1% cashback on custom product purchases/soins if client is registered
    if (clientUser) {
      const cashbackAmount = Math.round(parseFloat(total) * 0.01)
      
      // Re-fetch wallet in case we just decremented it or it doesn't exist
      let userWallet = await db.wallet.findUnique({
        where: { userId: clientUser.id }
      })

      if (!userWallet) {
        userWallet = await db.wallet.create({
          data: {
            userId: clientUser.id,
            balance: 0,
            currencyCode: 'XOF'
          }
        })
      }

      await db.wallet.update({
        where: { id: userWallet.id },
        data: { balance: { increment: cashbackAmount } }
      })

      await db.walletTransaction.create({
        data: {
          walletId: userWallet.id,
          type: 'credit',
          amount: cashbackAmount,
          reason: 'cashback',
          referenceId: newSale.id
        }
      })
    }

    // Generate automated SYSCOHADA accounting entry
    try {
      const totalEntries = await db.accountingEntry.count({ where: { tenantId: tenant.id } })
      const entryNumber = `ECR-2026-${(totalEntries + 1).toString().padStart(4, '0')}`

      let soinTotal = 0
      let produitTotal = 0
      
      items.forEach((it: any) => {
        const lineAmount = (parseFloat(it.price) || 0) * (parseInt(it.qty) || 1)
        if (it.category === 'soin') {
          soinTotal += lineAmount
        } else {
          produitTotal += lineAmount
        }
      })

      const accountingLines: any[] = []
      const isCash = method === 'cash'
      const isWallet = method === 'wallet'

      // Debit (Cash, Wallet Client Avances, or Momo/Bank)
      accountingLines.push({
        accountNumber: isCash ? '5711' : (isWallet ? '4191' : '5212'),
        accountName: isCash ? 'Caisse Principale' : (isWallet ? 'Clients, Avances Reçues (Wallet)' : 'Banque Mobile Money'),
        debit: parseFloat(total),
        credit: 0,
      })

      // Credit: Services
      if (soinTotal > 0) {
        accountingLines.push({
          accountNumber: '706',
          accountName: 'Prestations de Services (Soins)',
          debit: 0,
          credit: soinTotal,
        })
      }

      // Credit: Products
      if (produitTotal > 0) {
        accountingLines.push({
          accountNumber: '701',
          accountName: 'Ventes de Produits Cosmétiques',
          debit: 0,
          credit: produitTotal,
        })
      }

      // Credit: VAT
      if (parseFloat(vatAmount) > 0) {
        accountingLines.push({
          accountNumber: '4431',
          accountName: 'État, TVA Facturée sur Ventes (18%)',
          debit: 0,
          credit: parseFloat(vatAmount),
        })
      }

      await db.accountingEntry.create({
        data: {
          tenantId: tenant.id,
          entryNumber,
          journal: (isCash ? 'caisse' : (isWallet ? 'od' : 'banque')) as any,
          entryDate: new Date(),
          reference: invoiceNumber,
          description: `Facture ${invoiceNumber} - Vente POS`,
          lines: JSON.stringify(accountingLines),
          status: 'posted',
        }
      })
    } catch (acctError) {
      console.error('[SYSCOHADA AUTO ENTRY FAILED]', acctError)
    }

    console.log(`[KÈNÈ POS] Vente enregistrée : ${invoiceNumber} pour un montant de ${total} FCFA (Méthode : ${method})`)

    return NextResponse.json({
      success: true,
      sale: newSale,
    })
  } catch (error: any) {
    console.error('[POS SALES POST ERROR]', error)
    return NextResponse.json(
      { error: { message: error.message || 'Une erreur interne est survenue.' } },
      { status: 500 }
    )
  }
}
