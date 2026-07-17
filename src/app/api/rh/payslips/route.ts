import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Helper to seed/retrieve mock prerequisites (Tenant, Site, Employee)
async function getPrerequisites() {
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

  // Create a second employee to make the UI look more complete
  let employee2 = await db.employee.findFirst({ where: { phone: '+2250506070809' } })
  if (!employee2) {
    employee2 = await db.employee.create({
      data: {
        tenantId: tenant.id,
        siteId: site.id,
        firstName: 'Awa',
        lastName: 'Kouamé',
        birthDate: new Date('1998-08-24'),
        gender: 'female' as any,
        phone: '+2250506070809',
        address: '{}',
        hireDate: new Date('2025-02-10'),
        position: 'Masseuse Botanique',
        baseSalary: 180000,
        documents: '[]',
      }
    })
  }

  return { tenant, site }
}

export async function GET(request: Request) {
  try {
    const { tenant } = await getPrerequisites()
    const { searchParams } = new URL(request.url)
    const month = parseInt(searchParams.get('month') || '7')
    const year = parseInt(searchParams.get('year') || '2026')
    const country = searchParams.get('country') || tenant.countryCode || 'CI'

    // Find or create the pay period
    let payPeriod = await db.payPeriod.findUnique({
      where: {
        tenantId_periodMonth_periodYear: {
          tenantId: tenant.id,
          periodMonth: month,
          periodYear: year,
        }
      }
    })

    if (!payPeriod) {
      payPeriod = await db.payPeriod.create({
        data: {
          tenantId: tenant.id,
          periodMonth: month,
          periodYear: year,
          status: 'open',
        }
      })
    }

    // Get all employees
    const employees = await db.employee.findMany({
      where: { tenantId: tenant.id, status: 'active' },
    })

    // Get already saved payslips for this period
    const savedPayslips = await db.payslip.findMany({
      where: { payPeriodId: payPeriod.id },
    })

    // Prepare calculations dynamically
    const payrolls = employees.map((emp) => {
      const saved = savedPayslips.find((ps) => ps.employeeId === emp.id)
      
      if (saved) {
        return {
          employee: emp,
          isSaved: true,
          payslipId: saved.id,
          grossSalary: saved.grossSalary,
          cnpsEmployee: saved.cnpsEmployee,
          cnpsEmployer: saved.cnpsEmployer,
          igrTax: saved.igrTax,
          netPay: saved.netPay,
          bonuses: JSON.parse(saved.bonuses),
          deductions: JSON.parse(saved.deductions),
        }
      }

      const base = emp.baseSalary
      const transportBonus = 30000
      const gross = base + transportBonus
      
      let cnpsEmployee = 0
      let cnpsEmployer = 0
      let igrTax = 0
      let bonuses = [{ name: 'Indemnité de Transport', amount: transportBonus }]
      let deductions: any[] = []

      if (country === 'SN') {
        // --- SÉNÉGAL RULES ---
        // IPRES Retraite : 5.6% employé, 8.4% employeur (assiette plafonnée à 432 000 FCFA)
        const ipresBase = Math.min(base, 432000)
        cnpsEmployee = Math.round(ipresBase * 0.056) // Map IPRES to cnpsEmployee field
        cnpsEmployer = Math.round(ipresBase * 0.084) // Map IPRES to cnpsEmployer field

        // IPM (Institut de Prévoyance Maladie) : 1.5% employé, 1.5% employeur
        const ipmEmployee = Math.round(gross * 0.015)
        const ipmEmployer = Math.round(gross * 0.015)

        deductions.push({ name: 'IPRES Retraite', amount: cnpsEmployee })
        deductions.push({ name: 'IPM Maladie', amount: ipmEmployee })

        // IR Sénégal (progressive brackets simplified for demo)
        // 0 - 150k : 0%, 150k - 300k : 4%, 300k+ : 8%
        if (base > 150000) {
          if (base <= 300000) {
            igrTax = Math.round((base - 150000) * 0.04)
          } else {
            igrTax = Math.round((300000 - 150000) * 0.04 + (base - 300000) * 0.08)
          }
        }
        
        // Sum total employee social deductions
        cnpsEmployee = cnpsEmployee + ipmEmployee
        cnpsEmployer = cnpsEmployer + ipmEmployer
      } else {
        // --- CÔTE D'IVOIRE RULES ---
        // CNPS Part Salariale: 5.5%
        cnpsEmployee = Math.round(base * 0.055)
        // CNPS Part Patronale: 10.9%
        cnpsEmployer = Math.round(base * 0.109)

        deductions.push({ name: 'CNPS Retraite', amount: cnpsEmployee })

        // IGR progressive bracket
        if (base > 150000) {
          if (base <= 300000) {
            igrTax = Math.round((base - 150000) * 0.02)
          } else {
            igrTax = Math.round((300000 - 150000) * 0.02 + (base - 300000) * 0.05)
          }
        }
      }

      const net = gross - cnpsEmployee - igrTax

      return {
        employee: emp,
        isSaved: false,
        payslipId: null,
        grossSalary: gross,
        cnpsEmployee,
        cnpsEmployer,
        igrTax,
        netPay: net,
        bonuses,
        deductions,
      }
    })

    return NextResponse.json({
      success: true,
      payPeriod,
      payrolls,
    })
  } catch (error: any) {
    console.error('[PAYSLIPS GET ERROR]', error)
    return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { payPeriodId, payslips } = body

    if (!payPeriodId || !payslips || !Array.isArray(payslips)) {
      return NextResponse.json(
        { error: { message: 'Période et bulletins de paie requis.' } },
        { status: 400 }
      )
    }

    const createdPayslips: any[] = []

    for (const ps of payslips) {
      // Delete existing payslip for this employee in this period if it exists
      await db.payslip.deleteMany({
        where: {
          payPeriodId,
          employeeId: ps.employeeId,
        }
      })

      const newPayslip = await db.payslip.create({
        data: {
          tenantId: ps.tenantId,
          employeeId: ps.employeeId,
          payPeriodId,
          grossSalary: parseFloat(ps.grossSalary),
          bonuses: JSON.stringify(ps.bonuses || []),
          deductions: JSON.stringify(ps.deductions || []),
          cnpsEmployee: parseFloat(ps.cnpsEmployee),
          cnpsEmployer: parseFloat(ps.cnpsEmployer),
          igrTax: parseFloat(ps.igrTax),
          netPay: parseFloat(ps.netPay),
        }
      })
      createdPayslips.push(newPayslip)
    }

    return NextResponse.json({
      success: true,
      created: createdPayslips.length,
    })
  } catch (error: any) {
    console.error('[PAYSLIPS POST ERROR]', error)
    return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  }
}
