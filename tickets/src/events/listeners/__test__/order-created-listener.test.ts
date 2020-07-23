import { OrderCreatedListener } from '../order-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/tickets'
import { OrderCreatedEvent, OrderStatus } from '@ihtickets/common'
import { Message } from 'node-nats-streaming'
import mongoose from 'mongoose'

const setup = async () => {

    //create an instance of a listener
    const listener = new OrderCreatedListener(natsWrapper.client)

    //create and save a ticket
    const ticket = await Ticket.build({
        title: 'gaming show',
        price: 12,
        userId: '123'
    }).save()

    //create fake data event
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: '123das',
        expiresAt: 'dasda',
        status: OrderStatus.Created,
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg }
}


it('sets the userId of ticket', async () => {
    const { data, listener, msg, ticket } = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.orderId).toEqual(data.id)
})

it('acks the msg', async () => {
    const { data, listener, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
    const { data, listener, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})