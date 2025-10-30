WITH
    cte_submissions as (
        SELECT meta.meta_id, meta.meta_value, meta.meta_key, meta.entry_id, meta.date_created, entry.form_id
        FROM
            wpjm_frmt_form_entry_meta as meta
            INNER JOIN wpjm_frmt_form_entry as entry ON meta.entry_id = entry.entry_id
        WHERE
            entry.form_id = 4783
    )
SELECT t1.entry_id,
       t1.meta_value as 'fullName',
       t2.meta_value as email,
       t3.meta_value as 'phoneNo',
       t4.meta_value as 'orgName',
       t5.meta_value as 'requestSpeaking',
       t6.meta_value as 'collaborate',
       t7.meta_value as 'orgFile',
       t8.meta_value as 'mission',
       t9.meta_value as 'registeredAs',
       t1.date_created as 'registeredDate'
FROM
    cte_submissions as t1
    LEFT JOIN cte_submissions as t2 ON t1.entry_id = t2.entry_id
    and t2.meta_key = 'email-1'
    LEFT JOIN cte_submissions as t3 ON t1.entry_id = t3.entry_id
    and t3.meta_key = 'phone-1'
    LEFT JOIN cte_submissions as t4 ON t1.entry_id = t4.entry_id
    and t4.meta_key = 'name-3'
    LEFT JOIN cte_submissions as t5 ON t1.entry_id = t5.entry_id
    and t5.meta_key = 'radio-11'
    LEFT JOIN cte_submissions as t6 ON t1.entry_id = t6.entry_id
    and t6.meta_key = 'radio-13'
    LEFT JOIN cte_submissions as t7 ON t1.entry_id = t7.entry_id
    and t7.meta_key = 'upload-6'
    LEFT JOIN cte_submissions as t8 ON t1.entry_id = t8.entry_id
    and t8.meta_key = 'text-8'
    LEFT JOIN cte_submissions as t9 ON t1.entry_id = t9.entry_id
    and t9.meta_key = 'select-7'
WHERE
    t1.meta_key = 'name-1' AND (t9.meta_value = 'NGO or Foundation')
GROUP BY
    t1.entry_id;