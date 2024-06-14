import express from "express";
import {getEndUserIP} from "../../infra";
import {logIncident} from "../../infra/middleware/logger/incident";
import {getToken, getUserData, refresh, signIn, signOut, signUp} from "./account.service";
import {validateAccessToken} from "../../infra/middleware/handler";
import {getAllAccounts} from "./account.manage";
import {isAdmin} from "../../infra/middleware/handler/permission";

const accountRouter = express.Router();

accountRouter.get('/', getEndUserIP, validateAccessToken, getUserData, logIncident);
accountRouter.post('/signup', getEndUserIP, signUp, logIncident);
accountRouter.post('/auth', getEndUserIP, signIn, getToken, logIncident);
accountRouter.get('/sign', getEndUserIP, refresh, logIncident);
accountRouter.delete('/sign', getEndUserIP, signOut);

// Manage
accountRouter.get('/all', validateAccessToken, isAdmin, getAllAccounts, logIncident);

export default accountRouter;
