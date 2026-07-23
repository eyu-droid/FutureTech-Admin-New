import { Request, Response } from "express";
import { SubmissionService } from "../services/submission.service";
import { calculateChange } from "../util/calculateStat";

export class SubmissionsController {

    private submissionService: SubmissionService;
    constructor() {
        this.submissionService = new SubmissionService();
    }

    async getNGOSubmissions(req: Request, res: Response) {

        const submissions = await this.submissionService.getNGOSubmissions();
        res.status(200).json({ message: 'Submission fetched', data: submissions });
    }


    async getNGOSubmissionById(req: Request, res: Response) {
        const { id } = req.params;
        if (id) {
            const submission = await this.submissionService.getNGOSubmissionsById(BigInt(id as string));
            res.status(200).json({ message: 'fetched successful', data: submission });
            return;
        }
        res.status(400).json({ message: 'missing ID' });

    }


    async getLocalCompanySubmissions(req: Request, res: Response) {

        const submissions = await this.submissionService.getLocalCompanySubmissions();
        res.status(200).json({ message: 'Submission fetched', data: submissions });
    }


    async getLocalCompanySubmissionById(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: 'missing Id' });
            return;
        }
        const submission = await this.submissionService.getLocalCompanySubmissionById(BigInt(id));
        res.status(200).json({ message: 'Submission fetched', data: submission });
    }


    async getEmbassySubmissions(req: Request, res: Response) {

        const submissions = await this.submissionService.getEmabassySubmissions();
        res.status(200).json({ message: 'Submission fetched', data: submissions });
    }


    async getEmbassySubmissionsById(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: 'missing Id' });
            return;
        }
        const submission = await this.submissionService.getEmabassySubmissionsById(BigInt(id));
        res.status(200).json({ message: 'Submission fetched', data: submission });
    }


    async getInternationalCompanySubmissions(req: Request, res: Response) {

        const submissions = await this.submissionService.getInternationalCompanySubmissions();
        res.status(200).json({ message: 'Submission fetched', data: submissions });
    }


    async getInternationalCompanySubmissionById(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: 'missing Id' });
            return;
        }
        const submission = await this.submissionService.getInternationalCompanySubmission(BigInt(id));
        res.status(200).json({ message: 'Submission fetched', data: submission });
    }


    async getStartupSubmissions(req: Request, res: Response) {

        const submissions = await this.submissionService.getStartupSubmissions();
        res.status(200).json({ message: 'Submission fetched', data: submissions });
    }


    async getStartupSubmissionsById(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: 'missing Id' });
            return;
        }
        const submissions = await this.submissionService.getStartupSubmissionsById(BigInt(id));
        res.status(200).json({ message: 'Submission fetched', data: submissions });
    }

    async getEventSubmissions(req: Request, res: Response) {
        const submissions = await this.submissionService.getEventAttendeeSubmissions();
        res.status(200).json({ message: 'Submission fetched', data: submissions });
    }
    async getConferenceSubmissions(req: Request, res: Response) {
        const submissions = await this.submissionService.getConferenceAttendeeSubmissions();
        res.status(200).json({ message: 'Submission fetched', data: submissions });
    }

    async deleteNGOSubmission(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Missing ID' });
        }
        try {
            await this.submissionService.deleteNGOSubmission(BigInt(id));
            res.status(200).json({ message: 'Submission deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete submission' });
        }
    }

    async deleteLocalCompanySubmission(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Missing ID' });
        }
        try {
            await this.submissionService.deleteLocalCompanySubmission(BigInt(id));
            res.status(200).json({ message: 'Submission deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete submission' });
        }
    }

    async deleteEmbassySubmission(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Missing ID' });
        }
        try {
            await this.submissionService.deleteEmbassySubmission(BigInt(id));
            res.status(200).json({ message: 'Submission deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete submission' });
        }
    }

    async deleteInternationalCompanySubmission(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Missing ID' });
        }
        try {
            await this.submissionService.deleteInternationalCompanySubmission(BigInt(id));
            res.status(200).json({ message: 'Submission deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete submission' });
        }
    }

    async deleteStartupSubmission(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Missing ID' });
        }
        try {
            await this.submissionService.deleteStartupSubmission(BigInt(id));
            res.status(200).json({ message: 'Submission deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete submission' });
        }
    }

    async deleteEventSubmission(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Missing ID' });
        }
        try {
            await this.submissionService.deleteEventSubmission(BigInt(id));
            res.status(200).json({ message: 'Submission deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete submission' });
        }
    }

    async deleteConferenceSubmission(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Missing ID' });
        }
        try {
            await this.submissionService.deleteConferenceSubmission(BigInt(id));
            res.status(200).json({ message: 'Submission deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete submission' });
        }
    }


    async getSubmissionStat(req: Request, res: Response) {
        const { from, to } = req.query;
        const fromDate = from ? new Date(from as string) : undefined;
        const toDate = to ? new Date(to as string) : undefined;

        const totalNGOSubmission = await this.submissionService.getNGOSubmissions() || [];
        const totalLocalCompanySubmission = await this.submissionService.getLocalCompanySubmissions() || [];
        const totalInternationCompanySubmission = await this.submissionService.getInternationalCompanySubmissions() || [];
        const totalStartupSubmission = await this.submissionService.getStartupSubmissions() || [];
        const totalEmbassySubmission = await this.submissionService.getEmabassySubmissions() || [];

        const filterByDate = (arr: any[]) => {
            if (!fromDate && !toDate) return arr;
            return arr.filter((item: any) => {
                const d = new Date(item.registeredDate || item.createdAt || item.created_at);
                if (fromDate && d < fromDate) return false;
                if (toDate && d > toDate) return false;
                return true;
            });
        };

        const ngoFiltered = filterByDate(totalNGOSubmission);
        const localFiltered = filterByDate(totalLocalCompanySubmission);
        const intlFiltered = filterByDate(totalInternationCompanySubmission);
        const startupFiltered = filterByDate(totalStartupSubmission);
        const embassyFiltered = filterByDate(totalEmbassySubmission);

        const ngoChange = calculateChange(ngoFiltered);
        const localCompanyChange = calculateChange(localFiltered);
        const internationalCompanyChange = calculateChange(intlFiltered);
        const startupChange = calculateChange(startupFiltered);
        const embassyChange = calculateChange(embassyFiltered);

        res.status(200).json({
            message: 'fetched successfull', data: {
                'totalNgoSubmission': ngoFiltered.length,
                'totalLocalCompanySubmission': localFiltered.length,
                'totalInternationCompanySubmission': intlFiltered.length,
                'totalStartupSubmission': startupFiltered.length,
                'totalEmbassySubmission': embassyFiltered.length,
                'ngoChange': ngoChange,
                'internationCompanyChange': internationalCompanyChange,
                'localCompanyChange': localCompanyChange,
                'startupChange': startupChange,
                'embassyChange': embassyChange,
            }
        })
    }

    async getAttendeeStat(req: Request, res: Response) {
        const { from, to } = req.query;
        const fromDate = from ? new Date(from as string) : undefined;
        const toDate = to ? new Date(to as string) : undefined;

        const allEvent = await this.submissionService.getEventAttendeeSubmissions() || [];
        const allConference = await this.submissionService.getConferenceAttendeeSubmissions() || [];

        const filterByDate = (arr: any[]) => {
            if (!fromDate && !toDate) return arr;
            return arr.filter((item: any) => {
                const d = new Date(item.registeredDate || item.createdAt || item.created_at);
                if (fromDate && d < fromDate) return false;
                if (toDate && d > toDate) return false;
                return true;
            });
        };

        const eventFiltered = filterByDate(allEvent);
        const conferenceFiltered = filterByDate(allConference);

        const eventChange = calculateChange(eventFiltered);
        const conferenceChange = calculateChange(conferenceFiltered);

        res.status(200).json({
            message: 'fetched successfully', data: {
                totalEventAttendees: eventFiltered.length,
                totalConferenceAttendees: conferenceFiltered.length,
                eventChange: isNaN(eventChange) ? 0 : eventChange,
                conferenceChange: isNaN(conferenceChange) ? 0 : conferenceChange,
            }
        });
    }
}

