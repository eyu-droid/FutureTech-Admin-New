WITH
    cte_submissions AS (
        SELECT meta.meta_id, meta.meta_value, meta.meta_key, meta.entry_id, meta.date_created, entry.form_id
        FROM wpjm_frmt_form_entry_meta AS meta
        INNER JOIN wpjm_frmt_form_entry AS entry ON meta.entry_id = entry.entry_id
        WHERE entry.form_id = 4783
    )
SELECT
    t1.entry_id,
    t1.meta_value AS fullName,
    t2.meta_value AS email,
    t3.meta_value AS phoneNo,
    t4.meta_value AS startupName,
    t5.meta_value AS industry,
    t6.meta_value AS govId,
    t7.meta_value AS booth,
    t8.meta_value AS reqMentorship,
    t9.meta_value AS socialWebsite,
    t10.meta_value AS stage,
    t11.meta_value AS pitchdeck,
    t12.meta_value AS appliedPegasus,
    t13.meta_value AS registeredAs,
    t1.date_created AS registeredDate
FROM cte_submissions AS t1
LEFT JOIN cte_submissions AS t2 ON t1.entry_id = t2.entry_id AND t2.meta_key = 'email-1'
LEFT JOIN cte_submissions AS t3 ON t1.entry_id = t3.entry_id AND t3.meta_key = 'phone-1'
LEFT JOIN cte_submissions AS t4 ON t1.entry_id = t4.entry_id AND t4.meta_key = 'text-11'
LEFT JOIN cte_submissions AS t5 ON t1.entry_id = t5.entry_id AND t5.meta_key = 'checkbox-2'
LEFT JOIN cte_submissions AS t6 ON t1.entry_id = t6.entry_id AND t6.meta_key = 'upload-11'
LEFT JOIN cte_submissions AS t7 ON t1.entry_id = t7.entry_id AND t7.meta_key = 'radio-9'
LEFT JOIN cte_submissions AS t8 ON t1.entry_id = t8.entry_id AND t8.meta_key = 'radio-10'
LEFT JOIN cte_submissions AS t9 ON t1.entry_id = t9.entry_id AND t9.meta_key = 'url-3'
LEFT JOIN cte_submissions AS t10 ON t1.entry_id = t10.entry_id AND t10.meta_key = 'checkbox-3'
LEFT JOIN cte_submissions AS t11 ON t1.entry_id = t11.entry_id AND t11.meta_key = 'upload-5'
LEFT JOIN cte_submissions AS t12 ON t1.entry_id = t12.entry_id AND t12.meta_key = 'radio-8'
LEFT JOIN cte_submissions AS t13 ON t1.entry_id = t13.entry_id AND t13.meta_key = 'radio-14'
WHERE
    t1.meta_key = 'name-1'
    AND EXISTS (
        SELECT 1 FROM cte_submissions tX
        WHERE tX.entry_id = t1.entry_id
          AND LOWER(TRIM(tX.meta_value)) = 'startup'
    )
GROUP BY t1.entry_id
ORDER BY t1.date_created DESC;
