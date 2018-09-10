{ZRB Acres} == "0+ to 1" ^ feeQty = 1; feeSch = "BOPFLATFEES";feeCode = "C14";branch("BoPFeeCalc01");
{ZRB Acres} == "1+ to 5" ^ feeQty = 1; feeSch = "BOPFLATFEES";feeCode = "C17";branch("BoPFeeCalc01");
{ZRB Acres} == "5+ to 10" ^ feeQty = 1; feeSch = "BOPFLATFEES";feeCode = "C18";branch("BoPFeeCalc01");
{ZRB Acres} == "10+" ^ feeQty = 1; feeSch = "BOPFLATFEES";feeCode = "C18";branch("BoPFeeCalc01");