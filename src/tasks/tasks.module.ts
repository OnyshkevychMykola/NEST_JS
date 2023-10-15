import { Module } from '@nestjs/common';
import { TasksService } from "./tasks.service";
import { QueueModule } from "../queue/queue.module";

@Module({
    imports: [QueueModule],
    providers:[TasksService]
})
export class TasksModule {}
