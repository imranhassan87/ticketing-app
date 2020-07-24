import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsWrapper } from '../../../nats-wrapper'
import mongoose from 'mongoose'
import { Order } from '../../../models/order'
import { OrderCancelledEvent, OrderStatus } from '@ihtickets/common'
import { Message } from 'node-nats-streaming'


const setup = async () => {

    //create an instance of a listener
    const listener = new OrderCancelledListener(natsWrapper.client)

    //create and save a order
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 12,
        userId: '123',
        version: 0
    })

    await order.save()
    //create fake data event
    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: 'dafafg',
        }
    }
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, order, data, msg }
}

it('updates the status of the order and acks the msg', async () => {
    const { data, listener, msg, order } = await setup()

    await listener.onMessage(data, msg)

    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
    expect(msg.ack).toHaveBeenCalled()
})