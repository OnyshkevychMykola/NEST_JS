import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export enum State {
  CA = 'CA',
  NY = 'NY',
  TX = 'TX',
  PE = 'PE',
}

@Schema({
  timestamps: true,
})
export class Queue {
  @Prop({ unique: true })
  ein: number;

  @Prop()
  addedAt: string;

  @Prop()
  address: string;

  @Prop()
  balance: number;

  @Prop()
  city: string;

  @Prop()
  earliestHoldDate: string;

  @Prop()
  lastDonationMade: string;

  @Prop()
  state: State;

  @Prop()
  reason: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const QueueSchema = SchemaFactory.createForClass(Queue);
