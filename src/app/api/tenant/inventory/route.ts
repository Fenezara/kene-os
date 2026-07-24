import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const firstTenant = await db.tenant.findFirst();
    if (!firstTenant) {
      return NextResponse.json({ success: false, error: 'No tenant found' }, { status: 404 });
    }

    const products = await db.product.findMany({
      where: { tenantId: firstTenant.id },
      include: {
        inventoryItems: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Failed to fetch inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const firstTenant = await db.tenant.findFirst({
      include: { sites: true }
    });
    if (!firstTenant || !firstTenant.sites[0]) {
      return NextResponse.json({ success: false, error: 'Tenant or site not found' }, { status: 404 });
    }
    const defaultSite = firstTenant.sites[0];

    const body = await req.json();
    const { name, category, purchasePrice, salePrice, quantity, description, botanical } = body;

    if (!name || !category || purchasePrice === undefined || salePrice === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const product = await db.$transaction(async (prisma) => {
      const newProduct = await prisma.product.create({
        data: {
          tenantId: firstTenant.id,
          name,
          category,
          description: description || null,
          botanical: botanical || null,
          purchasePrice: parseFloat(purchasePrice),
          salePrice: parseFloat(salePrice),
        }
      });

      if (quantity && parseInt(quantity) > 0) {
        await prisma.inventoryItem.create({
          data: {
            tenantId: firstTenant.id,
            siteId: defaultSite.id,
            productId: newProduct.id,
            quantity: parseInt(quantity)
          }
        });
      }

      return newProduct;
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, category, purchasePrice, salePrice, quantity, description, botanical } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    const updated = await db.product.update({
      where: { id },
      data: {
        name,
        category,
        description,
        botanical,
        purchasePrice: purchasePrice !== undefined ? parseFloat(purchasePrice) : undefined,
        salePrice: salePrice !== undefined ? parseFloat(salePrice) : undefined,
      }
    });

    if (quantity !== undefined) {
      const existingInventory = await db.inventoryItem.findFirst({ where: { productId: id } });
      if (existingInventory) {
        await db.inventoryItem.update({
          where: { id: existingInventory.id },
          data: { quantity: parseInt(quantity) }
        });
      }
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    await db.inventoryItem.deleteMany({ where: { productId: id } });
    await db.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Produit supprimé du catalogue.' });
  } catch (error: any) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
