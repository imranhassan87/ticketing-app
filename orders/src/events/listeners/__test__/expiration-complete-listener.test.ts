import { ExpirationCompleteListener } from '../expiration-complete-listener'
import { ExpirationCompleteEvent, OrderStatus } from '@ihtickets/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { Order } from '../../../models/order'


const setup = async () => {
    //create an instance of a listener
    const listener = new ExpirationCompleteListener(natsWrapper.client)

    //create and save a ticket and a order
    const ticket = await Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 20,
        title: "concert",
    }).save()

    const order = await Order.build({
        userId: '123',
        expiresAt: new Date(),
        status: OrderStatus.Cancelled,
        ticket
    }).save()

    //create a fake data event
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id,
    }

    //create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket, order }
}

it('updates the order status to cancelled', async () => {
    const { ticket, data, listener, msg, order } = await setup()

    await listener.onMessage(data, msg)
    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emit an order cancelled event', async () => {
    const { data, listener, msg, order } = await setup()

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(eventData.id).toEqual(order.id)
})

it('acks the msg', async () => {
    const { data, listener, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})