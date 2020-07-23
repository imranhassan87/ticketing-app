import { Listener, ExpirationCompleteEvent, Subjects, OrderStatus } from '@ihtickets/common'
import { Message } from 'node-nats-streaming'
import { OrderSrvQueueGroup } from './queue-group-name'
import { Order } from '../../models/order'
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher'


export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{

    readonly subject = Subjects.ExpirationComplete
    queueGroupName = OrderSrvQueueGroup

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {

        const order = await Order.findById(data.orderId).populate('ticket')
        if (!order) throw new Error('Order Not Found!')

        if (order.status === OrderStatus.Complete) return msg.ack()

        order.set({
            status: OrderStatus.Cancelled
        })

        await order.save()

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })
        msg.ack()
    }
}