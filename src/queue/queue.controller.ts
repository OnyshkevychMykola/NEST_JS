import {
  Body,
  Controller,
  Delete,
  Get, HttpStatus,
  Param, ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards, UsePipes, ValidationPipe,
} from '@nestjs/common';
import {QueueService} from './queue.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { Queue} from './schemas/queue.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import {QueueTransformPipe} from "./pipes/queueTransformPipe";
import {Roles} from "../customers/roles.decorator";
import {AuthRoleGuard} from "../auth/guards/auth-role-guard";

@Controller('queue')
@UseGuards(AuthGuard())
@UsePipes(new ValidationPipe())
export class QueueController {
  constructor(
      private queueService: QueueService
  ) {}

  @Get()
  @UseGuards(AuthRoleGuard)
  @Roles('admin', 'developer')
  async getQueue(@Query(QueueTransformPipe) queueFilters: ExpressQuery): Promise<Queue[]> {
    return this.queueService.findAll(queueFilters);
  }

  @Post()
  async addItemToQueue(
    @Body()
    book: CreateQueueDto,
    @Req() req,
  ): Promise<Queue> {
    return this.queueService.create(book, req.user);
  }

  @Get(':id')
  async getQueueItemById(
    @Param('id')
    id: string,
  ): Promise<Queue> {
    return this.queueService.findById(id);
  }

  @Put(':id')
  async updateQueueItem(
    @Param('id')
    id: string,
    @Body()
    queueItem: UpdateQueueDto,
  ): Promise<Queue> {
    return this.queueService.updateById(id, queueItem);
  }

  @Delete(':id')
  async deleteQueueItem(
    @Param('id')
    id: string,
  ): Promise<Queue> {
    return this.queueService.deleteById(id);
  }
}
