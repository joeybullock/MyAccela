wfTask == "Building Review" && wfStatus == "Calc Permit Fee" ^ branch ("CMN:Building/*/*/*:Calc Building Permit Fee");
wfTask == "Issue Permit" && wfStatus == "Invoiced" ^ branch ("CMN:Building/Airport/*/*:Invoice New Fees");