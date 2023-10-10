import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CustomersMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log(`Received request: ${req.method} ${req.url}`);
        res.on('finish', () => {
            console.log(`Sent response with status ${res.statusCode}`);
        });
        next();
    }
}
