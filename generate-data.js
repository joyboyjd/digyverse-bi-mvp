const fs = require('fs');

const generateCSV = (filename, config) => {
    let csv = "Patient_ID,Consultation_Date,Treatment_Type,Department,Billing_Amount_INR,Acquisition_Channel,Follow_Up_Required\n";
    
    for(let i=1; i<=100; i++) {
        // Generate random date between Jan 1, 2026 and May 31, 2026
        const m = Math.floor(Math.random() * 5) + 1;
        const d = Math.floor(Math.random() * 28) + 1;
        const date = `2026-${m.toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`;
        
        // Determine if patient is Admitted (IPD) or Walk-in (OPD)
        const isIPD = Math.random() < config.ipdChance;
        const type = isIPD ? "IPD" : "OPD";
        
        // Pick Acquisition Channel (AarogyaOne is weighted to appear more frequently)
        const channel = config.channels[Math.floor(Math.random() * config.channels.length)];
        
        // Generate Realistic Billing Amount
        const billing = isIPD 
            ? Math.floor(Math.random() * (config.ipdMax - config.ipdMin) + config.ipdMin)
            : Math.floor(Math.random() * (config.opdMax - config.opdMin) + config.opdMin);
            
        const followUp = Math.random() > 0.4 ? "Yes" : "No";
        const dept = isIPD ? config.ipdDept : config.opdDept;

        csv += `PT-${1000+i},${date},${type},${dept},${billing},${channel},${followUp}\n`;
    }
    fs.writeFileSync(filename, csv);
    console.log(`✅ Generated: ${filename}`);
}

// 1. Massive Corporate Multispecialty
generateCSV("Scenario_1_Corporate_Hospital.csv", {
    ipdChance: 0.35, // 35% get admitted
    ipdMin: 55000, ipdMax: 250000,
    opdMin: 1200, opdMax: 3500,
    ipdDept: "Cardiology/Oncology", opdDept: "General Medicine",
    channels: ["AarogyaOne", "AarogyaOne", "AarogyaOne", "Google Search", "Meta Ads", "Corporate Insurance", "Direct Walk-in"]
});

// 2. Mid-Size Single Specialty (e.g. Orthopedics)
generateCSV("Scenario_2_MidSize_Specialty.csv", {
    ipdChance: 0.20, // 20% get admitted for surgery
    ipdMin: 120000, ipdMax: 350000, // High ticket surgeries
    opdMin: 1500, opdMax: 2000,
    ipdDept: "Joint Replacement", opdDept: "Physiotherapy",
    channels: ["AarogyaOne", "AarogyaOne", "Referral PRO", "Direct Walk-in", "JustDial"]
});

// 3. Single Clinic (e.g. Dermatology / Dental)
generateCSV("Scenario_3_Single_Clinic.csv", {
    ipdChance: 0.05, // Almost completely walk-in, 5% minor day-care procedures
    ipdMin: 15000, ipdMax: 30000, 
    opdMin: 600, opdMax: 1500,
    ipdDept: "Day Care Surgery", opdDept: "Consultation",
    channels: ["AarogyaOne", "Instagram Ads", "Instagram Ads", "Google Local", "Direct Walk-in"]
});