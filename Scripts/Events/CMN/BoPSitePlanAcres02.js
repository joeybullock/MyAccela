{ZRB Acres} == "0+ to 1" ^ feeQty = 1; feeSch = "BOPFLATFEES";feeCode = "C09";branch("BoPFeeCalc01");
{ZRB Acres} == "1+ to 5" ^ feeQty = 1; feeSch = "BOPFLATFEES";feeCode = "C11";branch("BoPFeeCalc01");
{ZRB Acres} == "5+ to 10" ^ feeQty = 1; feeSch = "BOPFLATFEES";feeCode = "C12";branch("BoPFeeCalc01");
{ZRB Acres} == "10+" ^ feeQty = 1; feeSch = "BOPFLATFEES";feeCode = "C13";branch("BoPFeeCalc01");