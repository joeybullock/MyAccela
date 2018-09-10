{CDP Required} == "Yes" ^ feeQty = 1; feeSch = "BOPZRBCDP";feeCode = "CDP";branch("BoPFeeCalc01")
matches({Proposed Zoning}.substr(0,3),"R-1","R-2","R-2A","R-3","R-3A","R-4","R-4A","R-4B") ^ feeCode = "C06";feeSch = "BOPFLATFEES";feeQty = 1;branch("BoPFeeCalc01");
matches({Proposed Zoning}.substr(0,4),"RG-1","RG-2","RG-3","RG-4","RG-5","RG-6") ^ branch("BoPRezoningAcres01");
matches({Proposed Zoning}.substr(0,4),"MR-1","MR-2","MR-3","MR-4","MR-5","MR-6","MR-7","MR-8") ^ branch("BoPRezoningAcres01");
matches({Proposed Zoning}.substr(0,4),"PD-H") ^ branch("BoPRezoningAcres01");
matches({Proposed Zoning}.substr(0,3),"O-I","I-1","I-2") ^ branch("BoPRezoningAcres02");
matches({Proposed Zoning}.substr(0,3),"C-1","C-2","C-4","C-5") ^ branch("BoPRezoningAcres02");
matches({Proposed Zoning}.substr(0,3),"C-3","LW") ^ branch("BoPRezoningAcres03");
matches({Proposed Zoning}.substr(0,5),"MRC-1","MRC-2","MRC-3") ^ branch("BoPRezoningAcres03");
matches({Proposed Zoning}.substr(0,5),"PD-OC","PD-MU","PD-BP") ^ branch("BoPRezoningAcres03");
matches({Proposed Zoning}.substr(0,3),"R-5") ^ branch("BoPRezoningAcres01");
matches({Proposed Zoning}.substr(0,4),"R-LC") ^ branch("BoPRezoningAcres02");
matches({Proposed Zoning}.substr(0,4),"LW-C") ^ branch("BoPRezoningAcres03");
matches({Proposed Zoning}.substr(0,3),"SPI") ^ addFee("C14","BOPFLATFEES", "FINAL", 1 , "Y");
matches({Proposed Zoning}.substr(0,2),"NC") ^ branch("BoPRezoningAcres03");