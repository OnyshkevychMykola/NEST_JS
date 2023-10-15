import {Body, Controller, Get, Post} from '@nestjs/common';
import { AppService } from './app.service';
import {EventPattern} from "@nestjs/microservices";
import {CreateRecommendationEvent} from "./create-rec.event";
import {CreateRecommendationDto} from "./create-recommendation.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  handleRecCreated(@Body() createRecommendationDto: CreateRecommendationDto) {
      this.appService.createRecommendation(createRecommendationDto)
  }
}
