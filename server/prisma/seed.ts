import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ProdIQ Phase 6 Database Seeding...');

  // Create Admin User if not exists
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@prodiq.ai' },
    update: { role: 'ADMIN' },
    create: {
      name: 'ProdIQ Administrator',
      email: 'admin@prodiq.ai',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Seed Seller Trust records
  const sellersData = [
    { sellerName: 'ASUS Authorized Store', rating: 4.9, reviewCount: 1420, deliveryReliabilityScore: 98.5, priceStabilityScore: 95.0, returnPolicyDays: 14, isVerified: true },
    { sellerName: 'Apple Store Official', rating: 5.0, reviewCount: 3890, deliveryReliabilityScore: 99.2, priceStabilityScore: 98.0, returnPolicyDays: 14, isVerified: true },
    { sellerName: 'Dell Premier Partner', rating: 4.7, reviewCount: 890, deliveryReliabilityScore: 94.0, priceStabilityScore: 91.5, returnPolicyDays: 14, isVerified: true },
    { sellerName: 'Samsung Direct', rating: 4.9, reviewCount: 2450, deliveryReliabilityScore: 98.0, priceStabilityScore: 96.0, returnPolicyDays: 14, isVerified: true },
    { sellerName: 'Sony Center', rating: 4.9, reviewCount: 1850, deliveryReliabilityScore: 97.5, priceStabilityScore: 95.5, returnPolicyDays: 14, isVerified: true },
  ];

  for (const seller of sellersData) {
    await prisma.sellerTrust.upsert({
      where: { sellerName: seller.sellerName },
      update: seller,
      create: seller,
    });
  }

  // Seed Products
  console.log('Seeding products...');
  const products = [
    {
      title: 'ASUS ROG Zephyrus G14 (2024)',
      brand: 'ASUS',
      category: 'LAPTOP',
      price: 1599.99,
      originalPrice: 1799.99,
      rating: 4.8,
      reviewCount: 342,
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
      sellerName: 'ASUS Authorized Store',
      sellerRating: 4.9,
      specsJson: JSON.stringify({
        processor: 'AMD Ryzen 9 8945HS',
        ram: '32GB LPDDR5X',
        storage: '1TB PCIe 4.0 NVMe SSD',
        display: '14" 3K OLED 120Hz',
        gpu: 'NVIDIA RTX 4060 8GB',
        battery: '73Wh'
      }),
      priceHistoryJson: JSON.stringify([
        { month: 'Jan', price: 1799.99 },
        { month: 'Feb', price: 1799.99 },
        { month: 'Mar', price: 1749.99 },
        { month: 'Apr', price: 1699.99 },
        { month: 'May', price: 1599.99 },
        { month: 'Jun', price: 1599.99 }
      ]),
    },
    {
      title: 'Apple MacBook Pro 14" M3 Pro',
      brand: 'Apple',
      category: 'LAPTOP',
      price: 1999.00,
      originalPrice: 1999.00,
      rating: 4.9,
      reviewCount: 890,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      sellerName: 'Apple Store Official',
      sellerRating: 5.0,
      specsJson: JSON.stringify({
        processor: 'Apple M3 Pro (11-core)',
        ram: '18GB Unified Memory',
        storage: '512GB SSD',
        display: '14.2" Liquid Retina XDR 120Hz',
        gpu: '14-core Apple GPU',
        battery: '72.4Wh'
      }),
      priceHistoryJson: JSON.stringify([
        { month: 'Jan', price: 1999.00 },
        { month: 'Feb', price: 1999.00 },
        { month: 'Mar', price: 1999.00 },
        { month: 'Apr', price: 1999.00 },
        { month: 'May', price: 1999.00 },
        { month: 'Jun', price: 1999.00 }
      ]),
    },
    {
      title: 'Dell XPS 15 (2024)',
      brand: 'Dell',
      category: 'LAPTOP',
      price: 1849.99,
      originalPrice: 1999.99,
      rating: 4.6,
      reviewCount: 412,
      image: 'https://images.unsplash.com/photo-1593642702821-c823b285f222?w=800&q=80',
      sellerName: 'Dell Premier Partner',
      sellerRating: 4.7,
      specsJson: JSON.stringify({
        processor: 'Intel Core Ultra 7 155H',
        ram: '32GB DDR5',
        storage: '1TB PCIe 4.0 SSD',
        display: '15.6" 3.5K OLED Touch',
        gpu: 'NVIDIA RTX 4070 8GB',
        battery: '86Wh'
      }),
      priceHistoryJson: JSON.stringify([
        { month: 'Jan', price: 1999.99 },
        { month: 'Feb', price: 1949.99 },
        { month: 'Mar', price: 1899.99 },
        { month: 'Apr', price: 1849.99 },
        { month: 'May', price: 1849.99 },
        { month: 'Jun', price: 1849.99 }
      ]),
    },
    {
      title: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      category: 'SMARTPHONE',
      price: 1299.99,
      originalPrice: 1299.99,
      rating: 4.9,
      reviewCount: 1240,
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
      sellerName: 'Samsung Direct',
      sellerRating: 4.9,
      specsJson: JSON.stringify({
        processor: 'Snapdragon 8 Gen 3 for Galaxy',
        ram: '12GB',
        storage: '512GB UFS 4.0',
        display: '6.8" QHD+ Dynamic AMOLED 2X 120Hz',
        gpu: 'Adreno 750',
        battery: '5000mAh'
      }),
      priceHistoryJson: JSON.stringify([
        { month: 'Jan', price: 1299.99 },
        { month: 'Feb', price: 1299.99 },
        { month: 'Mar', price: 1299.99 },
        { month: 'Apr', price: 1299.99 },
        { month: 'May', price: 1249.99 },
        { month: 'Jun', price: 1299.99 }
      ]),
    },
    {
      title: 'Sony WH-1000XM5 Noise Canceling',
      brand: 'Sony',
      category: 'HEADPHONES',
      price: 348.00,
      originalPrice: 398.00,
      rating: 4.8,
      reviewCount: 3105,
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
      sellerName: 'Sony Center',
      sellerRating: 4.9,
      specsJson: JSON.stringify({
        processor: 'Integrated V1 Processor',
        ram: 'N/A',
        storage: 'N/A',
        display: 'N/A',
        gpu: 'N/A',
        battery: '30 hours (ANC on)'
      }),
      priceHistoryJson: JSON.stringify([
        { month: 'Jan', price: 398.00 },
        { month: 'Feb', price: 398.00 },
        { month: 'Mar', price: 378.00 },
        { month: 'Apr', price: 348.00 },
        { month: 'May', price: 348.00 },
        { month: 'Jun', price: 348.00 }
      ]),
    }
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { title: product.title }
    });
    if (!existing) {
      await prisma.product.create({ data: product });
    }
  }

  // Seed Analytics Events
  const sampleEvents = [
    { type: 'LOGIN', metadataJson: JSON.stringify({ email: 'demo@prodiq.ai' }) },
    { type: 'SEARCH', metadataJson: JSON.stringify({ query: 'MacBook' }) },
  ];

  for (const evt of sampleEvents) {
    await prisma.analyticsEvent.create({ data: evt });
  }

  console.log('✅ Seeded Admin User, Seller Trust records, Products, and Analytics Events!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
