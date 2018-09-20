SELECT DISTINCT 1
    ,   A.B1_ALT_ID                     AS "Case Number"
    ,   D.B1_HSE_NBR_START              AS "NBR"
    ,   D.B1_STR_NAME                   AS "NAME"
    ,   D.B1_STR_SUFFIX                 AS "STR"
    ,   D.B1_STR_SUFFIX_DIR             AS "DIR"
    ,   X.B1_CHECKLIST_COMMENT          AS "npu"
    ,   TO_CHAR(A.B1_FILE_DD, 'MM/DD/YYYY')                             AS "Opened Date"
    ,   A.B1_SPECIAL_TEXT                                               AS "Case Short Description"
    ,   LAST_VALUE(I.GA_FNAME || ' ' || I.GA_LNAME)
            OVER (PARTITION BY A.B1_ALT_ID
            ORDER BY I.G6_ACT_NUM ASC
            RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)  AS "Inspector"
    ,   LAST_VALUE(I.G6_ACT_DES)
            OVER (PARTITION BY A.B1_ALT_ID
            ORDER BY I.G6_ACT_NUM ASC
            RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)  AS "Latest Inspection"
    ,   LAST_VALUE(TO_CHAR(I.G6_STATUS_DD, 'MM/DD/YYYY'))
            OVER (PARTITION BY A.B1_ALT_ID
            ORDER BY I.G6_ACT_NUM ASC
            RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)  AS "Latest Inspection Date"
    ,   LAST_VALUE(I.G6_STATUS)
            OVER (PARTITION BY A.B1_ALT_ID
            ORDER BY I.G6_ACT_NUM ASC
            RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)  AS "Inspection Result"
    ,   B.C6_REFERENCE_TYPE   AS "Source"
    ,   LAST_VALUE(G.SD_PRO_DES)
            OVER (PARTITION BY A.B1_ALT_ID
            ORDER BY G.GPROCESS_HISTORY_SEQ_NBR ASC
            RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)  AS "Latest Workflow Task"
/*    ,   LAST_VALUE(G.SD_APP_DES)
            OVER (PARTITION BY A.B1_ALT_ID
            ORDER BY G.GPROCESS_HISTORY_SEQ_NBR ASC
            RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)  AS "Latest Workflow Status"
*/
    ,   A.B1_APPL_STATUS                                                AS "Case Status"
    ,   TO_CHAR(A.B1_APPL_STATUS_DATE, 'MM/DD/YYYY')                    AS "Status Date"
    ,   TO_CHAR(A.B1_FILE_DD, 'YYYY')                                   AS "Open Year"
    ,   TO_CHAR(A.B1_FILE_DD, 'MM')                                     AS "Open Month"
    ,   TO_CHAR(A.B1_APPL_STATUS_DATE, 'YYYY')                          AS "Status Year"
    ,   TO_CHAR(A.B1_APPL_STATUS_DATE, 'MM')                            AS "Status Month"
    ,   FLOOR(TRUNC(SYSDATE) - TRUNC(A.B1_APPL_STATUS_DATE))            AS "# days since last status"
    ,   CASE
            WHEN H.B1_CHECKLIST_COMMENT = 'CHECKED' AND P.B1_CHECKLIST_COMMENT = 'CHECKED'
            THEN 'Highly Hazardous'
            WHEN H.B1_CHECKLIST_COMMENT = 'CHECKED' AND P.B1_CHECKLIST_COMMENT = 'UNCHECKED'
            THEN 'Highly Hazardous'
            WHEN H.B1_CHECKLIST_COMMENT = 'CHECKED' AND P.B1_CHECKLIST_COMMENT IS NULL
            THEN 'Highly Hazardous'
            WHEN H.B1_CHECKLIST_COMMENT = 'UNCHECKED' AND P.B1_CHECKLIST_COMMENT = 'CHECKED'
            THEN 'Property Maintenance'
            WHEN H.B1_CHECKLIST_COMMENT IS NULL AND P.B1_CHECKLIST_COMMENT = 'CHECKED'
            THEN 'Property Maintenance'
            ELSE 'Unknown'
        END                                                             AS "Case Description"
    ,   FLOOR(TRUNC(SYSDATE) - TRUNC(A.B1_FILE_DD))                     AS "# days since opened"
    ,   CASE
            WHEN H.B1_CHECKLIST_COMMENT = 'CHECKED' AND P.B1_CHECKLIST_COMMENT = 'CHECKED'
            THEN
                'Week of ' || TO_CHAR((B1_FILE_DD+58 - (TO_NUMBER(TO_CHAR(B1_FILE_DD+58, 'D'))) + 1), 'MM/DD/YYYY') ||
                ' to '     || TO_CHAR((B1_FILE_DD+58 - (TO_NUMBER(TO_CHAR(B1_FILE_DD+58, 'D'))) + 7), 'MM/DD/YYYY')
                
            WHEN H.B1_CHECKLIST_COMMENT = 'CHECKED' AND P.B1_CHECKLIST_COMMENT = 'UNCHECKED'
            THEN
                'Week of ' || TO_CHAR((B1_FILE_DD+58 - (TO_NUMBER(TO_CHAR(B1_FILE_DD+58, 'D'))) + 1), 'MM/DD/YYYY') ||
                ' to '     || TO_CHAR((B1_FILE_DD+58 - (TO_NUMBER(TO_CHAR(B1_FILE_DD+58, 'D'))) + 7), 'MM/DD/YYYY')
                
            WHEN H.B1_CHECKLIST_COMMENT = 'CHECKED' AND P.B1_CHECKLIST_COMMENT IS NULL
            THEN
                'Week of ' || TO_CHAR((B1_FILE_DD+120 - (TO_NUMBER(TO_CHAR(B1_FILE_DD+58, 'D'))) + 1), 'MM/DD/YYYY') ||
                ' to '     || TO_CHAR((B1_FILE_DD+120 - (TO_NUMBER(TO_CHAR(B1_FILE_DD+58, 'D'))) + 7), 'MM/DD/YYYY')
                
            WHEN H.B1_CHECKLIST_COMMENT = 'UNCHECKED' AND P.B1_CHECKLIST_COMMENT = 'CHECKED'
            THEN
                'Week of ' || TO_CHAR((B1_FILE_DD+120 - (TO_NUMBER(TO_CHAR(B1_FILE_DD+120, 'D'))) + 1), 'MM/DD/YYYY') ||
                ' to '     || TO_CHAR((B1_FILE_DD+120 - (TO_NUMBER(TO_CHAR(B1_FILE_DD+120, 'D'))) + 7), 'MM/DD/YYYY')
                
            WHEN H.B1_CHECKLIST_COMMENT IS NULL AND P.B1_CHECKLIST_COMMENT = 'CHECKED'
            THEN
                'Week of ' || TO_CHAR((B1_FILE_DD+120 - (TO_NUMBER(TO_CHAR(B1_FILE_DD+120, 'D'))) + 1), 'MM/DD/YYYY') ||
                ' to '     || TO_CHAR((B1_FILE_DD+120 - (TO_NUMBER(TO_CHAR(B1_FILE_DD+120, 'D'))) + 7), 'MM/DD/YYYY')
                
            ELSE 'Unknown'
        END    
                                            AS "Cobra Period-Due"
    ,   (SELECT
            CASE WHEN B3A.B1_HSE_NBR_START IS NOT NULL THEN B3A.B1_HSE_NBR_START||' ' ELSE '' END||
            CASE WHEN B3A.B1_STR_NAME IS NOT NULL THEN B3A.B1_STR_NAME||' ' ELSE '' END ||
            CASE WHEN B3A.B1_STR_SUFFIX IS NOT NULL THEN B3A.B1_STR_SUFFIX||' ' ELSE '' END ||
            CASE WHEN B3A.B1_STR_SUFFIX_DIR IS NOT NULL THEN B3A.B1_STR_SUFFIX_DIR||' ' ELSE '' END ||
            CASE WHEN B3A.B1_UNIT_TYPE IS NULL AND B3A.B1_UNIT_START IS NOT NULL THEN '#'||B3A.B1_UNIT_START||' ' ELSE '' END ||
            CASE WHEN B3A.B1_UNIT_TYPE IS NOT NULL AND B3A.B1_UNIT_START IS NOT NULL THEN B3A.B1_UNIT_TYPE || ' ' || B3A.B1_UNIT_START || ' ' ELSE '' END ||
            CASE WHEN B3A.B1_SITUS_CITY IS NOT NULL THEN B3A.B1_SITUS_CITY||', ' ELSE '' END ||
            CASE WHEN B3A.B1_SITUS_STATE IS NOT NULL THEN B3A.B1_SITUS_STATE||' ' ELSE '' END ||
            CASE WHEN B3A.B1_SITUS_ZIP IS NOT NULL THEN B3A.B1_SITUS_ZIP||' ' ELSE '' END
        FROM B3ADDRES B3A
        WHERE
            A.SERV_PROV_CODE = B3A.SERV_PROV_CODE AND A.REC_STATUS = B3A.REC_STATUS
            AND A.B1_PER_ID1 = B3A.B1_PER_ID1 AND A.B1_PER_ID2 = B3A.B1_PER_ID2 AND A.B1_PER_ID3 = B3A.B1_PER_ID3
            AND B1_ADDRESS_NBR = (
                SELECT MIN(B1_ADDRESS_NBR)
                FROM B3ADDRES B3A1
                WHERE
                    1=1
                    AND A.SERV_PROV_CODE = B3A1.SERV_PROV_CODE AND A.REC_STATUS = B3A1.REC_STATUS
                    AND A.B1_PER_ID1 = B3A1.B1_PER_ID1 AND A.B1_PER_ID2 = B3A1.B1_PER_ID2 AND A.B1_PER_ID3 = B3A1.B1_PER_ID3
                    AND B3A1.B1_PRIMARY_ADDR_FLG = (
                        SELECT MAX(B3A2.B1_PRIMARY_ADDR_FLG)
                        FROM B3ADDRES B3A2
                        WHERE
                            1=1
                            AND A.SERV_PROV_CODE = B3A2.SERV_PROV_CODE AND A.REC_STATUS = B3A2.REC_STATUS
                            AND A.B1_PER_ID1 = B3A2.B1_PER_ID1 AND A.B1_PER_ID2 = B3A2.B1_PER_ID2 AND A.B1_PER_ID3 = B3A2.B1_PER_ID3
                    )
            ) --*/
        )                                       AS "Address"
    ,   CASE WHEN R.B1_CHECKLIST_COMMENT != 'undefined' OR R.B1_CHECKLIST_COMMENT IS NOT NULL THEN 'District ' || R.B1_CHECKLIST_COMMENT ELSE NULL END  AS "District"
    ,   A.B1_APPL_STATUS_DATE - A.B1_FILE_DD    AS "Status Date - Open Date"
    
        
FROM
    B1PERMIT A
    
    INNER JOIN BPERMIT_DETAIL B ON
        A.SERV_PROV_CODE = B.SERV_PROV_CODE AND A.REC_STATUS = B.REC_STATUS
    AND A.B1_PER_ID1 = B.B1_PER_ID1 AND A.B1_PER_ID2 = B.B1_PER_ID2 AND A.B1_PER_ID3 = B.B1_PER_ID3
    
    INNER JOIN GPROCESS_HISTORY G ON
        A.SERV_PROV_CODE = G.SERV_PROV_CODE AND A.REC_STATUS = G.REC_STATUS
    AND A.B1_PER_ID1 = G.B1_PER_ID1 AND A.B1_PER_ID2 = G.B1_PER_ID2 AND A.B1_PER_ID3 = G.B1_PER_ID3
    
    INNER JOIN BCHCKBOX X ON
        A.SERV_PROV_CODE = X.SERV_PROV_CODE AND A.REC_STATUS = X.REC_STATUS
    AND A.B1_PER_ID1 = X.B1_PER_ID1 AND A.B1_PER_ID2 = X.B1_PER_ID2 AND A.B1_PER_ID3 = X.B1_PER_ID3
    AND X.B1_CHECKBOX_DESC = 'NPU Neighborhood'
--    AND X.B1_CHECKLIST_COMMENT = ('{?NPUneighborhood}')
    
    LEFT OUTER JOIN BCHCKBOX R ON
        A.SERV_PROV_CODE = R.SERV_PROV_CODE AND A.REC_STATUS = R.REC_STATUS
    AND A.B1_PER_ID1 = R.B1_PER_ID1 AND A.B1_PER_ID2 = R.B1_PER_ID2 AND A.B1_PER_ID3 = R.B1_PER_ID3
    AND R.B1_CHECKBOX_DESC = 'Council District'
    
    LEFT OUTER JOIN BCHCKBOX H ON
        A.SERV_PROV_CODE = H.SERV_PROV_CODE AND A.REC_STATUS = H.REC_STATUS
    AND A.B1_PER_ID1 = H.B1_PER_ID1 AND A.B1_PER_ID2 = H.B1_PER_ID2 AND A.B1_PER_ID3 = H.B1_PER_ID3
    AND H.B1_CHECKBOX_DESC = 'Highly Hazardous'
    
    LEFT OUTER JOIN BCHCKBOX P ON
        A.SERV_PROV_CODE = P.SERV_PROV_CODE AND A.REC_STATUS = P.REC_STATUS
    AND A.B1_PER_ID1 = P.B1_PER_ID1 AND A.B1_PER_ID2 = P.B1_PER_ID2 AND A.B1_PER_ID3 = P.B1_PER_ID3
    AND P.B1_CHECKBOX_DESC = 'Property Maintenance'
    
    LEFT OUTER JOIN B3ADDRES D ON
        A.SERV_PROV_CODE = D.SERV_PROV_CODE AND A.REC_STATUS = D.REC_STATUS
    AND A.B1_PER_ID1 = D.B1_PER_ID1 AND A.B1_PER_ID2 = D.B1_PER_ID2 AND A.B1_PER_ID3 = D.B1_PER_ID3
    
    LEFT OUTER JOIN G6ACTION I ON
        A.SERV_PROV_CODE = I.SERV_PROV_CODE AND A.REC_STATUS = I.REC_STATUS
    AND A.B1_PER_ID1 = I.B1_PER_ID1 AND A.B1_PER_ID2 = I.B1_PER_ID2 AND A.B1_PER_ID3 = I.B1_PER_ID3

WHERE 1=1
    AND A.SERV_PROV_CODE = 'ATLANTA_GA'
    AND A.B1_PER_GROUP = 'Enforcement'
    AND A.B1_PER_TYPE = 'Complaint'
    AND A.REC_STATUS = 'A'
    AND A.B1_FILE_DD >= TO_DATE({?startDate})
    AND A.B1_FILE_DD < TO_DATE({?endDate})
    --AND A.B1_FILE_DD > TO_DATE(20180301, 'YYYYMMDD')
    
ORDER BY
    A.B1_ALT_ID