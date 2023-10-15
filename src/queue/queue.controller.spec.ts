import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { User } from '../auth/schemas/user.schema';
import {State} from "./schemas/queue.schema";
import {QueueService} from "./queue.service";
import {QueueController} from "./queue.controller";
import {CreateQueueDto} from "./dto/create-queue.dto";
import {UpdateQueueDto} from "./dto/update-queue.dto";
import {JwtService} from "@nestjs/jwt";

describe('QueueController', () => {
    let queueService: QueueService;
    let queueController: QueueController;

    const mockItem = {
        _id: '61c0ccf11d7bf83d153d7c06',
        user: '61c0ccf11d7bf83d153d7c06',
        ein: 234234234,
        addedAt: "2023-02-16T00:46:46.878Z",
        address: "Ivana Boguna St.",
        balance: 21615.94,
        city: "Carmel",
        earliestHoldDate: "2021-09-13T00:00:00.000Z",
        lastDonationMade: "2021-01-27T00:00:00.000Z",
        reason: "New & Medium/Small & Unlikely to Cash & Needs Effort",
        state: State.CA
    };

    const mockUser = {
        _id: '61c0ccf11d7bf83d153d7c06',
        name: 'Mykola',
        email: 'onyshkogod@gmail.com',
    };

    const mockQueueService = {
        findAll: jest.fn().mockResolvedValueOnce([mockItem]),
        create: jest.fn(),
        findById: jest.fn().mockResolvedValueOnce(mockItem),
        updateById: jest.fn(),
        deleteById: jest.fn().mockResolvedValueOnce({ deleted: true }),
    };

    const mockAuthRoleGuard = {
        canActivate: jest.fn().mockResolvedValueOnce(true), // Повертаємо true для успішної автентифікації
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
            controllers: [QueueController],
            providers: [
                {
                    provide: QueueService,
                    useValue: mockQueueService,
                },
                {
                    provide: JwtService,
                    useValue: {}
                }
            ],
        }).compile();

        queueService = module.get<QueueService>(QueueService);
        queueController = module.get<QueueController>(QueueController);
    });

    it('should be defined', () => {
        expect(queueController).toBeDefined();
    });

    describe('getQueue', () => {
        it('should get queue', async () => {
            const result = await queueController.getQueue({
                page: '1',
            });

            expect(queueService.findAll).toHaveBeenCalled();
            expect(result).toEqual([mockItem]);
        });
    });

    describe('addItemToQueue', () => {
        it('should create a new queue item', async () => {
            const newQueueItem = {
                ein: 234234234,
                addedAt: "2023-02-16T00:46:46.878Z",
                address: "Ivana Boguna St.",
                balance: 21615.94,
                city: "Carmel",
                earliestHoldDate: "2021-09-13T00:00:00.000Z",
                lastDonationMade: "2021-01-27T00:00:00.000Z",
                reason: "New & Medium/Small & Unlikely to Cash & Needs Effort",
                state: State.CA
            };

            mockQueueService.create = jest.fn().mockResolvedValueOnce(mockItem);

            const result = await queueController.addItemToQueue(
                newQueueItem as CreateQueueDto,
                mockUser as User,
            );

            expect(queueService.create).toHaveBeenCalled();
            expect(result).toEqual(mockItem);
        });
    });

    describe('getQueueItemById', () => {
        it('should get a queue item by ID', async () => {
            const result = await queueController.getQueueItemById(mockItem._id);

            expect(queueService.findById).toHaveBeenCalled();
            expect(result).toEqual(mockItem);
        });
    });

    describe('updateQueueItem', () => {
        it('should update queue item by its ID', async () => {
            const updatedQueueItem = { ...mockItem, address: 'Ivana Mazepy St.' };
            const queueItem = { address: 'Ivana Mazepy St.' };

            mockQueueService.updateById = jest.fn().mockResolvedValueOnce(updatedQueueItem);

            const result = await queueController.updateQueueItem(
                mockItem._id,
                queueItem as UpdateQueueDto,
            );

            expect(queueService.updateById).toHaveBeenCalled();
            expect(result).toEqual(updatedQueueItem);
        });
    });

    describe('deleteQueueItem', () => {
        it('should delete a queue item by ID', async () => {
            const result = await queueController.deleteQueueItem(mockItem._id);

            expect(queueService.deleteById).toHaveBeenCalled();
            expect(result).toEqual({ deleted: true });
        });
    });
});
