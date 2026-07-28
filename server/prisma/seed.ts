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
    { sellerName: 'Dell Enterprise Store', rating: 4.8, reviewCount: 650, deliveryReliabilityScore: 96.0, priceStabilityScore: 93.0, returnPolicyDays: 30, isVerified: true },
    { sellerName: 'Lenovo Official Store', rating: 4.8, reviewCount: 1120, deliveryReliabilityScore: 97.0, priceStabilityScore: 94.0, returnPolicyDays: 14, isVerified: true },
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

  // Seed Analytics Events for Admin Dashboard
  const sampleEvents = [
    { type: 'LOGIN', metadataJson: JSON.stringify({ email: 'demo@prodiq.ai' }) },
    { type: 'SEARCH', metadataJson: JSON.stringify({ query: 'MacBook' }) },
    { type: 'COMPARE', metadataJson: JSON.stringify({ p1: 'ASUS', p2: 'Apple' }) },
    { type: 'RECOMMENDATION', metadataJson: JSON.stringify({ winner: 'Apple MacBook Pro M3' }) },
  ];

  for (const evt of sampleEvents) {
    await prisma.analyticsEvent.create({ data: evt });
  }

  console.log('✅ Seeded Admin User, Seller Trust records, and Analytics Events!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
