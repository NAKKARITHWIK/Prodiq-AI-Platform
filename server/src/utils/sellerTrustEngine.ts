export interface SellerTrustBreakdown {
  trustScore: number;
  ratingScore: number;
  reviewVolumeScore: number;
  deliveryScore: number;
  priceStabilityScore: number;
  returnPolicyScore: number;
  verificationBonus: number;
  trustTier: 'EXCELLENT' | 'HIGH' | 'MODERATE' | 'BASIC';
  explanation: string;
}

export function calculateSellerTrustScore(seller: {
  rating: number;
  reviewCount: number;
  deliveryReliabilityScore?: number;
  priceStabilityScore?: number;
  returnPolicyDays?: number;
  isVerified?: boolean;
}): SellerTrustBreakdown {
  // 1. Rating Factor (30 pts max): 5.0 stars = 30 pts
  const ratingScore = Math.min(30, Math.round((seller.rating / 5.0) * 30));

  // 2. Review Volume Factor (20 pts max): >1000 reviews = 20 pts
  const count = seller.reviewCount || 100;
  const reviewVolumeScore = Math.min(20, Math.round((Math.log10(count + 1) / 3.5) * 20));

  // 3. Delivery Reliability Factor (25 pts max)
  const deliveryRel = seller.deliveryReliabilityScore ?? 95.0;
  const deliveryScore = Math.min(25, Math.round((deliveryRel / 100) * 25));

  // 4. Price Stability Factor (15 pts max)
  const priceStab = seller.priceStabilityScore ?? 90.0;
  const priceStabilityScore = Math.min(15, Math.round((priceStab / 100) * 15));

  // 5. Return Policy & Guarantee (10 pts max)
  const returnDays = seller.returnPolicyDays ?? 14;
  const returnPolicyScore = Math.min(10, Math.round((returnDays / 30) * 10));

  // Verification Bonus (+5 pts)
  const verificationBonus = seller.isVerified ? 5 : 0;

  const trustScore = Math.min(100, ratingScore + reviewVolumeScore + deliveryScore + priceStabilityScore + returnPolicyScore + verificationBonus);

  let trustTier: 'EXCELLENT' | 'HIGH' | 'MODERATE' | 'BASIC' = 'HIGH';
  if (trustScore >= 92) trustTier = 'EXCELLENT';
  else if (trustScore >= 80) trustTier = 'HIGH';
  else if (trustScore >= 65) trustTier = 'MODERATE';
  else trustTier = 'BASIC';

  const explanation = `Seller Trust Score is ${trustScore}/100 (${trustTier}). Based on ${seller.rating}★ customer rating (${ratingScore}/30), ${count}+ verified sales (${reviewVolumeScore}/20), ${deliveryRel}% delivery reliability (${deliveryScore}/25), and ${returnDays}-day return protection.`;

  return {
    trustScore,
    ratingScore,
    reviewVolumeScore,
    deliveryScore,
    priceStabilityScore,
    returnPolicyScore,
    verificationBonus,
    trustTier,
    explanation,
  };
}
