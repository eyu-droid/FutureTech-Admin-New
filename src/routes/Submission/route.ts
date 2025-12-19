import { Router } from "express";
import { SubmissionsController } from "../../controllers/submissions.controller";
import AuthAPIKey from "../../middlewares/authAPIKey";
import { db } from "../../util/config/db";
import { CastBigIntFromJson } from "../../util/parsejson";

const submissionRoute = Router();
const submissionController = new SubmissionsController();

submissionRoute.get('/submission/ngo', AuthAPIKey, (req, res) => submissionController.getNGOSubmissions(req, res));
submissionRoute.get('/submission/ngo/:id', AuthAPIKey, (req, res) => submissionController.getNGOSubmissionById(req, res));
submissionRoute.get('/submission/localcompany', AuthAPIKey, (req, res) => submissionController.getLocalCompanySubmissions(req, res));
submissionRoute.get('/submission/localcompany/:id', AuthAPIKey, (req, res) => submissionController.getLocalCompanySubmissionById(req, res));
submissionRoute.get('/submission/embassy', AuthAPIKey, (req, res) => submissionController.getEmbassySubmissions(req, res));
submissionRoute.get('/submission/embassy/:id', AuthAPIKey, (req, res) => submissionController.getEmbassySubmissionsById(req, res));
submissionRoute.get('/submission/internationalcompany', AuthAPIKey, (req, res) => submissionController.getInternationalCompanySubmissions(req, res));
submissionRoute.get('/submission/internationalcompany/:id', AuthAPIKey, (req, res) => submissionController.getInternationalCompanySubmissionById(req, res));
submissionRoute.get('/submission/startup', AuthAPIKey, (req, res) => submissionController.getStartupSubmissions(req, res));
submissionRoute.get('/submission/startup/:id', AuthAPIKey, (req, res) => submissionController.getStartupSubmissionsById(req, res));
submissionRoute.get('/submission/event', AuthAPIKey, (req, res) => submissionController.getEventSubmissions(req, res));
submissionRoute.get('/submission/conference', AuthAPIKey, (req, res) => submissionController.getConferenceSubmissions(req, res));

submissionRoute.delete('/submission/ngo/:id', AuthAPIKey, (req, res) => submissionController.deleteNGOSubmission(req, res));
submissionRoute.delete('/submission/localcompany/:id', AuthAPIKey, (req, res) => submissionController.deleteLocalCompanySubmission(req, res));
submissionRoute.delete('/submission/embassy/:id', AuthAPIKey, (req, res) => submissionController.deleteEmbassySubmission(req, res));
submissionRoute.delete('/submission/internationalcompany/:id', AuthAPIKey, (req, res) => submissionController.deleteInternationalCompanySubmission(req, res));
submissionRoute.delete('/submission/startup/:id', AuthAPIKey, (req, res) => submissionController.deleteStartupSubmission(req, res));
submissionRoute.delete('/submission/event/:id', AuthAPIKey, (req, res) => submissionController.deleteEventSubmission(req, res));
submissionRoute.delete('/submission/conference/:id', AuthAPIKey, (req, res) => submissionController.deleteConferenceSubmission(req, res));

submissionRoute.post('/submission/:type/delete', AuthAPIKey, (req, res) => submissionController.deleteSubmissions(req, res));
submissionRoute.post('/submission/event/import', AuthAPIKey, (req, res) => submissionController.importEventSubmissions(req, res));
submissionRoute.get('/submission/stat', AuthAPIKey, (req, res) => submissionController.getSubmissionStat(req, res));

/*
  Debug route: inspect submissions by meta_key values and return counts + up to 5 samples per value.

  Usage:
    GET /submission/debug/submissions-inspect
    Optional query:
      form_id=4783      -> restrict queries to a specific form id
      meta_key=select-7 -> override which meta_key to inspect (defaults to 'select-7')

  Response:
    {
      message: 'ok',
      meta_key,
      form_id,
      summary: [ { meta_value, count, samples: [ { entry_id, fullName, email } ] } ],
      select3: [ { meta_value, count } ... ]
    }
*/
submissionRoute.get('/debug/submissions-inspect', AuthAPIKey, async (req, res) => {
  // Keep these untyped in the signature to avoid parser issues in mixed toolchains
  const formId = req.query && req.query.form_id ? Number(req.query.form_id) : null;
  const metaKey = String((req.query && req.query.meta_key) || 'select-7').trim();

  try {
    // 1) counts per meta_value (default or restricted by form)
    const countsQuery = formId
      ? await db.$queryRaw<any[]>`
          SELECT meta.meta_value AS meta_value, COUNT(DISTINCT meta.entry_id) AS count
          FROM wpjm_frmt_form_entry_meta AS meta
          INNER JOIN wpjm_frmt_form_entry AS entry ON meta.entry_id = entry.entry_id
          WHERE meta.meta_key = ${metaKey} AND entry.form_id = ${formId}
          GROUP BY meta.meta_value
          ORDER BY count DESC
        `
      : await db.$queryRaw<any[]>`
          SELECT meta_value AS meta_value, COUNT(DISTINCT entry_id) AS count
          FROM wpjm_frmt_form_entry_meta
          WHERE meta_key = ${metaKey}
          GROUP BY meta_value
          ORDER BY count DESC
        `;

    // 2) For each meta_value gather up to 5 samples
    const summary: any[] = [];
    for (const row of (countsQuery || []) as any[]) {
      const value = row && row.meta_value;
      if (value == null) continue;

      const samples = formId
        ? await db.$queryRaw<any[]>`
            SELECT e.entry_id,
              (SELECT m2.meta_value FROM wpjm_frmt_form_entry_meta m2 WHERE m2.entry_id = e.entry_id AND m2.meta_key = 'name-1' LIMIT 1) AS fullName,
              (SELECT m3.meta_value FROM wpjm_frmt_form_entry_meta m3 WHERE m3.entry_id = e.entry_id AND m3.meta_key = 'email-1' LIMIT 1) AS email
            FROM wpjm_frmt_form_entry AS e
            INNER JOIN wpjm_frmt_form_entry_meta AS m ON e.entry_id = m.entry_id
            WHERE m.meta_key = ${metaKey} AND m.meta_value = ${value} AND e.form_id = ${formId}
            GROUP BY e.entry_id
            ORDER BY e.date_created DESC
            LIMIT 5
          `
        : await db.$queryRaw<any[]>`
            SELECT e.entry_id,
              (SELECT m2.meta_value FROM wpjm_frmt_form_entry_meta m2 WHERE m2.entry_id = e.entry_id AND m2.meta_key = 'name-1' LIMIT 1) AS fullName,
              (SELECT m3.meta_value FROM wpjm_frmt_form_entry_meta m3 WHERE m3.entry_id = e.entry_id AND m3.meta_key = 'email-1' LIMIT 1) AS email
            FROM wpjm_frmt_form_entry AS e
            INNER JOIN wpjm_frmt_form_entry_meta AS m ON e.entry_id = m.entry_id
            WHERE m.meta_key = ${metaKey} AND m.meta_value = ${value}
            GROUP BY e.entry_id
            ORDER BY e.date_created DESC
            LIMIT 5
          `;

      summary.push({
        meta_value: value,
        count: Number(row.count || 0),
        samples: samples || []
      });
    }

    // 3) Also provide select-3 breakdown (event/conference)
    const select3Key = 'select-3';
    const select3Counts = formId
      ? await db.$queryRaw<any[]>`
          SELECT meta.meta_value AS meta_value, COUNT(DISTINCT meta.entry_id) AS count
          FROM wpjm_frmt_form_entry_meta AS meta
          INNER JOIN wpjm_frmt_form_entry AS entry ON meta.entry_id = entry.entry_id
          WHERE meta.meta_key = ${select3Key} AND entry.form_id = ${formId}
          GROUP BY meta.meta_value
          ORDER BY count DESC
        `
      : await db.$queryRaw<any[]>`
          SELECT meta_value AS meta_value, COUNT(DISTINCT entry_id) AS count
          FROM wpjm_frmt_form_entry_meta
          WHERE meta_key = ${select3Key}
          GROUP BY meta_value
          ORDER BY count DESC
        `;

    return res.status(200).json({
      message: 'ok',
      meta_key: metaKey,
      form_id: formId,
      summary: CastBigIntFromJson(summary),
      select3: CastBigIntFromJson(select3Counts)
    });
  } catch (err: any) {
    // simple, safe message extraction
    const message = err && err.message ? String(err.message) : 'internal error';
    return res.status(500).json({ message });
  }
});

export default submissionRoute;