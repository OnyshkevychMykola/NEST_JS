import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '../auth/schemas/user.schema';
import {QueueService} from "./queue.service";
import {Queue, State} from "./schemas/queue.schema";
import {CreateQueueDto} from "./dto/create-queue.dto";

describe('QueueService', () => {
    let queueService: QueueService;
    let model: Model<Queue>;

    const mockedQueueItem = {
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
        find: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
    };


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QueueService,
                {
                    provide: getModelToken(Queue.name),
                    useValue: mockQueueService,
                },
            ],
        }).compile();

        queueService = module.get<QueueService>(QueueService);
        model = module.get<Model<Queue>>(getModelToken(Queue.name));
    });

    describe('findAll', () => {
        it('should return an array of books', async () => {
            const query = { page: '1' };

            jest.spyOn(model, 'find').mockImplementation(
                () =>
                    ({
                        limit: () => ({
                            skip: jest.fn().mockResolvedValue([mockedQueueItem]),
                        }),
                    } as any),
            );

            const result = await queueService.findAll(query);

            expect(result).toEqual([mockedQueueItem]);
        });
    });

    describe('findById', () => {
        it('should find and return a book by ID', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(mockedQueueItem);

            const result = await queueService.findById(mockedQueueItem._id);

            expect(model.findById).toHaveBeenCalledWith(mockedQueueItem._id);
            expect(result).toEqual(mockedQueueItem);
        });

        it('should throw BadRequestException if invalid ID is provided', async () => {
            const id = 'invalid-id';

            const isValidObjectIDMock = jest
                .spyOn(mongoose, 'isValidObjectId')
                .mockReturnValue(false);

            await expect(queueService.findById(id)).rejects.toThrow(
                BadRequestException,
            );

            expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
            isValidObjectIDMock.mockRestore();
        });

        it('should throw NotFoundException if book is not found', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(null);

            await expect(queueService.findById(mockedQueueItem._id)).rejects.toThrow(
                NotFoundException,
            );

            expect(model.findById).toHaveBeenCalledWith(mockedQueueItem._id);
        });
    });

    describe('deleteById', () => {
        it('should delete and return a book', async () => {
            jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockedQueueItem);

            const result = await queueService.deleteById(mockedQueueItem._id);

            expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockedQueueItem._id);

            expect(result).toEqual(mockedQueueItem);
        });
    });

});
