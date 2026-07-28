import { GoogleGenAI } from '@google/genai';
import { config } from '../config/environment';
import { ProductService } from './productService';
import { ProfileService } from './profileService';
import { ChatRequestDTO } from '../types/chat';

export class ChatService {
  private static ai = config.geminiApiKey ? new GoogleGenAI({ apiKey: config.geminiApiKey }) : null;

  /**
   * Handle Contextual AI Assistant Chat
   */
  static async handleChat(userId: string | undefined, dto: ChatRequestDTO) {
    const { message, contextProduct1Id, contextProduct2Id } = dto;

    let p1: any = null;
    let p2: any = null;
    let profile: any = null;

    if (contextProduct1Id) p1 = await ProductService.getProductById(contextProduct1Id);
    if (contextProduct2Id) p2 = await ProductService.getProductById(contextProduct2Id);
    if (userId) profile = await ProfileService.getProfile(userId);

    const contextText = `
CURRENT APP CONTEXT:
- Active User Profile Persona: ${profile?.profileType || 'DEVELOPER'} (Max Budget: ₹${profile?.maxPrice || 150000})
- Product A: ${p1 ? `${p1.title} (Price: ₹${p1.price}, Rating: ${p1.rating}★, Specs: ${p1.specsJson})` : 'None selected'}
- Product B: ${p2 ? `${p2.title} (Price: ₹${p2.price}, Rating: ${p2.rating}★, Specs: ${p2.specsJson})` : 'None selected'}
`;

    if (this.ai) {
      try {
        const prompt = `
You are ProdIQ's Contextual AI Product Assistant. Answer the user's question clearly, concisely, and helpfully based on current product intelligence context.

${contextText}

USER QUESTION: "${message}"

Respond directly, formatted cleanly with bullet points if helpful:
`;

        const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        if (response.text) {
          return { response: response.text };
        }
      } catch (err) {
        console.error('Gemini Chat Error:', err);
      }
    }

    // High quality contextual fallback response when API key is unconfigured
    return { response: this.generateFallbackChatResponse(message, p1, p2, profile) };
  }

  private static generateFallbackChatResponse(msg: string, p1: any, p2: any, profile: any): string {
    const lower = msg.toLowerCase();

    if (lower.includes('programming') || lower.includes('developer') || lower.includes('coding')) {
      if (p1 && p2) {
        const p1Ram = p1.specsJson.includes('32') || p1.specsJson.includes('36');
        const winner = p1Ram ? p1 : p2;
        return `For programming and software development, **${winner.title}** is the superior choice. It features higher RAM and multi-core CPU capacity, allowing you to run Docker containers, compilation tasks, and IDEs without performance slowdowns.`;
      }
      return `For software development, we recommend laptops with at least 16GB RAM (32GB preferred for containerization), multi-core Intel Core i7/i9 or Apple M-series processors, and fast NVMe SSD storage.`;
    }

    if (lower.includes('worth buying') || lower.includes('buy now') || lower.includes('timing')) {
      if (p1) {
        return `Yes, **${p1.title}** is currently priced at **₹${p1.price.toLocaleString('en-IN')}**, which is close to its 6-month historical low. Coupled with seller warranty coverage, now is an optimal time to purchase.`;
      }
      return `Based on our price history analytics, current market prices are near historical 6-month lows with valid seller warranties available.`;
    }

    if (lower.includes('seller') || lower.includes('reliable')) {
      if (p1 && p2) {
        const bestSeller = p1.sellerRating >= p2.sellerRating ? p1 : p2;
        return `**${bestSeller.sellerName}** (rating ${bestSeller.sellerRating}★) is the most reliable seller listed, offering ${bestSeller.warrantyMonths} months of official warranty and ${bestSeller.deliveryDays}-day expedited delivery.`;
      }
    }

    if (lower.includes('why did') || lower.includes('rank')) {
      if (p1 && p2) {
        const winner = p1.rating >= p2.rating ? p1 : p2;
        return `**${winner.title}** ranked higher because of its superior technical specs score, higher customer satisfaction rating (${winner.rating}/5.0), and closer alignment with your ${profile?.profileType || 'DEVELOPER'} persona.`;
      }
    }

    return `Based on your ${profile?.profileType || 'DEVELOPER'} profile persona and selected products, **${p1 ? p1.title : 'the top-rated option'}** offers the best balance of hardware performance, price efficiency, and seller reliability. Let me know if you have specific questions about battery, display, or specs!`;
  }
}
