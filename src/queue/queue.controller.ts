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
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@Controller('queue')
@UseGuards(AuthGuard())
@UsePipes(new ValidationPipe())
@ApiTags('queue')
export class QueueController {
  constructor(
      private queueService: QueueService
  ) {}

  @Get()
  @UseGuards(AuthRoleGuard)
  @Roles('admin', 'developer')
  @ApiOperation({ summary: 'Get Queue' })
  @ApiResponse({ status: 200, description: 'Returns Queue' })
  async getQueue(@Query(QueueTransformPipe) queueFilters: ExpressQuery): Promise<Queue[]> {
    return this.queueService.findAll(queueFilters);
  }

  @Post()
  @ApiOperation({ summary: 'Add Item to queue' })
  @ApiResponse({ status: 200, description: 'Returns created Item' })
  async addItemToQueue(
    @Body()
    createQueueDto: CreateQueueDto,
    @Req() req,
  ): Promise<Queue> {
    return this.queueService.create(createQueueDto, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Queue By Id' })
  @ApiResponse({ status: 200, description: 'Returns queue item by id' })
  async getQueueItemById(
    @Param('id')
    id: string,
  ): Promise<Queue> {
    return this.queueService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update queue item by id' })
  @ApiResponse({ status: 200, description: 'Updates queue item by id and new data' })
  async updateQueueItem(
    @Param('id')
    id: string,
    @Body()
    queueItem: UpdateQueueDto,
  ): Promise<Queue> {
    return this.queueService.updateById(id, queueItem);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete queue item by id' })
  @ApiResponse({ status: 200, description: 'Deletes queue item by id' })
  async deleteQueueItem(
    @Param('id')
    id: string,
  ): Promise<Queue> {
    return this.queueService.deleteById(id);
  }

  @Get('/e/export-to-csv')
  @UseInterceptors(FileInterceptor('csvfile'))
  @ApiOperation({ summary: 'Upload CSV file' })
  @ApiResponse({ status: 200, description: 'Uploads CSV file' })
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
  @ApiOperation({ summary: 'Export Data To CSV file' })
  @ApiResponse({ status: 200, description: 'ExportS Data To CSV file' })
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
