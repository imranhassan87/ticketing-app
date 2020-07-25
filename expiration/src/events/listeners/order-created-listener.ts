import { Listener, OrderCreatedEvent, Subjects } from '@ihtickets/common';
import { Message } from 'node-nats-streaming';
import { expirationSrvQueueGroup } from './queueGroupName';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = expirationSrvQueueGroup;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log('Waiting this many milliseconds to process the job:', delay);

        await expirationQueue.add(
            {
                orderId: data.id,
            },
            {
                delay,
            }
        );

        msg.ack();
    }
}