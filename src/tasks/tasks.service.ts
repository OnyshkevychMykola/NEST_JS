import {Injectable, Logger} from '@nestjs/common';
import {Cron, CronExpression, Interval} from "@nestjs/schedule";

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    @Cron(CronExpression.EVERY_10_SECONDS)
    // @Interval(5000)
    handleCron() {
        this.logger.debug('Called when the current second is 45');
        console.log('1')
    }
}
