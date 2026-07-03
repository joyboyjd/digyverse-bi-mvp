const fs = require('fs');

const generateCSV = (filename, config) => {
    // The exact columns our new page.tsx is looking for
    let csv = "Patient_ID,Date,Doctor_ID,Department,Visit_Type,Ward_Category,Acquisition_Channel,PRO_ID,OPD_Wait_Time_Mins,Converted_To_IPD,Length_Of_Stay_Days,Discharge_TAT_Mins,Surgery_Success,Payment_Type,TPA_Settlement_Days,Pharmacy_Revenue,Pharmacy_Prescription_Filled,Lab_Revenue,Diagnostic_Ordered,Procedure_Revenue,Revenue_Consultation\n";
    
    for(let i=1; i<=150; i++) {
        // Core Routing
        const m = Math.floor(Math.random() * 5) + 1;
        const d = Math.floor(Math.random() * 28) + 1;
        const date = `2026-${m.toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`;
        
        const isIPD = Math.random() < config.ipdChance;
        const visitType = isIPD ? "IPD" : "OPD";
        const dept = isIPD ? config.ipdDept : config.opdDept;
        const doc = config.doctors[Math.floor(Math.random() * config.doctors.length)];
        const channel = config.channels[Math.floor(Math.random() * config.channels.length)];
        const pro = Math.random() > 0.5 ? config.pros[Math.floor(Math.random() * config.pros.length)] : "";
        
        // Operations
        const waitTime = isIPD ? 0 : Math.floor(Math.random() * 45) + 10;
        const converted = (!isIPD && Math.random() < config.conversionChance) ? "Yes" : "No";
        const ward = isIPD ? config.wards[Math.floor(Math.random() * config.wards.length)] : "N/A";
        const los = isIPD ? (Math.random() * 5 + 1).toFixed(1) : 0;
        const tat = isIPD ? Math.floor(Math.random() * 120) + 30 : 0;
        const success = isIPD ? (Math.random() > 0.05 ? "Yes" : "No") : "N/A";
        
        // Financials
        const paymentType = Math.random() < config.tpaChance ? "TPA_Insurance" : "Cash";
        const tpaDays = paymentType === "TPA_Insurance" ? Math.floor(Math.random() * 60) + 15 : 0;
        
        const consultRev = isIPD ? 0 : Math.floor(Math.random() * 1000) + 500;
        const procedureRev = isIPD ? Math.floor(Math.random() * config.procedureMax) + 50000 : 0;
        
        // Leakage
        const pharmacyFilled = Math.random() < config.pharmacyChance ? "Yes" : "No";
        const pharmacyRev = pharmacyFilled === "Yes" ? Math.floor(Math.random() * 3000) + 200 : 0;
        
        const labOrdered = Math.random() < config.labChance ? "Yes" : "No";
        const labRev = labOrdered === "Yes" ? Math.floor(Math.random() * 5000) + 1000 : 0;

        csv += `PT-${1000+i},${date},${doc},${dept},${visitType},${ward},${channel},${pro},${waitTime},${converted},${los},${tat},${success},${paymentType},${tpaDays},${pharmacyRev},${pharmacyFilled},${labRev},${labOrdered},${procedureRev},${consultRev}\n`;
    }
    fs.writeFileSync(filename, csv);
    console.log(`✅ Growth Schema Data Generated: ${filename}`);
}

// 1. Corporate Hospital (High TPA, AarogyaOne Dominant, High IPD)
generateCSV("Scenario_1_Corporate_Hospital.csv", {
    ipdChance: 0.35, conversionChance: 0.15, tpaChance: 0.70,
    pharmacyChance: 0.65, labChance: 0.80, procedureMax: 350000,
    ipdDept: "Cardiology", opdDept: "General Medicine",
    doctors: ["DR_SHARMA", "DR_MEHTA", "DR_IYER"], pros: ["PRO_RAHUL", "PRO_SNEHA"],
    wards: ["ICU", "Private", "Semi-Private"],
    channels: ["AarogyaOne", "AarogyaOne", "Google Ads", "Corporate Tie-up"]
});

// 2. Mid-Size Ortho/Neuro (High Cash, Strong PRO Network)
generateCSV("Scenario_2_OrthoNeuro_Center.csv", {
    ipdChance: 0.25, conversionChance: 0.20, tpaChance: 0.40,
    pharmacyChance: 0.85, labChance: 0.90, procedureMax: 250000,
    ipdDept: "Joint Replacement", opdDept: "Physiotherapy",
    doctors: ["DR_PATEL", "DR_SINGH"], pros: ["PRO_AMIT", "PRO_VIKAS", "PRO_NEHA"],
    wards: ["Private", "General"],
    channels: ["Referral PRO", "Referral PRO", "AarogyaOne", "Direct Walk-in"]
});

// 3. Single Specialty Clinic (100% OPD, High Pharmacy Leakage)
generateCSV("Scenario_3_Dermatology_Clinic.csv", {
    ipdChance: 0.0, conversionChance: 0.0, tpaChance: 0.10,
    pharmacyChance: 0.30, labChance: 0.20, procedureMax: 0,
    ipdDept: "N/A", opdDept: "Dermatology",
    doctors: ["DR_DESAI", "DR_KAPOOR"], pros: [""],
    wards: ["N/A"],
    channels: ["Instagram Ads", "Google Local", "Direct Walk-in"]
});