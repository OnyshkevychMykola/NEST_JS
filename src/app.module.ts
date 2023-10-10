import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {ScheduleModule} from "@nestjs/schedule";
import { TasksModule } from './tasks/tasks.module';
import { UploadModule } from './upload/upload.module';
// import { GatewayModule } from './gateway/gateway.module';
import { CustomersModule } from './customers/customers.module';
import {QueueModule} from "./queue/queue.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URI),
    ScheduleModule.forRoot(),
    AuthModule,
    // TasksModule,
    UploadModule,
    // GatewayModule,
    CustomersModule,
    QueueModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
