import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {Query as ExpressQuery} from "express-serve-static-core";
import {State} from "../schemas/queue.schema";

@Injectable()
export class QueueTransformPipe implements PipeTransform<ExpressQuery, string> {
    transform(value: ExpressQuery, metadata: ArgumentMetadata): string {
        const query: any = { ...value};

        if (value?.state && value?.state!== (State.CA || State.NY || State.PE || State.TX)) {
           throw new BadRequestException('State Signature is Incorrect')
        }

        return query;
    }
}
