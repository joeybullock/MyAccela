true ^ showDebug = false; showMessage = true;
true ^ childBalance = 0; childDetail = ""; childDetailObjResult = aa.cap.getCapDetail(childA[x]);
capDetailObjResult.getSuccess() ^ childDetail = childDetailObjResult.getOutput(); childBalance = childDetail.getBalance();
childBalance > 0 ^ feesOwed = true; comment("Balance due on " + childA[x].getCustomID() + " is $" + childBalance);showMessage = true; cancel = true;