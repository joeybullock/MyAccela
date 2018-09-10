{Replat Type} == "Residential" ^ feeQty = {Number of Lots}; feeSch = "BOP_RPLT_CON";feeCode = "BOPRESRPLT";branch("BoPFeeCalc01")
{Replat Type} == "Non-residential" ^ feeQty = {Number of Lots}; feeSch = "BOP_RPLT_CON";feeCode = "BOPNRESRPLT";branch("BoPFeeCalc01")
{Replat Type} == "NA" ^ feeQty = {Number of Lots}; feeSch = "BOP_RPLT_CON";feeCode = "BOPRESRPLT";branch("BoPFeeCalc01")