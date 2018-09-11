{ZRB Acres} == "0+ to 1" ^ feeQty = 1; feeSch = "BOPFLATFEES";feeCode = "C06";branch("BoPFeeCalc01");
{ZRB Acres} == "1+ to 5" ^ feeQty = 1; feeSch = "BOPFLATFEES";feeCode = "C07";branch("BoPFeeCalc01");
{ZRB Acres} == "5+ to 10" ^ feeQty = 1; feeSch = "BOPFLATFEES";feeCode = "C08";branch("BoPFeeCalc01");
{ZRB Acres} == "10+" ^ feeQty = 1; feeSch = "BOPFLATFEES";feeCode = "C10";branch("BoPFeeCalc01");