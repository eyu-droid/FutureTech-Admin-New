import { ngoSubmission,
    localCompanySubmission,
    embassySubmission,
    internationalCompanySubmission,
    startupSubmission,
    ngoSubmissionById,
    localCompanySubmissionById,
    internationalCompanySubmissionById,
    embassySubmissionById,
    startupSubmissionById,
    eventAttendeeSubmission,
    conferenceAttendeeSubmission
} from '@prisma/client/sql';

import { db } from "../util/config/db";
import { CastBigIntFromJson } from '../util/parsejson';
import logger from '../util/logger';
import { FollowUpService } from './followup.service';

export class SubmissionService {
    private followUpService: FollowUpService;

    constructor() {
        this.followUpService = new FollowUpService();
    }

    private async sortByCompletedSubmissions(submissions: any[]) {
        const followUps = await this.followUpService.getAllFollowUp();
        if (!followUps || followUps.length === 0) {
            return submissions;
        }

        const completedFollowUps = followUps.filter((f) => f.status === 'Completed');
        const completedEntryIds = new Set(completedFollowUps.map((f) => f.entry_id));

        return submissions.sort((a, b) => {
            const aId = a && a.entry_id ? parseInt(a.entry_id.toString(), 10) : NaN;
            const bId = b && b.entry_id ? parseInt(b.entry_id.toString(), 10) : NaN;
            const aCompleted = completedEntryIds.has(aId);
            const bCompleted = completedEntryIds.has(bId);

            if (aCompleted === bCompleted) return 0;
            return aCompleted ? 1 : -1;
        });
    }

    async getNGOSubmissions() {
        try {
            const submissions = await db.$queryRawTyped(ngoSubmission());
            const sortedSub = await this.sortByCompletedSubmissions(submissions);
            return CastBigIntFromJson(sortedSub);
        } catch (err) {
            logger.error(String(err));
            return [];
        }
    }

    async getNGOSubmissionsById(entry_id: bigint) {
        try {
            const submission = await db.$queryRawTyped(ngoSubmissionById(Number(entry_id)));
            return CastBigIntFromJson(submission);
        } catch (err) {
            logger.error(String(err));
            return [];
        }
    }

    async getLocalCompanySubmissions() {
        try {
            const submissions = await db.$queryRawTyped(localCompanySubmission());
            const sortedSub = await this.sortByCompletedSubmissions(submissions);
            return CastBigIntFromJson(sortedSub);
        } catch (err) {
            logger.error(String(err));
            return [];
        }
    }

    async getLocalCompanySubmissionById(entry_id: bigint) {
        try {
            const submission = await db.$queryRawTyped(localCompanySubmissionById(Number(entry_id)));
            return CastBigIntFromJson(submission);
        } catch (err) {
            logger.error(String(err));
            return [];
        }
    }

    async getInternationalCompanySubmissions() {
        try {
            const submissions = await db.$queryRawTyped(internationalCompanySubmission());
            const sortedSub = await this.sortByCompletedSubmissions(submissions);
            return CastBigIntFromJson(sortedSub);
        } catch (err) {
            logger.error(String(err));
            return [];
        }
    }

    async getInternationalCompanySubmission(entry_id: bigint) {
        try {
            const submission = await db.$queryRawTyped(internationalCompanySubmissionById(Number(entry_id)));
            return CastBigIntFromJson(submission);
        } catch (err) {
            logger.error(String(err));
            return [];
        }
    }

    async getEventAttendeeSubmissions() {
        try {
            const submissions = await db.$queryRawTyped(eventAttendeeSubmission());
            return CastBigIntFromJson(submissions);
        } catch (err) {
            logger.error(String(err));
            return [];
        }
    }

    async getConferenceAttendeeSubmissions() {
        try {
            const submissions = await db.$queryRawTyped(conferenceAttendeeSubmission());
            return CastBigIntFromJson(submissions);
        } catch (err) {
            logger.error(String(err));
            return [];
        }
    }

    async getEmabassySubmissions() {
        try {
            const submissions = await db.$queryRawTyped(embassySubmission());
            const sortedSub = await this.sortByCompletedSubmissions(submissions);
            return CastBigIntFromJson(sortedSub);
        } catch (err) {
            logger.error(String(err));
            return [];
        }
    }

    async getEmabassySubmissionsById(entry_id: bigint) {
        try {
            const submission = await db.$queryRawTyped(embassySubmissionById(Number(entry_id)));
            return CastBigIntFromJson(submission);
        } catch (err) {
            logger.error(String(err));
            return [];
        }
    }

    // startup list
    async getStartupSubmissions() {
        try {
            const submissions = await db.$queryRawTyped(startupSubmission());
            const sortedSub = await this.sortByCompletedSubmissions(submissions);
            return CastBigIntFromJson(sortedSub);
        } catch (err) {
            logger.error(String(err));
            return [];
        }
    }

    // Single canonical implementation for ById with logging + Number conversion
    async getStartupSubmissionsById(entry_id: bigint) {
        try {
            logger.info(`getStartupSubmissionsById (service) called with entry_id=${entry_id}`);
            const idNum = Number(entry_id);
            const submissions = await db.$queryRawTyped(startupSubmissionById(idNum));
            const result = CastBigIntFromJson(submissions);
            const count = Array.isArray(result) ? result.length : (result ? 1 : 0);
            logger.info(`getStartupSubmissionsById (service) returned count=${count} for entry_id=${entry_id}`);
            return result;
        } catch (err) {
            logger.error(String(err));
            throw err;
        }
    }

    async deleteNGOSubmission(entry_id: bigint) {
        try {
            return await db.$transaction([
                db.wpjm_frmt_form_entry_meta.deleteMany({ where: { entry_id } }),
                db.wpjm_frmt_form_entry.delete({ where: { entry_id } })
            ]);
        } catch (err) {
            logger.error(String(err));
            throw err;
        }
    }

    async deleteLocalCompanySubmission(entry_id: bigint) {
        try {
            return await db.$transaction([
                db.wpjm_frmt_form_entry_meta.deleteMany({ where: { entry_id } }),
                db.wpjm_frmt_form_entry.delete({ where: { entry_id } })
            ]);
        } catch (err) {
            logger.error(String(err));
            throw err;
        }
    }

    async deleteEmbassySubmission(entry_id: bigint) {
        try {
            return await db.$transaction([
                db.wpjm_frmt_form_entry_meta.deleteMany({ where: { entry_id } }),
                db.wpjm_frmt_form_entry.delete({ where: { entry_id } })
            ]);
        } catch (err) {
            logger.error(String(err));
            throw err;
        }
    }

    async deleteInternationalCompanySubmission(entry_id: bigint) {
        try {
            return await db.$transaction([
                db.wpjm_frmt_form_entry_meta.deleteMany({ where: { entry_id } }),
                db.wpjm_frmt_form_entry.delete({ where: { entry_id } })
            ]);
        } catch (err) {
            logger.error(String(err));
            throw err;
        }
    }

    async deleteStartupSubmission(entry_id: bigint) {
        try {
            return await db.$transaction([
                db.wpjm_frmt_form_entry_meta.deleteMany({ where: { entry_id } }),
                db.wpjm_frmt_form_entry.delete({ where: { entry_id } })
            ]);
        } catch (err) {
            logger.error(String(err));
            throw err;
        }
    }

    async deleteEventSubmission(entry_id: bigint) {
        try {
            return await db.$transaction([
                db.wpjm_frmt_form_entry_meta.deleteMany({ where: { entry_id } }),
                db.wpjm_frmt_form_entry.delete({ where: { entry_id } })
            ]);
        } catch (err) {
            logger.error(String(err));
            throw err;
        }
    }

    async deleteConferenceSubmission(entry_id: bigint) {
        try {
            return await db.$transaction([
                db.wpjm_frmt_form_entry_meta.deleteMany({ where: { entry_id } }),
                db.wpjm_frmt_form_entry.delete({ where: { entry_id } })
            ]);
        } catch (err) {
            logger.error(String(err));
            throw err;
        }
    }

    async deleteSubmissions(type: string, entry_ids: (string | number)[]) {
        const entryIdsAsBigInt = entry_ids.map(id => BigInt(id));

        try {
            return await db.$transaction([
                db.wpjm_frmt_form_entry_meta.deleteMany({ where: { entry_id: { in: entryIdsAsBigInt } } }),
                db.wpjm_frmt_form_entry.deleteMany({ where: { entry_id: { in: entryIdsAsBigInt } } })
            ]);
        } catch (err) {
            logger.error(String(err));
            throw err;
        }
    }

    async importEventSubmissions(data: any[]) {
        const formId = 45;

        try {
            for (const item of data) {
                await db.$transaction(async (tx) => {
                    const newEntry = await tx.wpjm_frmt_form_entry.create({
                        data: {
                            form_id: formId,
                            entry_type: 'submission',
                            date_created: new Date(item['Registered Date'])
                        }
                    });

                    const entryId = newEntry.entry_id;

                    await tx.wpjm_frmt_form_entry_meta.createMany({
                        data: [
                            {
                                entry_id: entryId,
                                meta_key: 'text-1',
                                meta_value: item['Full Name']
                            },
                            {
                                entry_id: entryId,
                                meta_key: 'email-1',
                                meta_value: item['Email']
                            },
                            {
                                entry_id: entryId,
                                meta_key: 'date-1',
                                meta_value: item['Registered Date']
                            }
                        ]
                    });
                });
            }
        } catch (err) {
            logger.error(String(err));
            throw err;
        }
    }
}