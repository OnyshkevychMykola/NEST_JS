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

export class CreateQueueDto {
  @IsNotEmpty()
  @IsNumber()
  ein: number;

  @IsNotEmpty()
  @IsString()
  addedAt: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  balance: number;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  earliestHoldDate: string;

  @IsNotEmpty()
  @IsString()
  lastDonationMade: string;

  @IsNotEmpty()
  @IsEnum(State, { message: 'Please enter correct category.' })
  state: State;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}
