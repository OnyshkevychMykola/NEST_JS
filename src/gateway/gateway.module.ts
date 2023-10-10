import { Module } from '@nestjs/common';
import {GatewayService} from "./gateway.service";
import {Gateway} from "./gateway";

@Module({
  providers: [Gateway, GatewayService],
})
export class GatewayModule {}
