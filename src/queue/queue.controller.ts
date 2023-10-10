import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req, UploadedFile,
  UseGuards, UseInterceptors, UsePipes, ValidationPipe,
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
import {FileInterceptor} from "@nestjs/platform-express";
import {createReadStream, createWriteStream} from "fs";
import * as csv from 'csv-parser';
import * as fs from "fs";
import * as os from "os";

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

  @Get('/e/export-to-csv')
  @UseInterceptors(FileInterceptor('csvfile'))
  async uploadCsvFile(@UploadedFile() file, @Req() req) {
    const results = [];

    const tempFilePath = `${os.tmpdir()}/${Date.now()}.csv`;
    fs.writeFileSync(tempFilePath, file.buffer);

    createReadStream(tempFilePath)
        .pipe(csv())
        .on('data', (row) => {
          const donorData = {
            Ein: row.Ein,
            AddedAt: new Date(row.AddedAt),
            Address: row.Address,
            Balance: parseFloat(row.Balance),
            City: row.City,
            EarliestHoldDate: new Date(row.EarliestHoldDate),
            LastDonationMade: new Date(row.LastDonationMade),
            State: row.State,
            Reason: row.Reason,
          };

          results.push(donorData);
        })
        .on('end', async () => {
          await this.queueService.createDonor(results, req.user);
          fs.unlinkSync(tempFilePath);
        });

    return { message: 'CSV file uploaded and processed.' };
  }


  @Post('/e/export-to-csv')
  async exportDataToCsv(): Promise<void> {
    const data = await this.queueService.getAllQueueData();
    const csvData = [];

    for (const item of data) {
      const csvItem = {
        Ein: item.ein,
        AddedAt: new Date(item.addedAt).toISOString(),
        Address: item.address,
        Balance: item.balance.toString(),
        City: item.city,
        EarliestHoldDate: new Date(item.earliestHoldDate).toISOString(),
        LastDonationMade: new Date(item.lastDonationMade).toISOString(),
        State: item.state,
        Reason: item.reason,
      };

      csvData.push(csvItem);
    }

    const fileName = 'exported_data.csv';

    const writeStream = createWriteStream(fileName);
    writeStream.write('Ein,AddedAt,Address,Balance,City,EarliestHoldDate,LastDonationMade,State,Reason\n');

    for (const csvItem of csvData) {
      writeStream.write(
          `${csvItem.Ein},${csvItem.AddedAt},${csvItem.Address},${csvItem.Balance},${csvItem.City},${csvItem.EarliestHoldDate},${csvItem.LastDonationMade},${csvItem.State},${csvItem.Reason}\n`
      );
    }

    writeStream.end();
  }

}
