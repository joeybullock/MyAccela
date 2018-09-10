true ^ branch ("CMN:Building/Commercial/Low Voltage/*:Voltage Fees");
true ^ branch ("CMN:Building/*/*/*:Calc Technology Fee");
true ^ ttlDue = 0; allFees = new Array(); allFees = loadFees(); for (x in allFees) if(allFees[x].amount && allFees[x].code !="BTECH" && allFees[x].code !="ACA CC" && allFees[x].code !="PPFEE" && allFees[x].amountPaid ==0) ttlDue +=allFees[x].amount;if(ttlDue < 150)ttlDue=150 - ttlDue;else ttlDue = 0;addFee("BBASE", "BLDELECTRICAL", "FINAL", ttlDue,"Y");comment("ttlDue = " + ttlDue);
cap.isCreatedByACA() ^ branch("CMN:Building/*/*/*:Calc ACA Convenience Fee");