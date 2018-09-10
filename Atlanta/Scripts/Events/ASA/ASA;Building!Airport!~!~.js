true ^ branch ("CMN:Building/*/*/*:Calc Building Plan Review Fee");
{Includes Site Work} == "Yes" ^ branch ("CMN:Building/*/*/*:Calc Land Dev Plan Review Fee");
{Land Development/Site Work Included} == "Yes" ^ branch ("CMN:Building/*/*/*:Calc Site Dev Plan Review Fee");
true ^ branch ("CMN:Building/*/*/*:Permit Processing Fee");