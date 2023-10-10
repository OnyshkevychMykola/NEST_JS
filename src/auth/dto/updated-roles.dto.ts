import {ArrayMinSize, IsArray, IsNotEmpty, IsString} from "class-validator";
import {PartialType} from "@nestjs/swagger";
import {SignUpDto} from "./signup.dto";

export class UpdatedRolesDto extends PartialType(SignUpDto) {
    @IsNotEmpty()
    @IsArray({})
    @ArrayMinSize(1)
    @IsString({ each: true })
    readonly roles: [];
}
