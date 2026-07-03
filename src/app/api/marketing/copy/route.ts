import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { strategy, liveKpis } = body;

    // ==========================================
    // OPTION B - PROMPT 2: THE P.A.S. COPYWRITER
    // ==========================================
    const systemPrompt = `
      You are an elite, empathetic healthcare copywriter. 
      I will provide you with a selected STRATEGY ANGLE and the facility's LIVE OPERATIONAL KPIS.
      
      Your mission: Write a high-converting social media post using the P.A.S. (Problem, Agitate, Solution) framework.
      
      RULES:
      - [PROBLEM]: Identify the exact pain point of the target patient.
      - [AGITATE]: Highlight the emotional cost of ignoring this pain.
      - [SOLUTION]: Position our facility as the exact remedy, explicitly mentioning one of our strong KPIs to prove it.
      - The tone must be authoritative but deeply empathetic. NO complex medical jargon.
      - End with a strong Call-To-Action (CTA).
    `;

    console.log("Claude Prompt injected for strategy:", strategy.title);

    // Note: In production, we send this to Anthropic API here.
    const mockClaudeResponse = `[PROBLEM]
Living with chronic joint pain doesn't just limit your movement—it drains your energy and keeps you from the moments that matter most.

[AGITATE]
Many patients delay seeking help because they fear complicated procedures or long recovery times, settling for temporary fixes while the underlying issue worsens.

[SOLUTION]
It doesn't have to be this way. At our ${liveKpis.topDept} center of excellence, we maintain a ${liveKpis.successRate} complication-free surgery record. Our advanced IPD facilities ensure you get back on your feet faster, with complete peace of mind.

👉 Stop waiting. Book your priority consultation today and take the first step toward a pain-free life.`;

    return NextResponse.json({ copy: mockClaudeResponse });
  } catch (error) {
    return NextResponse.json({ error: "Failed to draft copy" }, { status: 500 });
  }
}