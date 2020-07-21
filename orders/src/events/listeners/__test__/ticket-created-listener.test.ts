import { TicketCreatedListener } from '../ticket-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { TicketCreatedEvent } from '@ihtickets/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
    //create an instance of a listener
    const listener = new TicketCreatedListener(natsWrapper.client)

    //create a fake data event
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 20,
        title: "concert",
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
    }

    //create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg }
}

it('reads and save a ticket', async () => {

    const { listener, data, msg } = await setup()

    //call onMessage with data object + msg object
    await listener.onMessage(data, msg)

    //write assertions to make sure ticket was created
    const ticket = await Ticket.findById(data.id)

    expect(ticket).toBeDefined()
    expect(ticket!.title).toEqual(data.title)
    expect(ticket!.price).toEqual(data.price)
})


it('acks the message', async () => {

    const { data, listener, msg } = await setup()
    //call onMessage with data object + msg object
    await listener.onMessage(data, msg)
    //write assertions to make sure ack function was called
    expect(msg.ack).toHaveBeenCalled()
})