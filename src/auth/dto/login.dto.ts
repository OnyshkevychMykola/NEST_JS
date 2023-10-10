import {IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class LoginDto {

  @ApiProperty({example: 'myemaildot@gmail.com', description: 'email'})
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 16, { message: 'Password should have between 6 and 16 symbols' })
  readonly password: string;
}
