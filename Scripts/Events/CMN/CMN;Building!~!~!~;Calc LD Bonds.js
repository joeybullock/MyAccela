true ^ showDebug = false; showMessage = true;
true ^ bond1 = 0;
true ^ bond2 = 0;
{Performance Bond Req'd} == "Yes" && {Disturbed Acreage} != null && {Amt/Acre} != null ^ bond1 = ({Disturbed Acreage} * {Amt/Acre});
{Excavation Bond Req'd} == "Yes" && {Cut and Fill} != null && {Amt/Cu Yd} != null ^ bond2 = ({Cut and Fill} * {Amt/Cu Yd});
true ^ editAppSpecific("Bond Amount", (bond1 + bond2));