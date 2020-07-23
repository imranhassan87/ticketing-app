import { Listener, OrderCreatedEvent, Subjects } from '@ihtickets/common'
import { expirationSrvQueueGroup } from './queueGroupName'
import { Message } from 'node-nats-streaming'
import { expirationQueue } from '../../queues/expiration-queue'

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{

    readonly subject = Subjects.OrderCreated
    queueGroupName = expirationSrvQueueGroup

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
        console.log('waiting this many milliseconds to process a job', delay)
        await expirationQueue.add({
            orderId: data.id
        }, {
            delay
        })

        msg.ack()
    }
}