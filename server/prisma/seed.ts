import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ProdIQ Phase 6 Database Seeding (Amazon Product Images)...');

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
    { sellerName: 'Google Store', rating: 4.8, reviewCount: 1650, deliveryReliabilityScore: 96.5, priceStabilityScore: 94.5, returnPolicyDays: 14, isVerified: true },
    { sellerName: 'LG Official', rating: 4.7, reviewCount: 920, deliveryReliabilityScore: 95.0, priceStabilityScore: 93.0, returnPolicyDays: 14, isVerified: true },
    { sellerName: 'Bose Direct', rating: 4.9, reviewCount: 2100, deliveryReliabilityScore: 98.5, priceStabilityScore: 97.0, returnPolicyDays: 30, isVerified: true },
    { sellerName: 'Sennheiser Pro', rating: 4.8, reviewCount: 840, deliveryReliabilityScore: 96.0, priceStabilityScore: 95.0, returnPolicyDays: 14, isVerified: true },
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
    // ---------------- LAPTOPS (3) ----------------
    {
      title: 'ASUS ROG Zephyrus G14 (2024)',
      brand: 'ASUS',
      category: 'LAPTOP',
      price: 154990,
      originalPrice: 174990,
      rating: 4.8,
      reviewCount: 342,
      image: 'https://m.media-amazon.com/images/I/71c5W9NxN5L._SX679_.jpg',
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
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 174990 }, { month: 'Feb', price: 174990 }, { month: 'Mar', price: 164990 }, { month: 'Apr', price: 159990 }, { month: 'May', price: 154990 }, { month: 'Jun', price: 154990 } ]),
    },
    {
      title: 'Apple MacBook Pro 14" M3 Pro',
      brand: 'Apple',
      category: 'LAPTOP',
      price: 199900,
      originalPrice: 199900,
      rating: 4.9,
      reviewCount: 890,
      image: 'https://m.media-amazon.com/images/I/618d5bS2lUL._SX679_.jpg',
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
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 199900 }, { month: 'Feb', price: 199900 }, { month: 'Mar', price: 199900 }, { month: 'Apr', price: 199900 }, { month: 'May', price: 199900 }, { month: 'Jun', price: 199900 } ]),
    },
    {
      title: 'Dell XPS 15 (2024)',
      brand: 'Dell',
      category: 'LAPTOP',
      price: 184990,
      originalPrice: 199990,
      rating: 4.6,
      reviewCount: 412,
      image: 'https://m.media-amazon.com/images/I/715QeQ1Y1lL._SX679_.jpg',
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
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 199990 }, { month: 'Feb', price: 194990 }, { month: 'Mar', price: 189990 }, { month: 'Apr', price: 184990 }, { month: 'May', price: 184990 }, { month: 'Jun', price: 184990 } ]),
    },

    // ---------------- SMARTPHONES (3) ----------------
    {
      title: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      category: 'SMARTPHONE',
      price: 129999,
      originalPrice: 134999,
      rating: 4.9,
      reviewCount: 1240,
      image: 'https://m.media-amazon.com/images/I/71WXxE1G2vL._SX679_.jpg',
      sellerName: 'Samsung Direct',
      sellerRating: 4.9,
      specsJson: JSON.stringify({
        processor: 'Snapdragon 8 Gen 3',
        ram: '12GB',
        storage: '512GB UFS 4.0',
        display: '6.8" QHD+ AMOLED 120Hz',
        gpu: 'Adreno 750',
        battery: '5000mAh'
      }),
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 134999 }, { month: 'Feb', price: 134999 }, { month: 'Mar', price: 129999 }, { month: 'Apr', price: 129999 }, { month: 'May', price: 124999 }, { month: 'Jun', price: 129999 } ]),
    },
    {
      title: 'Apple iPhone 15 Pro Max',
      brand: 'Apple',
      category: 'SMARTPHONE',
      price: 159900,
      originalPrice: 159900,
      rating: 4.8,
      reviewCount: 2150,
      image: 'https://m.media-amazon.com/images/I/81Os1SDWpcL._SX679_.jpg',
      sellerName: 'Apple Store Official',
      sellerRating: 5.0,
      specsJson: JSON.stringify({
        processor: 'A17 Pro',
        ram: '8GB',
        storage: '256GB NVMe',
        display: '6.7" Super Retina XDR OLED 120Hz',
        gpu: '6-core Apple GPU',
        battery: '4422mAh'
      }),
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 159900 }, { month: 'Feb', price: 159900 }, { month: 'Mar', price: 159900 }, { month: 'Apr', price: 159900 }, { month: 'May', price: 159900 }, { month: 'Jun', price: 159900 } ]),
    },
    {
      title: 'Google Pixel 8 Pro',
      brand: 'Google',
      category: 'SMARTPHONE',
      price: 98999,
      originalPrice: 106999,
      rating: 4.7,
      reviewCount: 980,
      image: 'https://m.media-amazon.com/images/I/718yG7UqK0L._SX679_.jpg',
      sellerName: 'Google Store',
      sellerRating: 4.8,
      specsJson: JSON.stringify({
        processor: 'Google Tensor G3',
        ram: '12GB',
        storage: '256GB UFS 3.1',
        display: '6.7" LTPO OLED 120Hz',
        gpu: 'Immortalis-G715s MC10',
        battery: '5050mAh'
      }),
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 106999 }, { month: 'Feb', price: 106999 }, { month: 'Mar', price: 98999 }, { month: 'Apr', price: 98999 }, { month: 'May', price: 89999 }, { month: 'Jun', price: 98999 } ]),
    },

    // ---------------- MONITORS (2) ----------------
    {
      title: 'LG 27" UltraGear OLED Gaming Monitor',
      brand: 'LG',
      category: 'MONITOR',
      price: 75000,
      originalPrice: 85000,
      rating: 4.8,
      reviewCount: 412,
      image: 'https://m.media-amazon.com/images/I/71f-CttjE-L._SX679_.jpg',
      sellerName: 'LG Official',
      sellerRating: 4.7,
      specsJson: JSON.stringify({
        resolution: '2560 x 1440 (QHD)',
        refreshRate: '240Hz',
        panelType: 'OLED',
        responseTime: '0.03ms (GtG)',
        hdr: 'HDR10',
        ports: '2x HDMI 2.1, 1x DisplayPort 1.4'
      }),
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 85000 }, { month: 'Feb', price: 85000 }, { month: 'Mar', price: 79990 }, { month: 'Apr', price: 79990 }, { month: 'May', price: 75000 }, { month: 'Jun', price: 75000 } ]),
    },
    {
      title: 'Dell UltraSharp 32" 4K USB-C Hub Monitor',
      brand: 'Dell',
      category: 'MONITOR',
      price: 65900,
      originalPrice: 72000,
      rating: 4.7,
      reviewCount: 320,
      image: 'https://m.media-amazon.com/images/I/81I5%2BYq8VKL._SX679_.jpg',
      sellerName: 'Dell Premier Partner',
      sellerRating: 4.7,
      specsJson: JSON.stringify({
        resolution: '3840 x 2160 (4K)',
        refreshRate: '60Hz',
        panelType: 'IPS Black',
        responseTime: '5ms',
        hdr: 'VESA DisplayHDR 400',
        ports: '1x HDMI 2.0, 1x DP 1.4, USB-C (90W PD)'
      }),
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 72000 }, { month: 'Feb', price: 72000 }, { month: 'Mar', price: 68000 }, { month: 'Apr', price: 65900 }, { month: 'May', price: 65900 }, { month: 'Jun', price: 65900 } ]),
    },

    // ---------------- HEADPHONES (3) ----------------
    {
      title: 'Sony WH-1000XM5 Noise Canceling',
      brand: 'Sony',
      category: 'HEADPHONES',
      price: 29990,
      originalPrice: 34990,
      rating: 4.8,
      reviewCount: 3105,
      image: 'https://m.media-amazon.com/images/I/51aXvjzcukL._SX679_.jpg',
      sellerName: 'Sony Center',
      sellerRating: 4.9,
      specsJson: JSON.stringify({
        type: 'Over-Ear',
        noiseCanceling: 'Industry Leading ANC',
        batteryLife: '30 hours',
        microphone: '8 mics for calls',
        connectivity: 'Bluetooth 5.2',
        weight: '250g'
      }),
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 34990 }, { month: 'Feb', price: 34990 }, { month: 'Mar', price: 32990 }, { month: 'Apr', price: 29990 }, { month: 'May', price: 29990 }, { month: 'Jun', price: 29990 } ]),
    },
    {
      title: 'Bose QuietComfort Ultra Headphones',
      brand: 'Bose',
      category: 'HEADPHONES',
      price: 35900,
      originalPrice: 35900,
      rating: 4.7,
      reviewCount: 890,
      image: 'https://m.media-amazon.com/images/I/51b2q7oA-lL._SX679_.jpg',
      sellerName: 'Bose Direct',
      sellerRating: 4.9,
      specsJson: JSON.stringify({
        type: 'Over-Ear',
        noiseCanceling: 'CustomTune ANC',
        batteryLife: '24 hours',
        microphone: 'Advanced mic system',
        connectivity: 'Bluetooth 5.3',
        weight: '253g'
      }),
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 35900 }, { month: 'Feb', price: 35900 }, { month: 'Mar', price: 35900 }, { month: 'Apr', price: 35900 }, { month: 'May', price: 35900 }, { month: 'Jun', price: 35900 } ]),
    },
    {
      title: 'Sennheiser Momentum 4 Wireless',
      brand: 'Sennheiser',
      category: 'HEADPHONES',
      price: 24990,
      originalPrice: 34990,
      rating: 4.6,
      reviewCount: 650,
      image: 'https://m.media-amazon.com/images/I/61r590h00dL._SX679_.jpg',
      sellerName: 'Sennheiser Pro',
      sellerRating: 4.8,
      specsJson: JSON.stringify({
        type: 'Over-Ear',
        noiseCanceling: 'Adaptive ANC',
        batteryLife: '60 hours',
        microphone: '2x2 beamforming mics',
        connectivity: 'Bluetooth 5.2',
        weight: '293g'
      }),
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 34990 }, { month: 'Feb', price: 34990 }, { month: 'Mar', price: 29990 }, { month: 'Apr', price: 24990 }, { month: 'May', price: 24990 }, { month: 'Jun', price: 24990 } ]),
    }
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { title: product.title }
    });
    if (!existing) {
      await prisma.product.create({ data: product });
    } else {
      await prisma.product.update({
        where: { id: existing.id },
        data: product
      });
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
