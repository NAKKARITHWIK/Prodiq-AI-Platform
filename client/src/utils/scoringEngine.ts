import { Product, ProductSpecs, UserPreference } from '../types';

export interface ScoreBreakdown {
  overallScore: number;
  ratingScore: number;
  priceScore: number;
  specsScore: number;
  personaBonus: number;
  explanations: string[];
}

export function calculateDeterministicValueScore(
  product: Product,
  preference?: UserPreference | null
): ScoreBreakdown {
  const specs: ProductSpecs = JSON.parse(product.specsJson || '{}');
  const explanations: string[] = [];

  // 1. Rating Score (Max 25 pts)
  // Rating 5.0 = 25 pts, 4.0 = 20 pts
  const ratingScore = Math.min(25, Math.round((product.rating / 5.0) * 25));
  explanations.push(`Customer Rating (${product.rating}/5.0): +${ratingScore} pts`);

  // 2. Price & Value Score (Max 35 pts)
  // Calculates price efficiency relative to original price discount & user max budget
  const discount = product.originalPrice > product.price ? ((product.originalPrice - product.price) / product.originalPrice) * 100 : 0;
  const discountBonus = Math.min(10, Math.round((discount / 30) * 10)); // Up to 10 pts for discounts

  const maxBudget = preference?.maxPrice || 150000;
  const budgetRatio = Math.max(0, 1 - product.price / maxBudget);
  const budgetScore = Math.min(25, Math.round(budgetRatio * 25));

  const priceScore = Math.min(35, budgetScore + discountBonus);
  explanations.push(`Price Value (₹${product.price.toLocaleString('en-IN')}, ${discount.toFixed(0)}% Off): +${priceScore} pts`);

  // 3. Technical Specs Score (Max 30 pts)
  let specsScore = 15; // Base specs score

  // RAM bonus
  const ramMatch = specs.ram?.match(/(\d+)\s*GB/i);
  if (ramMatch) {
    const ramGb = parseInt(ramMatch[1], 10);
    if (ramGb >= 32) specsScore += 5;
    else if (ramGb >= 16) specsScore += 3;
  }

  // Processor / Display bonus
  if (specs.processor?.includes('M3') || specs.processor?.includes('Ultra 9') || specs.processor?.includes('i7')) {
    specsScore += 5;
  }
  if (specs.display?.includes('OLED') || specs.display?.includes('4K') || specs.display?.includes('120Hz')) {
    specsScore += 5;
  }
  specsScore = Math.min(30, specsScore);
  explanations.push(`Hardware Specs Tier (${specs.processor || 'Standard'}): +${specsScore} pts`);

  // 4. User Persona Match Bonus (Max 10 pts)
  let personaBonus = 0;
  const profileType = preference?.profileType || 'DEVELOPER';

  if (profileType === 'DEVELOPER') {
    if (specs.ram?.includes('32') || specs.ram?.includes('36')) personaBonus += 5;
    if (specs.processor?.includes('Ultra') || specs.processor?.includes('M3') || specs.processor?.includes('i7')) personaBonus += 5;
    if (personaBonus > 0) explanations.push(`Developer Persona Bonus (High RAM/CPU): +${personaBonus} pts`);
  } else if (profileType === 'GAMER') {
    if (specs.gpu?.includes('RTX') || specs.display?.includes('240Hz')) personaBonus += 10;
    if (personaBonus > 0) explanations.push(`Gamer Persona Bonus (Discrete GPU & High Refresh Rate): +${personaBonus} pts`);
  } else if (profileType === 'STUDENT') {
    if (parseFloat(specs.weight || '2.0') < 1.5 || specs.battery?.includes('hrs')) personaBonus += 10;
    if (personaBonus > 0) explanations.push(`Student Persona Bonus (Ultraportable & Long Battery): +${personaBonus} pts`);
  } else if (profileType === 'BUDGET') {
    if (product.price <= (preference?.maxPrice || 100000)) personaBonus += 10;
    if (personaBonus > 0) explanations.push(`Budget Persona Bonus (Within Target Price Limit): +${personaBonus} pts`);
  }

  const overallScore = Math.min(100, ratingScore + priceScore + specsScore + personaBonus);

  return {
    overallScore,
    ratingScore,
    priceScore,
    specsScore,
    personaBonus,
    explanations,
  };
}
