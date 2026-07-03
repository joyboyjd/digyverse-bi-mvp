import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { masterContextJSON } = body;
    const topDept = masterContextJSON.live_kpis.topDept || "Cardiology";
    const successRate = masterContextJSON.live_kpis.successRate || "100%";

    // In a production environment, this goes to OpenAI. 
    // Here we use a rich mock pool to simulate dynamic generation for the "Regenerate/More" buttons.
    const strategyPool = [
      {
        title: "The 'Peace of Mind' Angle",
        rationale: `Leverages the ${successRate} Surgery Success rate to convert hesitant ${topDept} walk-ins into scheduled admissions.`
      },
      {
        title: "The 'Priority Care' Push",
        rationale: `Targets the massive gap between OPD visits and admissions by promoting fast-track diagnostics for high-intent patients.`
      },
      {
        title: "The 'Expert Authority' Campaign",
        rationale: `Highlights the high-volume expertise of your ${topDept} department to build brand dominance in the local market.`
      },
      {
        title: "The 'Invisible Cost' Hook",
        rationale: `Focuses on the emotional and physical cost of delaying ${topDept} treatment, driving immediate urgency to book.`
      },
      {
        title: "The 'Premium Facility' Appeal",
        rationale: `Showcases your advanced IPD infrastructure to attract high-margin, insurance-backed (TPA) patients.`
      },
      {
        title: "The 'Community Trust' Spotlight",
        rationale: `Positions your top-performing doctors as local healthcare heroes, leveraging organic word-of-mouth.`
      }
    ];

    // Shuffle array and return 3 random strategies to simulate dynamic AI ideation
    const shuffled = strategyPool.sort(() => 0.5 - Math.random());
    const selectedStrategies = shuffled.slice(0, 3);

    return NextResponse.json({ strategies: selectedStrategies });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate strategy" }, { status: 500 });
  }
}