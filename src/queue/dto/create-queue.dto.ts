import {
  IsDate,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString, Length,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { State } from '../schemas/queue.schema';
import {ApiProperty} from "@nestjs/swagger";

export class CreateQueueDto {
  @ApiProperty({ example: 198345872, description: 'The ein of NPO' })
  @IsNotEmpty()
  @IsNumber()
  ein: number;

  @ApiProperty({ example: '22-09-2023', description: 'The date of adding' })
  @IsNotEmpty()
  @IsString()
  addedAt: string;

  @ApiProperty({ example: 'Lincoln St.', description: 'The address of  NPO' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 2300, description: 'The US state' })
  @IsNotEmpty()
  @IsNumber()
  balance: number;

  @ApiProperty({ example: 'New York', description: 'The NPO city' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: '22-09-2023', description: 'The date of holding' })
  @IsNotEmpty()
  @IsString()
  earliestHoldDate: string;

  @ApiProperty({ example: '22-09-2023', description: 'The date of last donation made' })
  @IsNotEmpty()
  @IsString()
  lastDonationMade: string;

  @ApiProperty({ example: State.CA, description: 'The US state' })
  @IsNotEmpty()
  @IsEnum(State, { message: 'Please enter correct category.' })
  state: State;

  @ApiProperty({ example: 'Outdated', description: 'The Reason' })
  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}
