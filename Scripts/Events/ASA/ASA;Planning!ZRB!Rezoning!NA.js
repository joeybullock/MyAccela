{Zoning Type} == "Rezoning" ^ branch("BOPRezoning");
{Zoning Type} == "Site Plan Amendment" ^ branch("BOPSitePlanAmendment");
{CDP Required} == "Yes" ^ email("sthenderson@atlantaga.gov; jlavandier@atlantaga.gov","production@accela.com","CDP Amendment needed","Case " + capIDString + " requires CDP amendment.")