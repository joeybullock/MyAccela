 function getContactArrayBefore()
                {
                // Returns an array of associative arrays with contact attributes.  Attributes are UPPER CASE
                // optional capid
                // added check for ApplicationSubmitAfter event since the contactsgroup array is only on pageflow,
                // on ASA it should still be pulled normal way even though still partial cap
 
 
                var envContactList = aa.env.getValue("ContactList");
 
                var capContactArray = envContactList.toArray();
 
                var cArray = new Array();
 
                if (capContactArray)
                                {
                                for (yy in capContactArray)
                                                {
                                                var aArray = new Array();
                                                aArray["lastName"] = capContactArray[yy].getPeople().lastName;
                                                aArray["refSeqNumber"] = capContactArray[yy].getRefContactNumber();
                                                aArray["firstName"] = capContactArray[yy].getPeople().firstName;
                                                aArray["middleName"] = capContactArray[yy].getPeople().middleName;
                                                aArray["businessName"] = capContactArray[yy].getPeople().businessName;
                                                aArray["contactSeqNumber"] =capContactArray[yy].getPeople().contactSeqNumber;
                                                aArray["contactType"] =capContactArray[yy].getPeople().contactType;
                                                aArray["relation"] = capContactArray[yy].getPeople().relation;
                                                aArray["phone1"] = capContactArray[yy].getPeople().phone1;
                                                aArray["phone2"] = capContactArray[yy].getPeople().phone2;
                                                aArray["email"] = capContactArray[yy].getPeople().email;
                                                aArray["addressLine1"] = capContactArray[yy].getPeople().getCompactAddress().getAddressLine1();
                                                aArray["addressLine2"] = capContactArray[yy].getPeople().getCompactAddress().getAddressLine2();
                                                aArray["city"] = capContactArray[yy].getPeople().getCompactAddress().getCity();
                                                aArray["state"] = capContactArray[yy].getPeople().getCompactAddress().getState();
                                                aArray["zip"] = capContactArray[yy].getPeople().getCompactAddress().getZip();
                                                aArray["fax"] = capContactArray[yy].getPeople().fax;
                                                aArray["notes"] = capContactArray[yy].getPeople().notes;
                                                aArray["country"] = capContactArray[yy].getPeople().getCompactAddress().getCountry();
                                                aArray["fullName"] = capContactArray[yy].getPeople().fullName;
 
 
                                                var pa = capContactArray[yy].getPeople().getAttributes().toArray();
                                for (xx1 in pa)
                                                aArray[pa[xx1].attributeName] = pa[xx1].attributeValue;
                                                cArray.push(aArray);
		                                }
                                        }
                return cArray;
                }

