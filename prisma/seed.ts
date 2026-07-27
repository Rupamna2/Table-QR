import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding minimal dev dataset...')

  // Upsert Restaurant Table
  const tableToken = 'table_1_qr_token_dev'
  const table = await prisma.restaurantTable.upsert({
    where: { tableNum: '1' },
    update: { qrToken: tableToken },
    create: {
      tableNum: '1',
      qrToken: tableToken,
    },
  })
  console.log(`Upserted table: ${table.tableNum}`)

  // Upsert Categories
  const category1 = await prisma.category.upsert({
    where: { id: 'cat-1' },
    update: {},
    create: {
      id: 'cat-1',
      name: 'Starters',
      sortOrder: 1,
    },
  })

  const category2 = await prisma.category.upsert({
    where: { id: 'cat-2' },
    update: {},
    create: {
      id: 'cat-2',
      name: 'Mains',
      sortOrder: 2,
    },
  })
  console.log(`Upserted categories: ${category1.name}, ${category2.name}`)

  // Upsert Menu Items and Variants
  const items = [
    {
      id: 'item-1',
      categoryId: category1.id,
      name: 'Garlic Bread',
      price: 5.99,
      variantName: 'Add Cheese',
      variantPrice: 1.5,
    },
    {
      id: 'item-2',
      categoryId: category1.id,
      name: 'Bruschetta',
      price: 7.99,
      variantName: 'Extra Tomato',
      variantPrice: 0.5,
    },
    {
      id: 'item-3',
      categoryId: category2.id,
      name: 'Margherita Pizza',
      price: 12.99,
      variantName: 'Large',
      variantPrice: 3.0,
    },
    {
      id: 'item-4',
      categoryId: category2.id,
      name: 'Pasta Carbonara',
      price: 14.99,
      variantName: 'Gluten Free Pasta',
      variantPrice: 2.0,
    },
  ]

  for (const item of items) {
    const menuItem = await prisma.menuItem.upsert({
      where: { id: item.id },
      update: {
        price: item.price,
      },
      create: {
        id: item.id,
        categoryId: item.categoryId,
        name: item.name,
        price: item.price,
      },
    })

    // Add variant
    const variantId = `${item.id}-var-1`
    await prisma.itemVariant.upsert({
      where: { id: variantId },
      update: {
        extraPrice: item.variantPrice,
      },
      create: {
        id: variantId,
        menuItemId: menuItem.id,
        name: item.variantName,
        extraPrice: item.variantPrice,
      },
    })
    console.log(`Upserted item: ${menuItem.name} with variant ${item.variantName}`)
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
