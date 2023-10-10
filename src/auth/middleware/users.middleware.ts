import {BadRequestException, Injectable, NestMiddleware, NotFoundException} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import mongoose, {Model} from "mongoose";
import {User} from "../schemas/user.schema";
import {InjectModel} from "@nestjs/mongoose";

@Injectable()
export class UsersMiddleware implements NestMiddleware {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}
    async use(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            throw new BadRequestException('Please enter correct id.');
        }
        const user = await this.userModel.findById(id) as User;
        if (!user) {
            throw new NotFoundException('User not found.');
        }
        next();
    }
}
