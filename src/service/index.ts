import express from 'express';

import applyRouter from "./apply";
import accountRouter from "./account";
import invitationRouter from "./invitation";


const router = express.Router();

router.use('/apply', applyRouter);
router.use('/account', accountRouter);
router.use('/invitation', invitationRouter);

export default router;

