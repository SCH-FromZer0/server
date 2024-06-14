import express, {Express, Request, Response, NextFunction, RequestHandler} from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './service';
import requestIp from 'request-ip';

import { getEndUserIP } from './infra';
import { notFoundMiddleware } from './infra';

import { hidePoweredBy, ieNoOpen, xssFilter, noSniff } from 'helmet';

const app: Express = express();

// Security
app.use(hidePoweredBy());
app.use(ieNoOpen());
app.use(xssFilter());
app.use(noSniff());
app.set('etag', false);
app.set('trust proxy', true);
app.use(requestIp.mw())

app.use(
    cors({
        origin: ['http://localhost:3000/', 'https://fromzero.tech/'],
        credentials: true,
    }),
);

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req.headers['X-FromZer0-Proxy-Passed']);
    next();
})

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }) as RequestHandler);
app.use(bodyParser.json({ limit: 1024 * 1024 * 30 }) as RequestHandler);

app.use(cookieParser() as RequestHandler);

app.use('/', getEndUserIP);
app.use('/', router);
app.use('/', notFoundMiddleware);

export default app;
