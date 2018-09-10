{SPI Zoning} !=null ^ feeQty = 1; feeSch = "BOPFLATFEES";feeCode = "C07";branch("BoPFeeCalc01")
matches({Zoning 1}.substr(0,3),"R-1","R-2","R-3","R-4","R-5") ^ feeCode = "C02";feeSch = "BOPFLATFEES";feeQty = 1;branch("BoPFeeCalc01");
matches({Zoning 1}.substr(0,2),"LD","HD") ^ feeCode = "C02";feeSch = "BOPFLATFEES";feeQty = 1;branch("BoPFeeCalc01");
matches({Zoning 1}.substr(0,4),"RG-1","RG-2","RG-3","RG-4","RG-5","RG-6","MR-1","MR-2","MR-3","MR-4","MR-5","MR-6") ^ addFee("C06","BOPFLATFEES","FINAL",1,"Y");
matches({Zoning 1}.substr(0,3),"O-I","C-1","C-2","C-3","C-4","C-5","I-1","I-2") ^ addFee("C07","BOPFLATFEES","FINAL",1,"Y");
matches({Zoning 1}.substr(0,4),"R-LC","MRC-1","MRC-2","MRC-3","MRC-1-C","MRC-2-C","MRC-3-C","LW","NC") ^ addFee("C07","BOPFLATFEES","FINAL",1,"Y");
matches({Zoning 1}.substr(0,2),"LW","NC") ^ addFee("C07","BOPFLATFEES","FINAL",1,"Y");