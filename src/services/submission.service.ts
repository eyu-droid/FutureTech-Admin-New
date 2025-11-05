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
} from '@prisma/client/sql'

import { db } from "../util/config/db";
import { CastBigIntFromJson } from '../util/parsejson';
import logger from '../util/logger';
import { FollowUpService } from './followup.service';

export class SubmissionService {
    private followUpService;
    constructor() { 
        this.followUpService = new FollowUpService();
        
    }
    async sortByCompletedSubmissions(submissions:any[]){
        const followUps = await this.followUpService.getAllFollowUp();
        if(followUps?.length === 0 || !followUps){
                return submissions;
            }
        const completedFollowUps = followUps.filter((f) => f.status === 'Completed');
            // Create a Set of entry_ids with completed followups for quick lookup
            const completedEntryIds = new Set(completedFollowUps.map((f) => f.entry_id));
            // Sort submissions: those with completed followups come last
            return submissions.sort((a, b) => {
                
                const aCompleted = completedEntryIds.has(parseInt(a.entry_id.toString()));
                const bCompleted = completedEntryIds.has(parseInt(b.entry_id.toString()));
               
                if (aCompleted === bCompleted) return 0;
                return aCompleted ? 1 : -1;
            });
    }
    async getNGOSubmissions() {
        try{
            const submissions = await db.$queryRawTyped(ngoSubmission());
            const sortedSub = await this.sortByCompletedSubmissions(submissions);
            return CastBigIntFromJson(sortedSub)

        }catch(err){
            logger.error(err+'');
        }


    }

    async getNGOSubmissionsById(entry_id: bigint) {
        try{
            const submission = await db.$queryRawTyped(ngoSubmissionById(entry_id));
            return CastBigIntFromJson(submission);

        }catch(err){
            logger.error(err+'');
        }
    }

    async getLocalCompanySubmissions() {
        try{
            const submissions = await db.$queryRawTyped(localCompanySubmission());
            const sortedSub = await this.sortByCompletedSubmissions(submissions);
            return CastBigIntFromJson(sortedSub)

        }catch(err){
            logger.error(err+'');
        }


    }
    async getLocalCompanySubmissionById(entry_id: bigint) {
        try{
            const submission = await db.$queryRawTyped(localCompanySubmissionById(entry_id));
            return CastBigIntFromJson(submission);

        }catch(err){
            logger.error(err+'');
        }
    }
    
    async getInternationalCompanySubmissions() {
        try{
            const submissions = await db.$queryRawTyped(internationalCompanySubmission());
            const sortedSub = await this.sortByCompletedSubmissions(submissions);
            return CastBigIntFromJson(sortedSub)

        }catch(err){
            logger.error(err+'');
        }


    }
    async getInternationalCompanySubmission(entry_id: bigint) {
        try{
            const submission = await db.$queryRawTyped(internationalCompanySubmissionById(entry_id));
            
            return CastBigIntFromJson(submission)

        }catch(err){
            logger.error(err+'');
        }


    }

    async getEventAttendeeSubmissions(){
        try{
            const submissions = await db.$queryRawTyped(eventAttendeeSubmission());
            return CastBigIntFromJson(submissions);
        }catch(err){
            logger.error(err+'');
        }
    }
    async getConferenceAttendeeSubmissions(){
        try{
            const submissions = await db.$queryRawTyped(conferenceAttendeeSubmission());
            
            return CastBigIntFromJson(submissions);
        }catch(err){
            logger.error(err+'');
        }
    }
    async getEmabassySubmissions() {
        try{
            const submissions = await db.$queryRawTyped(embassySubmission());
            const sortedSub = await this.sortByCompletedSubmissions(submissions);
            return CastBigIntFromJson(sortedSub)

        }catch(err){
            logger.error(err+'');
        }


    }
    async getEmabassySubmissionsById(entry_id: bigint) {
        try{
            const submission = await db.$queryRawTyped(embassySubmissionById(entry_id));
            return CastBigIntFromJson(submission)

        }catch(err){
            logger.error(err+'');
        }


    }
    async getStartupSubmissions() {
        try{
            const submissions = await db.$queryRawTyped(startupSubmission());
            const sortedSub = await this.sortByCompletedSubmissions(submissions);
            return CastBigIntFromJson(sortedSub)

        }catch(err){
            logger.error(err+'');
        }


    }
    async getStartupSubmissionsById(entry_id:bigint) {
        try{
            const submissions = await db.$queryRawTyped(startupSubmissionById(entry_id));
            return CastBigIntFromJson(submissions)

        }catch(err){
            logger.error(err+'');
        }


    }

    async deleteNGOSubmission(entry_id: bigint) {
        try {
            return await db.$transaction([
                db.wpjm_frmt_form_entry_meta.deleteMany({ where: { entry_id } }),
                db.wpjm_frmt_form_entry.delete({ where: { entry_id } })
            ]);
        } catch (err) {
            logger.error(err + '');
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
            logger.error(err + '');
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
            logger.error(err + '');
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
            logger.error(err + '');
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
            logger.error(err + '');
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
            logger.error(err + '');
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
            logger.error(err + '');
            throw err;
        }
    }
}