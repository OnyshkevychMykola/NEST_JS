import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class NumberToStringPipe implements PipeTransform<number, string> {
    transform(value: number, metadata: ArgumentMetadata): string {
        return `${value.toString()} - number`;
    }
}
