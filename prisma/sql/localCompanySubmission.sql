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
	   t4.meta_value as 'position',
	   t5.meta_value as 'companyName',
       t6.meta_value as 'companyProfile',
       t7.meta_value as 'address',
       t8.meta_value as 'companyWebsite',
       t9.meta_value as 'areaOfInterest',
       t10.meta_value as 'companyLicense',
       t11.meta_value as 'sponsorShip',
       t12.meta_value as 'directoryListed',
       t13.meta_value as 'interest',
       t14.meta_value as 'numberOfAttendee',
	   t15.meta_value as 'registerAs',
       t16.meta_value as 'companyEmail',
	   t1.date_created as 'registeredDate'
FROM
    cte_submissions as t1
    LEFT JOIN cte_submissions as t2 ON t1.entry_id = t2.entry_id
    and t2.meta_key = 'email-1'
    LEFT JOIN cte_submissions as t3 ON t1.entry_id = t3.entry_id
    and t3.meta_key = 'phone-1'
    LEFT JOIN cte_submissions as t4 ON t1.entry_id = t4.entry_id
    and t4.meta_key = 'text-4'
    LEFT JOIN cte_submissions as t5 ON t1.entry_id = t5.entry_id
    and t5.meta_key = 'text-7'
    LEFT JOIN cte_submissions as t6 ON t1.entry_id = t6.entry_id
    and t6.meta_key = 'upload-9'
    LEFT JOIN cte_submissions as t7 ON t1.entry_id = t7.entry_id
    and t7.meta_key = 'address-2'
    LEFT JOIN cte_submissions as t8 ON t1.entry_id = t8.entry_id
    and t8.meta_key = 'url-2'
    LEFT JOIN cte_submissions as t9 ON t1.entry_id = t9.entry_id
    and t9.meta_key = 'text-9'
    LEFT JOIN cte_submissions as t10 ON t1.entry_id = t10.entry_id
    and t10.meta_key = 'upload-8'
    LEFT JOIN cte_submissions as t11 ON t1.entry_id = t11.entry_id
    and t11.meta_key = 'radio-6'
    LEFT JOIN cte_submissions as t12 ON t1.entry_id = t12.entry_id
    and t12.meta_key = 'radio-7'
    LEFT JOIN cte_submissions as t13 ON t1.entry_id = t13.entry_id
    and t13.meta_key = 'checkbox-1'
    LEFT JOIN cte_submissions as t14 ON t1.entry_id = t14.entry_id
    and t14.meta_key = 'number-3'
    LEFT JOIN cte_submissions as t15 ON t1.entry_id = t15.entry_id
    AND t15.meta_key = 'select-7'
    LEFT JOIN cte_submissions as t16 ON t1.entry_id = t16.entry_id
    AND t16.meta_key = 'email-2'
WHERE
    t1.meta_key = 'name-1' AND (t15.meta_value = 'Local Company')
GROUP BY
    t1.entry_id;