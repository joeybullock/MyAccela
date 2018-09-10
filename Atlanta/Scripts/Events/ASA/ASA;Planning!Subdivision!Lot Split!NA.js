{Infrastructure} == "Exists" ^ feeQty = 1; feeSch = "BOPFLATFEES";feeCode = "C04";branch("BoPFeeCalc01")
{Infrastructure} == "Required" && {Size in Acres} != "10+" ^ feeQty = 1; feeSch = "BOPFLATFEES";feeCode = "C04";branch("BoPFeeCalc01")
{Infrastructure} == "Required" && {Size in Acres} == "10+" ^ feeQty = 1; feeSch = "BOPFLATFEES";feeCode = "C09";branch("BoPFeeCalc01")