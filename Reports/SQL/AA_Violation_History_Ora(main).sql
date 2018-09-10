SELECT  --Accela Automation Violation History Report,  Crystal for Oracle DB
    A.B1_ALT_ID,
    A.B1_FILE_DD,
    A.B1_APPL_STATUS,
    B.B1_WORK_DESC,
    (
        ( CASE WHEN C.B1_HSE_NBR_START IS null THEN '' ELSE (rtrim(TO_CHAR(C.B1_HSE_NBR_START)) || ' ' ) END) || 
		( CASE WHEN C.B1_HSE_FRAC_NBR_START IS null  THEN '' ELSE (C.B1_HSE_FRAC_NBR_START || ' ' ) END) ||
		( CASE WHEN C.B1_STR_DIR IS null THEN '' ELSE (C.B1_STR_DIR || ' ' ) END) ||
		( CASE WHEN C.B1_STR_NAME IS null THEN '' ELSE (C.B1_STR_NAME || ' ' ) END) ||
		( CASE WHEN C.B1_STR_SUFFIX IS null THEN '' ELSE (C.B1_STR_SUFFIX || ' ' ) END) ||
		( CASE WHEN C.B1_SITUS_CITY IS null THEN '' ELSE (C.B1_SITUS_CITY || ' ' ) END) ||
		( CASE WHEN C.B1_SITUS_ZIP IS null THEN '' ELSE (C.B1_SITUS_ZIP ) END) 
    ) "address",
    F.TOTAL_FEE,
    D.NAME "agency_name",
    D.SERV_PROV_CODE,
    A.B1_PER_ID1,
    A.B1_PER_ID2,
    A.B1_PER_ID3
FROM
	B1PERMIT A LEFT OUTER JOIN 
    BWORKDES B ON
		A.SERV_PROV_CODE=B.SERV_PROV_CODE AND
		A.B1_PER_ID1=B.B1_PER_ID1 AND
        A.B1_PER_ID2=B.B1_PER_ID2 AND
		A.B1_PER_ID3=B.B1_PER_ID3 AND
        A.REC_STATUS=B.REC_STATUS 
    LEFT OUTER JOIN  
    B3ADDRES C ON
		A.B1_PER_ID3=C.B1_PER_ID3 AND
		A.B1_PER_ID2=C.B1_PER_ID2 AND
		A.B1_PER_ID1=C.B1_PER_ID1 AND
		A.REC_STATUS=C.REC_STATUS AND
		A.SERV_PROV_CODE=C.SERV_PROV_CODE
    INNER JOIN 
    RSERV_PROV D ON
        A.SERV_PROV_CODE = D.SERV_PROV_CODE
    INNER JOIN
    BPERMIT_DETAIL F ON
		A.SERV_PROV_CODE=F.SERV_PROV_CODE AND
		A.B1_PER_ID1=F.B1_PER_ID1 AND
        A.B1_PER_ID2=F.B1_PER_ID2 AND
		A.B1_PER_ID3=F.B1_PER_ID3 AND
        A.REC_STATUS=F.REC_STATUS 
WHERE  
        A.SERV_PROV_CODE = 'ATLANTA_GA' AND
        A.B1_FILE_DD >= {?startDate} AND
        A.B1_FILE_DD < {?endDate}+1 AND
        UPPER(A.B1_PER_GROUP) = UPPER('{?capGroup}') AND
        (UPPER(A.B1_PER_TYPE)=UPPER('{?capType}') OR '{?capType}' IS NULL) AND
        (UPPER(A.B1_PER_SUB_TYPE)=UPPER('{?capSubtype}') OR '{?capSubtype}' IS NULL) AND
        (UPPER(A.B1_PER_CATEGORY)=UPPER('{?capCategory}') OR '{?capCategory}' IS NULL) AND
        UPPER(COALESCE(A.B1_APPL_STATUS,'A'))<>'VOID' AND
        A.REC_STATUS = 'A' AND
        C.B1_ADDR_SOURCE_FLG  = 'Adr'  AND
        (   
            C.B1_HSE_NBR_START = TO_NUMBER('{?houseNumber}')
            OR
            '{?houseNumber}' IS NULL
        ) AND 
        ( '{?streetName}' IS NULL OR UPPER(C.B1_STR_NAME) LIKE UPPER('{?streetName}') ) AND
        ( '{?streetDir}' IS NULL OR UPPER(C.B1_STR_DIR) = UPPER('{?streetDir}') ) AND
        ( '{?streetSuffix}' IS NULL OR UPPER(C.B1_STR_SUFFIX) = UPPER('{?streetSuffix}') ) AND
        ( '{?city}' IS NULL OR UPPER(C.B1_SITUS_CITY)=UPPER('{?city}') ) AND
        ( '{?zip}' IS NULL OR C.B1_SITUS_ZIP='{?zip}' ) AND
        ( 
            '{?firstName}' IS NULL AND
            '{?middleName}' IS NULL AND
            '{?lastName}' IS NULL AND
            '{?contactType}' IS NULL
            OR
            EXISTS
            (
                SELECT 'Y' FROM B3CONTACT E
                WHERE
                A.SERV_PROV_CODE=E.SERV_PROV_CODE AND
        		A.B1_PER_ID1=E.B1_PER_ID1 AND
                A.B1_PER_ID2=E.B1_PER_ID2 AND
        		A.B1_PER_ID3=E.B1_PER_ID3 AND
                E.REC_STATUS='A' AND
                ( UPPER(E.B1_FNAME) LIKE UPPER('{?firstName}') OR '{?firstName}' IS NULL ) AND
                ( UPPER(E.B1_MNAME) LIKE UPPER('{?middleName}') OR '{?middleName}' IS NULL ) AND
                ( UPPER(E.B1_LNAME) LIKE UPPER('{?lastName}') OR '{?lastName}' IS NULL ) AND
                ( UPPER(E.B1_CONTACT_TYPE)=UPPER('{?contactType}') OR '{?contactType}' IS NULL )
            )
        )
ORDER BY
    A.B1_ALT_ID