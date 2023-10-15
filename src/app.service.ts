import {Inject, Injectable} from '@nestjs/common';
import {CreateRecommendationEvent} from "./create-rec.event";
import {ClientProxy} from "@nestjs/microservices";
import {CreateRecommendationDto} from "./create-recommendation.dto";

@Injectable()
export class AppService {

  private readonly recommendations: any[] = [];

  constructor(@Inject('COMMUNICATION') private readonly communicationClient: ClientProxy) {
  }
  getHello(): string {
    return 'Hello World!';
  }

  createRecommendation(createRecommendationDto : CreateRecommendationDto) {
    console.log(this.recommendations)
    this.recommendations.push(createRecommendationDto);
    this.communicationClient.emit('user_created',
        new CreateRecommendationEvent(createRecommendationDto.type))
  }
}
