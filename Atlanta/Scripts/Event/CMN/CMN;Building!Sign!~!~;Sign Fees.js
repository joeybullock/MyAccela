true ^ showDebug = true; showMessage = false;
true ^ feeRow = SIGNINFORMATION[eachrow];
feeRow["Sign Type"] == "Building Signature" && feeRow["Status"] == "Approved" ^ updateFee("SIGN BS","SIGN","FINAL",parseInt(feeRow["SqFt"]),"N");
feeRow["Sign Type"] == "Business Identification" && feeRow["Status"] == "Approved" ^ updateFee("SIGN BI","SIGN","FINAL",parseInt(feeRow["SqFt"]),"N");
feeRow["Sign Type"] == "Canopy" && feeRow["Status"] == "Approved" ^ updateFee("SIGN CY","SIGN","FINAL",parseInt(feeRow["SqFt"]),"N");
feeRow["Sign Type"] == "Institutional" && feeRow["Status"] == "Approved" ^ updateFee("SIGN IN","SIGN","FINAL",parseInt(feeRow["SqFt"]),"N");
feeRow["Sign Type"] == "Large Screen Video Display" && feeRow["Status"] == "Approved" ^ updateFee("SIGN LSVD","SIGN","FINAL",parseInt(feeRow["SqFt"]),"N");
feeRow["Sign Type"] == "Marquee" && feeRow["Status"] == "Approved" ^ updateFee("SIGN MQ","SIGN","FINAL",parseInt(feeRow["SqFt"]),"N");
feeRow["Sign Type"] == "Neighborhood Identification" && feeRow["Status"] == "Approved" ^ updateFee("SIGN NI","SIGN","FINAL",parseInt(feeRow["SqFt"]),"N");
feeRow["Sign Type"] == "Portable" && feeRow["Status"] == "Approved" ^ updateFee("SIGN PORT","SIGN","FINAL",parseInt(feeRow["SqFt"]),"N");
feeRow["Sign Type"] == "Shopping Center" && feeRow["Status"] == "Approved" ^ updateFee("SIGN SC","SIGN","FINAL",parseInt(feeRow["SqFt"]),"N");
feeRow["Sign Type"] == "General Advertising" && feeRow["Status"] == "Approved" ^ updateFee("SIGN GA","SIGN","FINAL",parseInt(feeRow["SqFt"]),"N");