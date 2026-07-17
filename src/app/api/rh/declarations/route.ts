import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = parseInt(searchParams.get('month') || '7')
    const year = parseInt(searchParams.get('year') || '2026')
    const country = searchParams.get('country') || 'CI'
    const format = searchParams.get('format') || 'csv'

    const tenant = await db.tenant.findFirst()
    if (!tenant) {
      return new Response('Tenant not found', { status: 404 })
    }

    // Get pay period
    const payPeriod = await db.payPeriod.findFirst({
      where: {
        tenantId: tenant.id,
        periodMonth: month,
        periodYear: year,
      }
    })

    if (!payPeriod) {
      return new Response('No payslips recorded for this period', { status: 404 })
    }

    const payslips = await db.payslip.findMany({
      where: { payPeriodId: payPeriod.id },
      include: { employee: true },
    })

    let csvContent = ''
    let filename = ''

    if (country === 'CI' && format === 'xml') {
      filename = `declaration_e-CNPS_CI_${month}_${year}.xml`
      let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n'
      xmlContent += `<DeclarationCNPS tenant="${tenant.legalName}" month="${month}" year="${year}">\n`
      xmlContent += `  <ContribuableID>1029384B</ContribuableID>\n`
      xmlContent += `  <EmployeesCount>${payslips.length}</EmployeesCount>\n`
      xmlContent += `  <TotalSalaries>${payslips.reduce((sum, p) => sum + p.grossSalary, 0)}</TotalSalaries>\n`
      xmlContent += `  <Employees>\n`
      
      payslips.forEach((ps) => {
        const cnpsBase = Math.min(ps.employee.baseSalary, 3375000)
        xmlContent += `    <Employee>\n`
        xmlContent += `      <SecuNumber>${ps.employee.ribMomo || '00000000'}</SecuNumber>\n`
        xmlContent += `      <Nom>${ps.employee.lastName}</Nom>\n`
        xmlContent += `      <Prenom>${ps.employee.firstName}</Prenom>\n`
        xmlContent += `      <SalaireBrut>${ps.grossSalary}</SalaireBrut>\n`
        xmlContent += `      <AssietteCNPS>${cnpsBase}</AssietteCNPS>\n`
        xmlContent += `      <PartSalariale>${ps.cnpsEmployee}</PartSalariale>\n`
        xmlContent += `      <PartPatronale>${ps.cnpsEmployer}</PartPatronale>\n`
        xmlContent += `    </Employee>\n`
      })
      
      xmlContent += `  </Employees>\n`
      xmlContent += `</DeclarationCNPS>\n`

      return new Response(xmlContent, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    }

    if (country === 'SN') {
      filename = `declaration_IPM_IPRES_${month}_${year}.csv`
      // Headers for Senegal IPM/IPRES declaration
      csvContent = 'Matricule,Nom,Prenom,Salaire Base,Assiette IPRES,Retraite IPM Salariale,Retraite IPM Patronale,IR Senegal\n'
      
      payslips.forEach((ps) => {
        const ipresBase = Math.min(ps.employee.baseSalary, 432000)
        csvContent += `"${ps.employee.id}","${ps.employee.lastName}","${ps.employee.firstName}",${ps.employee.baseSalary},${ipresBase},${ps.cnpsEmployee},${ps.cnpsEmployer},${ps.igrTax}\n`
      })
    } else {
      filename = `declaration_e-CNPS_CI_${month}_${year}.csv`
      // Headers for Côte d'Ivoire e-CNPS declaration
      csvContent = 'Numero Secu,Nom,Prenom,Salaire Brut,Assiette CNPS,CNPS Salarie (5.5%),CNPS Patronal (10.9%),Retenue IGR\n'
      
      payslips.forEach((ps) => {
        csvContent += `"${ps.employee.ribMomo || '00000000'}","${ps.employee.lastName}","${ps.employee.firstName}",${ps.grossSalary},${ps.employee.baseSalary},${ps.cnpsEmployee},${ps.cnpsEmployer},${ps.igrTax}\n`
      })
    }

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error: any) {
    console.error('[DECLARATIONS EXPORT ERROR]', error)
    return new Response(error.message || 'Error exporting declaration', { status: 500 })
  }
}
