import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { QueueSchema } from './schemas/queue.schema';
import {JwtModule} from "@nestjs/jwt";
import {AuthRoleGuard} from "../auth/guards/auth-role-guard";
import {jwtModuleAsyncOptions} from "../helpers/jwtconfigFactory";

@Module({
  imports: [
    AuthModule,
    JwtModule.registerAsync(jwtModuleAsyncOptions),
    MongooseModule.forFeature([{ name: 'Queue', schema: QueueSchema }]),
  ],
  controllers: [QueueController],
  providers: [QueueService, AuthRoleGuard],
  exports: [QueueService]
})
export class QueueModule {}
