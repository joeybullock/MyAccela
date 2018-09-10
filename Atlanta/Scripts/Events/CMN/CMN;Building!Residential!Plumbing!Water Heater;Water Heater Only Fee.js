{Gas Water Heater} != null ^ updateFee("02WTRHEATER","BLDWTRHEATER", "FINAL", {Gas Water Heater} , "Y");
{Electric Water Heater} != null ^ updateFee("01WTRHEATER","BLDWTRHEATER", "FINAL", {Electric Water Heater} , "Y");
true ^ addFee("BTECH","BLDPLUMBING","FINAL",1 ,"Y");
true ^ branch("CMN:Building/*/*/*:Calc ACA Convenience Fee");