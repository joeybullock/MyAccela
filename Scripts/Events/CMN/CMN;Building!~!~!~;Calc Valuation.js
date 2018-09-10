true ^ showDebug = false; showMessage = true;
true ^ editAppSpecific("Valuation Calculator Value", calcValue);
{Adjustment to Valuation} == "None" ^ editAppSpecific("Adjusted Calculated Value", calcValue);
{Adjustment to Valuation} == "Interior Minor" ^ editAppSpecific("Adjusted Calculated Value", (calcValue * .2));
{Adjustment to Valuation} == "Interior Major" ^ editAppSpecific("Adjusted Calculated Value", (calcValue * .4));
{Adjustment to Valuation} == "Addition Only" ^ editAppSpecific("Adjusted Calculated Value", (calcValue * .5));