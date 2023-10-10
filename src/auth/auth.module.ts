// import { Module } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { JwtModule } from '@nestjs/jwt';
// import { MongooseModule } from '@nestjs/mongoose';
// import { PassportModule } from '@nestjs/passport';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { JwtStrategy } from './jwt.strategy';
// import { UserSchema } from './schemas/user.schema';
//
// @Module({
//   imports: [
//     PassportModule.register({ defaultStrategy: 'jwt' }),
//     JwtModule.registerAsync({
//       inject: [ConfigService],
//       useFactory: (config: ConfigService) => {
//         return {
//           secret: config.get<string>('JWT_SECRET'),
//           signOptions: {
//             expiresIn: config.get<string | number>('JWT_EXPIRES'),
//           },
//         };
//       },
//     }),
//     MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, JwtStrategy],
//   exports: [JwtStrategy, PassportModule],
// })
// export class AuthModule {}

import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserSchema } from './schemas/user.schema';
import {UsersMiddleware} from "./middleware/users.middleware";
import {jwtModuleAsyncOptions} from "../helpers/jwtconfigFactory";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtModuleAsyncOptions),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UsersMiddleware).forRoutes('auth/users/:id');
  }
}
