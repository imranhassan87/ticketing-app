import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsWrapper } from '../../../nats-wrapper'
import mongoose from 'mongoose'
import { Ticket } from '../../../models/tickets'
import { OrderCancelledEvent } from '@ihtickets/common'
import { Message } from 'node-nats-streaming'


const setup = async () => {

    //create an instance of a listener
    const listener = new OrderCancelledListener(natsWrapper.client)

    const orderId = mongoose.Types.ObjectId().toHexString()
    //create and save a ticket
    const ticket = Ticket.build({
        title: 'gaming show',
        price: 12,
        userId: '123'
    })

    ticket.set({ orderId })
    await ticket.save()
    //create fake data event
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        }
    }
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg, orderId }
}

it('updates the ticket,publishes an event, and acks the msg', async () => {
    const { data, listener, msg, orderId, ticket } = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.orderId).toEqual(undefined)
    expect(msg.ack).toHaveBeenCalled()
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})