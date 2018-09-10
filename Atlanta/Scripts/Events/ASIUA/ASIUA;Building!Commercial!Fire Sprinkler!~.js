true ^ showDebug = false; showMessage = true;
true ^ branch ("CMN:Building/Commercial/Fire Sprinkler/*:Fire Fees");
cap.isCreatedByACA() ^ branch("CMN:Building/*/*/*:Calc ACA Convenience Fee");