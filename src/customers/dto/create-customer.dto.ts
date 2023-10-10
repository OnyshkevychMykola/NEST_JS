import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";

export class CreateCustomerDto {
    readonly id: number;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 16, { message: 'Name should have between 6 and 16 symbols' })
    readonly name: string;


    readonly roles: [];
}
