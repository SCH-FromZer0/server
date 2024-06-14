import { Request, Response, NextFunction } from 'express';

const notFoundMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    res.status(404).json({
        error: 'Requested API not found.',
    });

    next();
};

export { notFoundMiddleware };
