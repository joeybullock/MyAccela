true ^ showDebug = false; showMessage = false;
{ORI Number of Stories} <= 2 && {ORI Number of Units} <= 12 ^ feeQty = 1; feeSch = "BOCORI";feeCode = "ORIINSP";branch("BoPFeeCalc01");
{ORI Number of Stories} <= 2 && {ORI Number of Units} > 12 ^ feeQty = 2; feeSch = "BOCORI";feeCode = "ORIINSP";branch("BoPFeeCalc01");
{ORI Number of Stories} > 2 ^ feeQty = {ORI Number of Stories}; feeSch = "BOCORI";feeCode = "ORIINSP";branch("BoPFeeCalc01");