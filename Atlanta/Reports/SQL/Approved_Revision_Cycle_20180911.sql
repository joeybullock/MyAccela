SELECT DISTINCT A.B1_ALT_ID                             AS "PermitNumber"
            ,   (SELECT
                    CASE WHEN B3A.B1_HSE_NBR_START IS NOT NULL THEN B3A.B1_HSE_NBR_START||' ' ELSE '' END||
                    CASE WHEN B3A.B1_STR_NAME IS NOT NULL THEN B3A.B1_STR_NAME||' ' ELSE '' END ||
                    CASE WHEN B3A.B1_STR_SUFFIX IS NOT NULL THEN B3A.B1_STR_SUFFIX||' ' ELSE '' END ||
                    CASE WHEN B3A.B1_STR_SUFFIX_DIR IS NOT NULL THEN B3A.B1_STR_SUFFIX_DIR||' ' ELSE '' END ||
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
            ,   TO_CHAR(A.B1_FILE_DD,'MM/DD/YYYY')      AS "OpenedDate"
            ,   A.B1_APPL_STATUS                        AS "ApplicationStatus"
            ,   G.SD_PRO_DES                            AS "WorkflowTask"
            
            ,   (CASE WHEN G.SD_APP_DES IN('Accepted','Approved','Approved with Conditions')
                     THEN (FIRST_VALUE(G.SD_IN_POSSESSION_TIME) OVER (PARTITION BY A.B1_ALT_ID,G.SD_PRO_DES,G.SD_APP_DES ORDER BY G.SD_IN_POSSESSION_TIME DESC))
                     ELSE -1
                END)                                    AS "MaxInPossessionTime"
                    
            ,   (CASE
                    WHEN LAST_VALUE(G.SD_APP_DES)
                        OVER (PARTITION BY G.SD_PRO_DES, A.B1_ALT_ID ORDER BY G.SD_IN_POSSESSION_TIME ASC
                        RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
                        IN ('Accepted','Approved','Approved with Conditions') THEN 'Approved'
                    WHEN LAST_VALUE(G.SD_APP_DES)
                        OVER (PARTITION BY G.SD_PRO_DES, A.B1_ALT_ID ORDER BY G.SD_IN_POSSESSION_TIME ASC
                        RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
                        IN ('Denied','Revisions Required','Appl Notified-Revisions Reqd') THEN 'Not Approved'
                    ELSE LAST_VALUE(G.SD_APP_DES)
                        OVER (PARTITION BY G.SD_PRO_DES, A.B1_ALT_ID ORDER BY G.SD_IN_POSSESSION_TIME ASC
                        RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
                END)                                    AS "WorkflowStatus"
            ,   TO_CHAR(LAST_VALUE(G.SD_APP_DD)
                        OVER (PARTITION BY G.SD_PRO_DES, A.B1_ALT_ID ORDER BY G.SD_IN_POSSESSION_TIME ASC
                        RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING),'MM/DD/YYYY')
                                                        AS "StatusDate"
                
            ,   (CASE
                    WHEN NTH_VALUE(G.SD_APP_DES,1)
                        OVER (PARTITION BY G.SD_PRO_DES, A.B1_ALT_ID ORDER BY G.SD_IN_POSSESSION_TIME ASC
                        RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
                        IN ('Accepted','Approved','Approved with Conditions') THEN '1st Round Approved'
                    WHEN NTH_VALUE(G.SD_APP_DES,2)
                        OVER (PARTITION BY G.SD_PRO_DES, A.B1_ALT_ID ORDER BY G.SD_IN_POSSESSION_TIME ASC
                        RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
                        IN ('Accepted','Approved','Approved with Conditions') THEN '2nd Round Approved'
                    WHEN LAST_VALUE(G.SD_APP_DES)
                        OVER (PARTITION BY G.SD_PRO_DES, A.B1_ALT_ID ORDER BY G.SD_IN_POSSESSION_TIME ASC
                        RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
                        IN ('Denied','No Review Required') THEN 'Not Approved'
                    WHEN LAST_VALUE(G.SD_APP_DES)
                        OVER (PARTITION BY G.SD_PRO_DES, A.B1_ALT_ID ORDER BY G.SD_IN_POSSESSION_TIME ASC
                        RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
                        NOT IN ('Accepted','Approved','Approved with Conditions') THEN 'Pending'
                    ELSE '3rd or More Round Approved'
                END)                                    AS "ApprovalRound"

            ,   G.G6_ISS_FNAME || ' ' || G.G6_ISS_LNAME AS "Reviewer"
            ,   C.B1_CHECKLIST_COMMENT                  AS "Workstream"
    /*
            ,   NTH_VALUE((CASE WHEN G.SD_APP_DES IN ('Denied','Revisions Required','Appl Notified-Revisions Reqd') THEN 'Revision Required' END),1) OVER (PARTITION BY G.SD_PRO_DES ORDER BY G.GPROCESS_HISTORY_SEQ_NBR ASC) AS "First Revision Cycle",
            ,   NTH_VALUE((CASE WHEN G.SD_APP_DES IN ('Accepted','Approved','Approved with Conditions') THEN 'Approved on 2nd Cycle' END),3) OVER (PARTITION BY G.SD_PRO_DES ORDER BY G.GPROCESS_HISTORY_SEQ_NBR ASC) AS "Second Approved Cycle",
            ,   NTH_VALUE((CASE WHEN G.SD_APP_DES IN ('Denied','Revisions Required','Appl Notified-Revisions Reqd') THEN 'Revision Required' END),3) OVER (PARTITION BY G.SD_PRO_DES ORDER BY G.GPROCESS_HISTORY_SEQ_NBR ASC) AS "Second Revision Cycle",
            ,   NTH_VALUE((CASE WHEN G.SD_APP_DES IN ('Accepted','Approved','Approved with Conditions') THEN 'Approved on 3rd Cycle' END),5) OVER (PARTITION BY G.SD_PRO_DES ORDER BY G.GPROCESS_HISTORY_SEQ_NBR ASC) AS "Third Approved Cycle",
            ,   NTH_VALUE((CASE WHEN G.SD_APP_DES IN ('Denied','Revisions Required','Appl Notified-Revisions Reqd') THEN 'Revision Required' END),5) OVER (PARTITION BY G.SD_PRO_DES ORDER BY G.GPROCESS_HISTORY_SEQ_NBR ASC) AS "Third Revision Cycle",
    */
    
    --      ,   TO_CHAR(G.REC_DATE,'MM/DD/YYYY HH24:MI:SS') AS "Status Date"
    --      ,   G.GPROCESS_HISTORY_SEQ_NBR
    
FROM
    B1PERMIT A INNER JOIN
    GPROCESS_HISTORY G ON
        A.SERV_PROV_CODE = G.SERV_PROV_CODE
    AND A.B1_PER_ID1 = G.B1_PER_ID1
    AND A.B1_PER_ID2 = G.B1_PER_ID2
    AND A.B1_PER_ID3 = G.B1_PER_ID3
    AND G.REC_STATUS = 'A'
    AND G.SD_APP_DES NOT IN (
        'Assigned',
        'Received for Review',
        'Admin Review',
        'In Review',
        'Returned by Applicant',
        'Pending',
        'Calc Permit Fee',
        'Calc Impact Fee',
        'Red Lines Picked Up',
        'Void'
    )
    
    LEFT OUTER JOIN BCHCKBOX C ON
        A.SERV_PROV_CODE = C.SERV_PROV_CODE
    AND A.B1_PER_ID1 = C.B1_PER_ID1
    AND A.B1_PER_ID2 = C.B1_PER_ID2
    AND A.B1_PER_ID3 = C.B1_PER_ID3
    AND C.B1_CHECKBOX_DESC = 'Workstream'
    AND C.REC_STATUS = 'A'
    
WHERE
        A.SERV_PROV_CODE = 'ATLANTA_GA'
    AND A.B1_PER_GROUP = 'Building'
--    AND A.B1_FILE_DD >= TO_DATE('2018-04-01', 'YYYY-MM-DD')
--    AND A.B1_FILE_DD < TO_DATE('2018-04-30', 'YYYY-MM-DD')+1
    AND A.B1_FILE_DD >= TO_DATE({?startDate})
    AND A.B1_FILE_DD <  TO_DATE({?endDate})+1
    AND A.B1_APPL_STATUS NOT IN ('Void','Terminated')
    AND G.SD_PRO_DES NOT IN (
        'Appeal Action',
        'Appeal Disposition',
        'Application Intake',
        'Arborist Preliminary Review',
        'Assess Impact Fee',
        'Building Inspection',
        'Case Intake',
        'Certificate of Occupancy',
        'Close',
        'Closed',
        'Closure',
        'Complaint Intake',
        'Court',
        'Data Coordination',
        'Electrical Inspection',
        'Field Arborist Inspection',
        'Field Arborist Yellow Posting',
        'Final Plan Coordination',
        'Follow Up Inspection',
        'Generate Application',
        'Generate Notice-Citation',
        'Grease Trap Inspection',
        'Impact Fee Application Intake',
        'Inspection',
        'Initial Inspection',
        'Issue Invoice',
        'Issue Letter',
        'Issue Permit',
        'Mechanical Inspection',
        'Orange Posting',
        'Plan Coordination',
        'Plan Coordinator',
        'Plan Distribution',
        'Plans Distribution',
        'Plans Received',
        'Plumbing Inspection',
        'Pre-Court Inspection',
        'QCR Intake',
        'Reinspection',
        'Request Intake',
        'Research Distribution',
        'Research Intake',
        'Sheriff Mailing',
        'Site Development Inspection',
        'TCC Hearing Outcome',
        'Terminated',
        'Traffic Inspection',
        'Yellow Posting Request',
        'Zoning Inspection'
    )
    AND A.REC_STATUS = 'A'
--  AND A.B1_ALT_ID = 'BB-201804232'

GROUP BY
    A.B1_ALT_ID,
    A.B1_FILE_DD,
    A.B1_APPL_STATUS,
    G.SD_PRO_DES,
    G.SD_APP_DES,
    G.SD_APP_DD,
    G.SD_IN_POSSESSION_TIME,
    C.B1_CHECKLIST_COMMENT,
    G.G6_ISS_FNAME,
    G.G6_ISS_LNAME,
    A.SERV_PROV_CODE,
    A.B1_PER_ID1,
    A.B1_PER_ID2,
    A.B1_PER_ID3,
    A.REC_STATUS,
    G.GPROCESS_HISTORY_SEQ_NBR
    
ORDER BY
    A.B1_ALT_ID --, G.GPROCESS_HISTORY_SEQ_NBR