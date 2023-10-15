import {Injectable, Logger} from '@nestjs/common';
import {Cron, CronExpression, Interval} from "@nestjs/schedule";
import {QueueService} from "../queue/queue.service";

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);
    constructor(
        private queueService: QueueService
    ) {}

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCron() {
        this.logger.debug('Started');
        const balance = await this.queueService.getTotalBalance();

        if (balance > 20000) {
            this.logger.debug(`Balance ${balance} is over 20000$`);
        } else {
            this.logger.debug(`Balance ${balance} is lower 20000$`);
        }
    }
}
