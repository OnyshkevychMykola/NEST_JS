import {BadRequestException, ConflictException, Injectable, NotFoundException,} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {Queue} from './schemas/queue.schema';

import {Query} from 'express-serve-static-core';
import {User} from '../auth/schemas/user.schema';
import {CreateQueueDto} from "./dto/create-queue.dto";
import {UpdateQueueDto} from "./dto/update-queue.dto";
import { createObjectCsvWriter } from 'csv-writer';
import {validate} from "class-validator";
import {createWriteStream} from "fs";

@Injectable()
export class QueueService {
  constructor(
    @InjectModel(Queue.name)
    private queueModel: mongoose.Model<Queue>,
  ) {}

  async findAll(query: Query): Promise<Queue[]> {
    const resPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const filters: any = {};
    if (query?.ein) {
      filters.ein = query.ein;
    }

    if (query?.reason) {
      filters.reason = query.reason;
    }

    if (query?.state) {
      filters.state = query.state;
    }

    return this.queueModel
        .find({...filters})
        // .limit(resPerPage)
        // .skip(skip)
        ;
  }

  async create(createQueueDto: CreateQueueDto, user: User): Promise<Queue> {
    try {
      const data = Object.assign(createQueueDto, { user: user._id });
      return await this.queueModel.create(data);
    } catch (error) {
      if (error?.code === 11000) {
        throw new ConflictException('Duplicate EIN Entered');
      }
    }
  }

  async findById(id: string): Promise<Queue> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    const queue = await this.queueModel.findById(id);

    if (!queue) {
      throw new NotFoundException('Item not found.');
    }

    return queue;
  }

  async updateById(id: string, queue: any = UpdateQueueDto): Promise<Queue> {
    const duplicateEin = this.queueModel.find({ ein: queue?.ein });
    if (duplicateEin) throw new BadRequestException('Duplicate EIN Entered');
    return this.queueModel.findByIdAndUpdate(id, queue, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<Queue> {
    return this.queueModel.findByIdAndDelete(id);
  }

  async getAllQueueData() {
    return  await this.queueModel.find().exec();
  }

  async createDonor(results: any [], user) {
    try {
      for (const result of results) {
        const createQueueDto: CreateQueueDto = {
          ein: Number(result.Ein),
          addedAt: result.AddedAt,
          address: result.Address,
          balance: result.Balance,
          city: result.City,
          earliestHoldDate: result.EarliestHoldDate,
          lastDonationMade: result.LastDonationMade,
          state: result.State,
          reason: result.Reason,
          user: user._id,
        };

        const errors = await validate(createQueueDto);
        if (errors.length > 0) {
          new BadRequestException('Validation failed');
        }

        const existingQueue = await this.queueModel.findOne({ ein: createQueueDto.ein }).exec();
        if (!existingQueue) {
          const queue = new this.queueModel(createQueueDto);
          await queue.save();
        } else {
          console.log(`${createQueueDto.ein} is already in queue`)
        }
      }
    } catch (error) {
      throw error;
    }
  }

}
