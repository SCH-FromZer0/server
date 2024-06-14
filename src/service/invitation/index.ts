import express from "express";
import {validateAccessToken} from "../../infra/middleware/handler";
import {logIncident} from "../../infra/middleware/logger/incident";
import {isAdmin} from "../../infra/middleware/handler/permission";
import {createInvitationManually, getAllInvitations, getInvitationBrief} from "./invitation.service";

const invitationRouter = express.Router();

invitationRouter.get('/brief', validateAccessToken, isAdmin, getInvitationBrief, logIncident);

invitationRouter.get('/all', validateAccessToken, isAdmin, getAllInvitations, logIncident);

invitationRouter.post('/manual', validateAccessToken, isAdmin, createInvitationManually);

export default invitationRouter;
