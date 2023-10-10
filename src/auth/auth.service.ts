import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import mongoose, {Model} from 'mongoose';
import {User} from './schemas/user.schema';

import * as bcrypt from 'bcryptjs';
import {JwtService} from '@nestjs/jwt';
import {SignUpDto} from './dto/signup.dto';
import {LoginDto} from './dto/login.dto';
import {UpdatedRolesDto} from "./dto/updated-roles.dto";
import {isEmpty} from "@nestjs/common/utils/shared.utils";
import {use} from "passport";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.userModel.find();
  }

  async getUserById(id): Promise<User> {
    return this.userModel.findById(id);
  }

  async updateUserRoles(id: string, updatedRolesDto: UpdatedRolesDto) {
    const user = await this.userModel.findById(id) as User;
    const combinedRoles = Array.from(new Set([...user.roles, ...updatedRolesDto.roles]));
    return this.userModel.findByIdAndUpdate(id, { $set: { roles: combinedRoles } }, { new: true },);
  }

  // async check(token: {}): Promise<string> {
  //   try {
  //     console.log(token.token)
  //     const decoded = this.jwtService.verify(token);
  //     return decoded.email;
  //   } catch (error) {
  //     console.log(error)
  //     throw new ConflictException('Duplicate Email Entered');
  //   }
  // }

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const {name, email, password} = signUpDto;
    const userDuplicate = await this.userModel.find({email});
    if (!isEmpty(userDuplicate)) throw new BadRequestException('duplicate email')

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
        roles: ['developer']
      });
      return {
        token : this.jwtService.sign({ id: user._id, email, roles: ['developer'] })
      };
    } catch (error) {
      if (error?.code === 11000) {
        throw new ConflictException('Duplicate Email Entered');
      }
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email }) as User;

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user._id, email: user.email, roles: user.roles });

    return { token };
  }
}
