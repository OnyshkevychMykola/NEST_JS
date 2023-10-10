import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import {validate} from "class-validator";

@Injectable()
export class CustomValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        const obj = plainToInstance(metadata.metatype, value);
        const errors = await validate(obj);

        if (errors.length) {
            const messages = errors.map( err => {
                return `${err.property} - ${Object.values(err.constraints).join(',')}`
            })
            throw new BadRequestException(messages)
        }
        return value;
    }
}
