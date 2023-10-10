import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import {CustomersMiddleware} from "./middleware/customers.middleware";

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomersMiddleware)
        .exclude(
            { path: 'customers', method: RequestMethod.GET },
            'customers/pipes/(.*)',
        ).forRoutes(CustomersController);
  }
}
