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
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 1799.99 }, { month: 'Feb', price: 1799.99 }, { month: 'Mar', price: 1749.99 }, { month: 'Apr', price: 1699.99 }, { month: 'May', price: 1599.99 }, { month: 'Jun', price: 1599.99 } ]),
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
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 1999.00 }, { month: 'Feb', price: 1999.00 }, { month: 'Mar', price: 1999.00 }, { month: 'Apr', price: 1999.00 }, { month: 'May', price: 1999.00 }, { month: 'Jun', price: 1999.00 } ]),
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
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 1999.99 }, { month: 'Feb', price: 1949.99 }, { month: 'Mar', price: 1899.99 }, { month: 'Apr', price: 1849.99 }, { month: 'May', price: 1849.99 }, { month: 'Jun', price: 1849.99 } ]),
    },

    // ---------------- SMARTPHONES (3) ----------------
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
        processor: 'Snapdragon 8 Gen 3',
        ram: '12GB',
        storage: '512GB UFS 4.0',
        display: '6.8" QHD+ AMOLED 120Hz',
        gpu: 'Adreno 750',
        battery: '5000mAh'
      }),
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 1299.99 }, { month: 'Feb', price: 1299.99 }, { month: 'Mar', price: 1299.99 }, { month: 'Apr', price: 1299.99 }, { month: 'May', price: 1249.99 }, { month: 'Jun', price: 1299.99 } ]),
    },
    {
      title: 'Apple iPhone 15 Pro Max',
      brand: 'Apple',
      category: 'SMARTPHONE',
      price: 1199.00,
      originalPrice: 1199.00,
      rating: 4.8,
      reviewCount: 2150,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20a5bf616f?w=800&q=80',
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
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 1199.00 }, { month: 'Feb', price: 1199.00 }, { month: 'Mar', price: 1199.00 }, { month: 'Apr', price: 1199.00 }, { month: 'May', price: 1199.00 }, { month: 'Jun', price: 1199.00 } ]),
    },
    {
      title: 'Google Pixel 8 Pro',
      brand: 'Google',
      category: 'SMARTPHONE',
      price: 899.00,
      originalPrice: 999.00,
      rating: 4.7,
      reviewCount: 980,
      image: 'https://images.unsplash.com/photo-1615822346618-1c4b7528e573?w=800&q=80',
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
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 999.00 }, { month: 'Feb', price: 949.00 }, { month: 'Mar', price: 949.00 }, { month: 'Apr', price: 899.00 }, { month: 'May', price: 899.00 }, { month: 'Jun', price: 899.00 } ]),
    },

    // ---------------- MONITORS (2) ----------------
    {
      title: 'LG 27" UltraGear OLED Gaming Monitor',
      brand: 'LG',
      category: 'MONITOR',
      price: 899.99,
      originalPrice: 999.99,
      rating: 4.8,
      reviewCount: 412,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
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
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 999.99 }, { month: 'Feb', price: 999.99 }, { month: 'Mar', price: 949.99 }, { month: 'Apr', price: 949.99 }, { month: 'May', price: 899.99 }, { month: 'Jun', price: 899.99 } ]),
    },
    {
      title: 'Dell UltraSharp 32" 4K USB-C Hub Monitor',
      brand: 'Dell',
      category: 'MONITOR',
      price: 799.00,
      originalPrice: 859.00,
      rating: 4.7,
      reviewCount: 320,
      image: 'https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=800&q=80',
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
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 859.00 }, { month: 'Feb', price: 859.00 }, { month: 'Mar', price: 829.00 }, { month: 'Apr', price: 799.00 }, { month: 'May', price: 799.00 }, { month: 'Jun', price: 799.00 } ]),
    },

    // ---------------- HEADPHONES (3) ----------------
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
        type: 'Over-Ear',
        noiseCanceling: 'Industry Leading ANC',
        batteryLife: '30 hours',
        microphone: '8 mics for calls',
        connectivity: 'Bluetooth 5.2',
        weight: '250g'
      }),
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 398.00 }, { month: 'Feb', price: 398.00 }, { month: 'Mar', price: 378.00 }, { month: 'Apr', price: 348.00 }, { month: 'May', price: 348.00 }, { month: 'Jun', price: 348.00 } ]),
    },
    {
      title: 'Bose QuietComfort Ultra Headphones',
      brand: 'Bose',
      category: 'HEADPHONES',
      price: 429.00,
      originalPrice: 429.00,
      rating: 4.7,
      reviewCount: 890,
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
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
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 429.00 }, { month: 'Feb', price: 429.00 }, { month: 'Mar', price: 429.00 }, { month: 'Apr', price: 429.00 }, { month: 'May', price: 429.00 }, { month: 'Jun', price: 429.00 } ]),
    },
    {
      title: 'Sennheiser Momentum 4 Wireless',
      brand: 'Sennheiser',
      category: 'HEADPHONES',
      price: 299.95,
      originalPrice: 349.95,
      rating: 4.6,
      reviewCount: 650,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
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
      priceHistoryJson: JSON.stringify([ { month: 'Jan', price: 349.95 }, { month: 'Feb', price: 349.95 }, { month: 'Mar', price: 329.95 }, { month: 'Apr', price: 299.95 }, { month: 'May', price: 299.95 }, { month: 'Jun', price: 299.95 } ]),
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
