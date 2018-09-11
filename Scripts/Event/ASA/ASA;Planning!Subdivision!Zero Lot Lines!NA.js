{SPI Zoning} != null ^ feeQty = 1; feeSch = "BOPFLATFEES";feeCode = "C04";branch("BoPFeeCalc01")
{SPI Zoning} == null ^ feeQty = 1; feeSch = "BOPFLATFEES";feeCode = "C02";branch("BoPFeeCalc01")