import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_request, live_kpis } = body.masterContextJSON;
    
    // Extract the typed goal, with a fallback if empty
    const goal = user_request?.goal || "drive general growth";
    const topDept = live_kpis?.topDept || "Cardiology";
    const successRate = live_kpis?.successRate || "100%";

    // A rich mock pool that dynamically weaves in the user's exact typed goal
    const strategyPool = [
      {
        title: `The '${topDept} Authority' Campaign`,
        rationale: `Directly targets your goal to "${goal}" by highlighting the high-volume expertise of your ${topDept} department to build brand dominance.`
      },
      {
        title: "The 'Peace of Mind' Angle",
        rationale: `Leverages the ${successRate} Surgery Success rate to neutralize patient hesitation, providing a clear path to achieve: "${goal}".`
      },
      {
        title: "The 'Priority Care' Push",
        rationale: `Instead of direct selling, this tackles your directive ("${goal}") by promoting fast-track diagnostics for high-intent walk-ins.`
      },
      {
        title: "The 'Invisible Cost' Hook",
        rationale: `Focuses on the emotional and physical cost of delaying ${topDept} treatment, driving the immediate urgency needed to ${goal}.`
      },
      {
        title: "The 'Premium Facility' Appeal",
        rationale: `Showcases your advanced IPD infrastructure to attract high-margin, insurance-backed (TPA) patients, perfectly aligning with your objective to ${goal}.`
      },
      {
        title: "The 'Community Trust' Spotlight",
        rationale: `Positions your top-performing doctors as local healthcare heroes, leveraging organic word-of-mouth to organically ${goal}.`
      }
    ];

    // Shuffle array and return 3 random strategies to simulate dynamic AI ideation
    const shuffled = strategyPool.sort(() => 0.5 - Math.random());
    const selectedStrategies = shuffled.slice(0, 3);

    // Add a slight artificial delay so the UI loading state feels like real AI processing
    await new Promise((resolve) => setTimeout(resolve, 1200));

    return NextResponse.json({ strategies: selectedStrategies }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to generate strategy" }, { status: 500 });
  }
}