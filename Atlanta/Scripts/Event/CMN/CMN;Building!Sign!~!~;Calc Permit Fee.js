true ^ showDebug = true; showMessage = false;
typeof(SIGNINFORMATION) =="object" ^  for(eachrow in SIGNINFORMATION) branch ("CMN:Building/Sign/*/*:Sign Fees");
cap.isCreatedByACA() ^ branch("CMN:Building/*/*/*:Calc ACA Convenience Fee");