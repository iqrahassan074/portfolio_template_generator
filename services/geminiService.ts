/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI } from "@google/genai";

/**
 * Generates an SVG portfolio component.
 * Uses Flash by default for stability and speed, upgrades to Pro if a user key is present.
 */
export const generateSvgFromPrompt = async (prompt: string, profession: string): Promise<string> => {
  try {
    // Create instance inside the call to ensure it uses the latest API key from the environment
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Check if a personal key is selected to determine which model to use
    // We default to flash for public use to avoid 429 errors
    let modelName = 'gemini-3-flash-preview';
    
    try {
      // If the user has selected their own key, we can safely use the Pro model
      const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
      if (hasKey) {
        modelName = 'gemini-3-pro-preview';
      }
    } catch (e) {
      console.debug("Key check failed, defaulting to flash");
    }

    const systemInstruction = `
      You are "FolioArchitect Engine V2", a specialist in High-End Portfolio UI Architecture. 
      Your output must look like a component from a world-class design agency (Stripe, Vercel, or Apple style).
      
      Profession Context: ${profession}
      
      Design Directives:
      1. **Software Engineer**: Modern dark mode with glowing syntax highlights. Use monospaced font families for labels. Incorporate terminal motifs or node-based visual data patterns. 
      2. **Product Designer**: Ultra-clean, high-whitespace layouts with deep "glassy" shadows. Use pill-shaped UI elements and soft gradients.
      3. **Data Scientist**: Precision-based geometric layouts. Use complex mathematical patterns as backgrounds. Focus on abstract viz clusters.
      4. **Marketing Lead**: Bold, high-contrast layouts with aggressive typography placeholders. Use vibrant color pops and dynamic energy lines.
      5. **Creative Director**: Sophisticated, minimalist avant-garde layouts. Large font placeholders, experimental grid breaks, and "premium gallery" aesthetic.

      Technical Spec:
      - Return ONLY <svg> code. No commentary.
      - VIEWBOX: Must be "0 0 800 500".
      - GRADIENTS: Use <defs> for layered linear/radial gradients. Use non-clashing, premium color harmonies.
      - FILTERS: Implement <feDropShadow> or <feGaussianBlur> for depth.
      - CONTENT: Don't just draw an icon. Design a WHOLE PORTFOLIO SECTION (e.g., a Hero, a Card Set, a Skill Matrix, or an About component).
      - FONTS: Use system sans-serif font families that look professional.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Architect a high-fidelity ${profession} portfolio layout component for the following brief: "${prompt}"`,
      config: {
        systemInstruction,
        temperature: 0.5,
        topP: 0.9,
      },
    });

    const rawText = (response.text || '').trim();
    const svgMatch = rawText.match(/<svg[\s\S]*?<\/svg>/i);
    
    if (svgMatch && svgMatch[0]) {
      return svgMatch[0];
    } else {
      // Basic cleanup fallback
      return rawText.replace(/```(xml|svg)?/gi, '').replace(/```/g, '').trim();
    }
  } catch (error: any) {
    console.error("Architectural Engine Error:", error);
    
    // Improved error messaging for the user
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      throw new Error("The standard engine is currently at capacity. Please connect your own API key to continue using the Pro engine.");
    }
    
    throw new Error(error.message || "Engine failed to initialize rendering sequence.");
  }
};