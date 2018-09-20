SELECT DISTINCT --*
        1
    ,   A.B1_ALT_ID     AS "Permit Number"
    ,   A.B1_APP_TYPE_ALIAS                     AS "Permit Type"
    ,   TO_CHAR(A.B1_FILE_DD, 'MM/DD/YYYY')     AS "Opened Date"
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
        )               AS "Address"
    ,   G.SD_STP_NUM    AS "Step Number"
    ,   G.SD_PRO_DES    AS "Workflow Task"
    ,   G.SD_APP_DES    AS "Workflow Status"
    ,   (CASE WHEN G.SD_IN_POSSESSION_TIME IS NOT NULL
             THEN (FIRST_VALUE(G.SD_IN_POSSESSION_TIME) OVER (PARTITION BY A.B1_ALT_ID,G.SD_PRO_DES ORDER BY G.SD_IN_POSSESSION_TIME DESC))
             ELSE -1
        END)                                    AS "MaxInPossessionTime"
                    
    ,   CASE
            WHEN G.GA_LNAME IS NULL OR G.GA_FNAME IS NULL
            THEN G.ASGN_FNAME || ' ' || G.ASGN_LNAME
            ELSE G.GA_FNAME || ' ' || G.GA_LNAME
        END             AS "Action By"
    ,   G.ASGN_FNAME || ' ' || G.ASGN_LNAME     AS "Assigned To"
    ,   TO_CHAR(G.G6_ASGN_DD, 'MM/DD/YYYY')     AS "Assigned Date"
    ,   TO_CHAR(G.G6_STAT_DD, 'MM/DD/YYYY')     AS "Status Date"
    ,   TO_CHAR(G.B1_DUE_DD,  'MM/DD/YYYY')     AS "Due Date"
    ,   CASE
            WHEN G.B1_DUE_DD - G.G6_STAT_DD >= 0
            THEN 'Statused SLA Complied'
            WHEN G.B1_DUE_DD - G.G6_STAT_DD < 0
            THEN 'Statused SLA Not Complied'
            WHEN G.G6_STAT_DD IS NULL
                AND G.SD_CHK_LV1 = 'N'
                AND G.SD_CHK_LV2 = 'Y'
            THEN 'Task deactivated by Supervisor override'
            WHEN SYSDATE - G.B1_DUE_DD > 0
                AND G.G6_STAT_DD IS NULL
            THEN 'Not Statused SLA Not Complied'
            WHEN SYSDATE - G.B1_DUE_DD <= 0
                AND G.G6_STAT_DD IS NULL
            THEN 'Not Statused SLA Complied'
            WHEN G.B1_DUE_DD IS NULL
            THEN 'No due date set'
            ELSE 'No info'
        END                 AS "SLA"

    ,   (   select bb.b1_checklist_comment
            from bchckbox bb
            where A.SERV_PROV_CODE = bb.serv_prov_code and A.B1_PER_ID1 = bb.b1_per_id1 and A.B1_PER_ID2 = bb.b1_per_id2 and A.B1_PER_ID3 = bb.b1_per_id3
            and bb.b1_checkbox_desc = 'Workstream'
            and bb.b1_checklist_comment != 'Express'
        )                   AS "Workstream"
    ,   G.SD_CHK_LV1
    ,   G.SD_CHK_LV2

FROM
    B1PERMIT A
    INNER JOIN GPROCESS G ON
        A.SERV_PROV_CODE = G.SERV_PROV_CODE
    AND A.B1_PER_ID1 = G.B1_PER_ID1
    AND A.B1_PER_ID2 = G.B1_PER_ID2
    AND A.B1_PER_ID3 = G.B1_PER_ID3
    AND A.REC_STATUS = 'A'
    AND (G.SD_CHK_LV1 = 'Y' OR G.SD_CHK_LV2 = 'Y')
    AND (G.SD_APP_DES IS NULL OR
         G.SD_APP_DES NOT IN (
        'Assigned',
        'Received for Review',
        'Admin Review',
        'In Review',
        'Returned by Applicant',
        'Pending',
        'Calc Permit Fee',
        'Calc Impact Fee',
        'Closed',
        'Red Lines Picked Up',
        'Void'
    )
    )
    
WHERE
        A.SERV_PROV_CODE = 'ATLANTA_GA'
    AND A.B1_PER_GROUP = 'Building'
    AND A.B1_APPL_STATUS NOT IN ('Void','Terminated')
--    AND A.B1_FILE_DD >= TO_DATE('2018-01-01', 'YYYY-MM-DD')
--    AND A.B1_FILE_DD < TO_DATE('2018-09-30', 'YYYY-MM-DD')+1
    AND A.B1_FILE_DD >= TO_DATE({?startDate})
    AND A.B1_FILE_DD <  TO_DATE({?endDate})+1
    AND G.SD_PRO_DES NOT IN (
        'Appeal Action',
        'Appeal Disposition',
        'Applicant Notified to Mark',
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
        'Field Arborist Reinspection',
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
--    AND A.B1_ALT_ID = 'BB-201804927'


ORDER BY
    A.B1_ALT_ID,
    G.SD_STP_NUM