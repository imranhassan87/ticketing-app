import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created-listener'
import { OrderCreatedEvent, OrderStatus } from '@ihtickets/common'
import mongoose from 'mongoose'
import { Order } from '../../../models/order'
import { Message } from 'node-nats-streaming'

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client)

    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        expiresAt: 'asdf',
        userId: 'fds',
        ticket: {
            id: 'asdas',
            price: 123
        }

    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg }
}

it('replicates the order info', async () => {
    const { data, listener, msg } = await setup()

    await listener.onMessage(data, msg)

    const order = await Order.findById(data.id)

    expect(order!.price).toEqual(data.ticket.price)
})

it('acks the message', async () => {
    const { data, listener, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})