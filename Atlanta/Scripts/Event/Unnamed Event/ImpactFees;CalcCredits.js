creditAsiT[d]["Credit ID"] != null ^ crdtCaps= crdtCaps.concat(creditAsiT[d]["Credit ID"]);
creditAsiT[d]["Credit Type"]=="Parks & Recs" ^ creditParkTtl+= new Number(creditAsiT[d]["Credit Amount"]);
creditAsiT[d]["Credit Type"]=="Police" ^ creditPoliceTtl+= new Number(creditAsiT[d]["Credit Amount"]);
creditAsiT[d]["Credit Type"]=="Transport" ^ creditTransTtl+=new Number(creditAsiT[d]["Credit Amount"]);
creditAsiT[d]["Credit Type"]=="Fire EMS" ^ creditFireTtl += new Number(creditAsiT[d]["Credit Amount"]);