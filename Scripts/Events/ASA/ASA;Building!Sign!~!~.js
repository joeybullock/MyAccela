typeof(SIGNINFORMATION) =="object" ^  for(eachrow in SIGNINFORMATION) branch ("CMN:Building/Sign/*/*:Calc Sign Plan Review Fee");
{Plan Review Fee} == "Yes" ^ addFee("BTECH","SIGN","FINAL",1 ,"Y");
true ^ branch ("CMN:Building/*/*/*:Permit Processing Fee");
cap.isCreatedByACA() ^ branch("CMN:Building/*/*/*:Calc ACA Convenience Fee");