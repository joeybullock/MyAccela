SELECT
B.REC_STATUS, B.B1_PER_ID1, B.B1_PER_ID2, B.B1_PER_ID3, B.SERV_PROV_CODE,
-- 1/10 Location Street Address - Primary address
    (
    CASE WHEN B3A.B1_HSE_NBR_START IS NOT NULL THEN B3A.B1_HSE_NBR_START||' ' ELSE '' END ||
    CASE WHEN B3A.B1_STR_NAME IS NOT NULL THEN B3A.B1_STR_NAME||' ' ELSE '' END ||
    CASE WHEN B3A.B1_STR_SUFFIX IS NOT NULL THEN B3A.B1_STR_SUFFIX||' ' ELSE '' END ||
    CASE WHEN B3A.B1_STR_SUFFIX_DIR IS NOT NULL THEN B3A.B1_STR_SUFFIX_DIR ELSE '' END
    )Address,
-- 2/11 Parcel Number	2	Parcel
	b3p.b1_parcel_nbr,
-- 3 Owner	Full Name of Violator Contact
	CASE
		WHEN B3C.B1_FULL_NAME IS NOT NULL
		THEN B3C.B1_FULL_NAME
		ELSE(
			CASE WHEN B3C.B1_FNAME IS NOT NULL THEN B3C.B1_FNAME ELSE '' END ||
			CASE WHEN B3C.B1_MNAME IS NOT NULL THEN B3C.B1_MNAME ELSE '' END ||
			CASE WHEN B3C.B1_LNAME IS NOT NULL THEN B3C.B1_LNAME ELSE '' END
		)
	END OwnerName,
-- 4 Owner Address Full Address of Violator
	(
		CASE WHEN B3C.B1_ADDRESS1 IS NOT NULL THEN B3C.B1_ADDRESS1||chr(10) ELSE '' END||
		CASE WHEN B3C.B1_ADDRESS2 IS NOT NULL THEN B3C.B1_ADDRESS2||chr(10) ELSE '' END||
		CASE WHEN B3C.B1_ADDRESS3 IS NOT NULL THEN B3C.B1_ADDRESS3||chr(10) ELSE '' END||
		CASE WHEN B3C.B1_CITY IS NOT NULL THEN B3C.B1_CITY||', ' ELSE '' END||
		CASE WHEN B3C.B1_STATE IS NOT NULL THEN B3C.B1_STATE||' ' ELSE '' END||
		CASE WHEN B3C.B1_ZIP IS NOT NULL THEN B3C.B1_ZIP ELSE '' END
	) OwnerAddress,
-- 5/13 Case Number
	B.B1_ALT_ID CaseNum,
-- 6 NPU General Complaint Info
	(
		SELECT B1_CHECKLIST_COMMENT
		FROM BCHCKBOX BCBS
		WHERE
			1=1 AND BCBS.SERV_PROV_CODE = B.SERV_PROV_CODE
			AND BCBS.REC_STATUS = B.REC_STATUS
			AND BCBS.B1_PER_ID1 = B.B1_PER_ID1
			AND BCBS.B1_PER_ID2 = B.B1_PER_ID2
			AND BCBS.B1_PER_ID3 = B.B1_PER_ID3
			AND BCBS.B1_CHECKBOX_DESC = 'NPU'
	) NPU,
-- 7 Date Issued
	SYSDATE DateIssued,
-- 8 Repairs Must Begin By - Notice Start Date ASI Table (Notice Dates) / Notice type = Commercial notice
	BASTV1.ATTRIBUTE_VALUE StartDate,
-- 9 Repairs Must Be Completed By - Notice Finish Date ASI Table (Notice Dates) / Notice type = Commercial notice
	BASTV2.ATTRIBUTE_VALUE EndDate,
-- 12 Type of Construction Additional Info
	(
		SELECT BCBS.B1_CHECKLIST_COMMENT
		FROM BCHCKBOX BCBS
		WHERE
			1=1 AND B.SERV_PROV_CODE = BCBS.SERV_PROV_CODE AND B.REC_STATUS = BCBS.REC_STATUS
			AND B.B1_PER_ID1 = BCBS.B1_PER_ID1 AND B.B1_PER_ID2 = BCBS.B1_PER_ID2 AND B.B1_PER_ID3 = BCBS.B1_PER_ID3
			AND BCBS.B1_CHECKBOX_DESC = 'Type of Construction'
	) TypOfConstruction,
-- 14 Initial Inspection Date - Inspections
--gp.g6_stat_dd,
GP.G6_COMPL_DD g6_stat_dd,
-- 15 Structure Is	Structure Type	15	Structures/Details
	(
		SELECT BCBS.B1_CHECKLIST_COMMENT
		FROM BCHCKBOX BCBS
		WHERE
			1=1 AND B.SERV_PROV_CODE = BCBS.SERV_PROV_CODE AND B.REC_STATUS = BCBS.REC_STATUS
			AND B.B1_PER_ID1 = BCBS.B1_PER_ID1 AND B.B1_PER_ID2 = BCBS.B1_PER_ID2 AND B.B1_PER_ID3 = BCBS.B1_PER_ID3
			AND BCBS.B1_CHECKBOX_DESC = 'Occupied'
	) StructureType,
-- 16 Zoning - General Complaint Info
	(
		SELECT BCBS.B1_CHECKLIST_COMMENT
		FROM BCHCKBOX BCBS
		WHERE
			1=1 AND B.SERV_PROV_CODE = BCBS.SERV_PROV_CODE AND B.REC_STATUS = BCBS.REC_STATUS
			AND B.B1_PER_ID1 = BCBS.B1_PER_ID1 AND B.B1_PER_ID2 = BCBS.B1_PER_ID2 AND B.B1_PER_ID3 = BCBS.B1_PER_ID3
			AND BCBS.B1_CHECKBOX_DESC = 'Zoning 1'
	) Zoning,
-- 17 Inspectors Name
(case when Gp.ga_fname is not null then gp.ga_fname||' ' else '' end ||
case when Gp.ga_mname is not null then gp.ga_mname||' ' else '' end ||
case when Gp.ga_lname is not null then gp.ga_lname||' ' else '' end) InspectorName,

-- 18 Deficiency - Guide Sheets / (Commercial Exterior/Commercial Interior)
-- 19 Location Standard comments Guide Sheets / Standard Comments
-- 20 Remedial Action Standard comments Guide Sheets / Standard Comments
	(
		SELECT
		COUNT(*)
		FROM
			gguidesheet ggs
			INNER JOIN gguidesheet_item ggsi ON
				ggs.serv_prov_code = ggsi.serv_prov_code
				and ggsi.guidesheet_seq_nbr = ggs.guidesheet_seq_nbr
				AND ggsi.guide_item_status = 'Not Complied'
				and ggsi.guide_type in ('Residential Exterior','Residential Interior')
				AND ggs.rec_status = ggsi.rec_status
		WHERE
			b.serv_prov_code = ggs.serv_prov_code
			AND b.b1_per_id1 = ggs.b1_per_id1
			AND b.b1_per_id2 = ggs.b1_per_id2
			AND b.b1_per_id3 = ggs.b1_per_id3
			and b.rec_status = ggs.rec_status
	) SubReptChck,
-- 21 Get Mayor, Commissioner, and Director (Deputy Director is commented out) from Standard Choices
FN_GET_STDCHOICE_VALUEDESC(B.SERV_PROV_CODE,'BOC LETTERHEAD','MAYOR') mayor,
FN_GET_STDCHOICE_VALUEDESC(B.SERV_PROV_CODE,'BOC LETTERHEAD','COMMISSIONER') commissioner,
--By COA -- FN_GET_STDCHOICE_VALUEDESC(B.SERV_PROV_CODE,'BOC LETTERHEAD','DEPUTY COMMISSIONER') deputy,
FN_GET_STDCHOICE_VALUEDESC(B.SERV_PROV_CODE,'BOC LETTERHEAD','DIRECTOR') director,
1
FROM B1PERMIT B
	LEFT OUTER JOIN B3CONTACT B3C ON
		1=1
		AND B.SERV_PROV_CODE = B3C.SERV_PROV_CODE AND B.REC_STATUS = B3C.REC_STATUS
		AND B.B1_PER_ID1 = B3C.B1_PER_ID1 AND B.B1_PER_ID2 = B3C.B1_PER_ID2 AND B.B1_PER_ID3 = B3C.B1_PER_ID3
		AND B3C.B1_CONTACT_TYPE = 'Violator'
	LEFT OUTER JOIN G6ACTION GP ON
		1=1
		AND B.SERV_PROV_CODE = GP.SERV_PROV_CODE AND B.REC_STATUS = GP.REC_STATUS
		AND B.B1_PER_ID1 = GP.B1_PER_ID1 AND B.B1_PER_ID2 = GP.B1_PER_ID2 AND B.B1_PER_ID3 = GP.B1_PER_ID3
    AND GP.G6_ACT_TYP = 'Initial Inspection'
	INNER JOIN B3PARCEL B3P ON
		B.SERV_PROV_CODE = B3P.SERV_PROV_CODE AND B.REC_STATUS = B3P.REC_STATUS
		AND B.B1_PER_ID1 = B3P.B1_PER_ID1
		AND B.B1_PER_ID2 = B3P.B1_PER_ID2
		AND B.B1_PER_ID3 = B3P.B1_PER_ID3
		AND B3P.B1_PRIMARY_PAR_FLG = (
			SELECT MAX(B3PS2.B1_PRIMARY_PAR_FLG)
			FROM B3PARCEL B3PS2
			WHERE
				1=1 AND B3PS2.SERV_PROV_CODE = B.serv_prov_code and b3ps2.rec_status = b.rec_status
				AND b3ps2.b1_per_id1 = b.b1_per_id1 AND b3ps2.b1_per_id2 = b.b1_per_id2 AND b3ps2.b1_per_id3 = b.b1_per_id3
		)
	LEFT OUTER JOIN BAPPSPECTABLE_VALUE BASTV ON
		1=1
		AND B.SERV_PROV_CODE = BASTV.SERV_PROV_CODE AND B.REC_STATUS = BASTV.REC_STATUS
		AND B.B1_PER_ID1 = BASTV.B1_PER_ID1 AND B.B1_PER_ID2 = BASTV.B1_PER_ID2 AND B.B1_PER_ID3 = BASTV.B1_PER_ID3
		AND BASTV.COLUMN_NAME = 'Notice Type' AND UPPER(BASTV.ATTRIBUTE_VALUE) LIKE 'LONG%FORM%NOTICE%'
	LEFT OUTER JOIN bappspectable_value bastv1 ON
		1=1
		AND B.SERV_PROV_CODE = BASTV1.SERV_PROV_CODE AND B.REC_STATUS = BASTV1.REC_STATUS
		AND B.B1_PER_ID1 = BASTV1.B1_PER_ID1 AND B.B1_PER_ID2 = BASTV1.B1_PER_ID2 AND B.B1_PER_ID3 = BASTV1.B1_PER_ID3
		AND BASTV.ROW_INDEX = BASTV1.ROW_INDEX AND BASTV1.COLUMN_NAME = 'Notice Start Date'
	LEFT OUTER JOIN bappspectable_value bastv2 ON
		1=1
		AND B.SERV_PROV_CODE = BASTV2.SERV_PROV_CODE AND B.REC_STATUS = BASTV2.REC_STATUS
		AND B.B1_PER_ID1 = BASTV2.B1_PER_ID1 AND B.B1_PER_ID2 = BASTV2.B1_PER_ID2 AND B.B1_PER_ID3 = BASTV2.B1_PER_ID3
		AND BASTV.ROW_INDEX = BASTV2.ROW_INDEX AND BASTV2.COLUMN_NAME = 'Notice Finish Date'
	INNER JOIN B3ADDRES B3A ON
		B.SERV_PROV_CODE = B3A.SERV_PROV_CODE AND B.REC_STATUS = B3A.REC_STATUS
		AND B.B1_PER_ID1 = B3A.B1_PER_ID1 AND B.B1_PER_ID2 = B3A.B1_PER_ID2 AND B.B1_PER_ID3 = B3A.B1_PER_ID3
		AND B3A.B1_ADDRESS_NBR = (
			SELECT MIN(B3A1.B1_ADDRESS_NBR)
			FROM B3ADDRES B3A1
			WHERE
				1=1
				AND B3A.SERV_PROV_CODE = B3A1.SERV_PROV_CODE AND B3A.REC_STATUS = B3A1.REC_STATUS
				AND B3A.B1_PER_ID1 = B3A1.B1_PER_ID1 AND B3A.B1_PER_ID2 = B3A1.B1_PER_ID2 AND B3A.B1_PER_ID3 = B3A1.B1_PER_ID3
				AND B3A1.B1_PRIMARY_ADDR_FLG = (
					SELECT MAX(B1_PRIMARY_ADDR_FLG)
					FROM B3ADDRES B3A2
					WHERE
						1=1
						AND B3A2.SERV_PROV_CODE = B3A1.SERV_PROV_CODE AND B3A2.REC_STATUS = B3A1.REC_STATUS
						AND B3A2.B1_PER_ID1 = B3A1.B1_PER_ID1 AND B3A2.B1_PER_ID2 = B3A1.B1_PER_ID2 AND B3A2.B1_PER_ID3 = B3A1.B1_PER_ID3    
				)
		)
	--===========================================================
	-- This portion of the query will be moved to a sub-report.
	--===========================================================
	/*INNER JOIN gguidesheet ggs on
		b.serv_prov_code = ggs.serv_prov_code
		and b.b1_per_id1 = ggs.b1_per_id1
		and b.b1_per_id2 = ggs.b1_per_id2
		and b.b1_per_id3 = ggs.b1_per_id3
	INNER JOIN gguidesheet_item ggsi ON
		B.serv_prov_code = ggsi.serv_prov_code
		and ggsi.guidesheet_seq_nbr = ggs.guidesheet_seq_nbr
		AND ggsi.guide_item_status = 'Not Complied'
		and ggsi.guide_type in ('Commercial Exterior', 'Commercial Interior')	--*/
	--===========================================================
	-- End section that will be moved to a sub-report
	--===========================================================
WHERE
	1=1
	AND B.SERV_PROV_CODE='ATLANTA_GA'
	AND B.B1_PER_GROUP = 'Enforcement'
	AND B.B1_PER_TYPE = 'Complaint'
	AND B.B1_PER_SUB_TYPE = 'Code Enforcement'
	AND B.B1_PER_CATEGORY = 'NA'
--	AND B.B1_ALT_ID = 'CC-2009-00072'
	AND B.B1_ALT_ID = upper('{?capid}')
	--AND B.B1_APPL_STATUS IN ('Cancelled','Denied','Suspended','Void')
ORDER BY 1 DESC
