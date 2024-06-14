import express from 'express';
import { getEndUserIP } from "../../infra";
import {
    authApplication,
    isEligible,
    readApplication,
    requestForm,
    updateApplication,
    validateApplication
} from "./apply.service";
import {logIncident} from "../../infra/middleware/logger/incident";
import {checkApplication} from "./apply.middleware";
import {validateAccessToken} from "../../infra/middleware/handler";
import {
    getAllApplications, getAllProcessedApplications,
    getAllSubmittedApplications,
    getApplyBrief,
    processApplication,
    readApplicationByManager
} from "./apply.manage";
import {isAdmin} from "../../infra/middleware/handler/permission";

const applyRouter = express.Router();

// New application form request
applyRouter.get('/eligible', getEndUserIP, isEligible, logIncident);
applyRouter.post('/request_form', getEndUserIP, requestForm, logIncident);

// Manage
applyRouter.get('/brief', validateAccessToken, isAdmin, getApplyBrief, logIncident);
applyRouter.get('/applications', validateAccessToken, isAdmin, getAllApplications, logIncident);
applyRouter.get('/applications/submitted', validateAccessToken, isAdmin, getAllSubmittedApplications, logIncident);
applyRouter.get('/applications/processed', validateAccessToken, isAdmin, getAllProcessedApplications, logIncident);
applyRouter.get('/:applicationId/read', validateAccessToken, isAdmin, readApplicationByManager, logIncident);
applyRouter.post('/:applicationId/process', validateAccessToken, isAdmin, processApplication, logIncident);

// Authentication
applyRouter.post('/:applicationId/auth', getEndUserIP, authApplication, logIncident);

// Get application
applyRouter.get('/:applicationId/validate', checkApplication, validateApplication, logIncident);
applyRouter.get('/:applicationId', checkApplication, readApplication, logIncident);

// Write application
applyRouter.post('/:applicationId', checkApplication, updateApplication, logIncident);


export default applyRouter;
