import { TicketUpdatedListener } from "../ticket-updated-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedEvent } from '@ihtickets/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
    //create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client)

    //create and save a ticket
    const ticket = await Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 20,
        title: "concert",
    }).save()

    //create a fake data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        price: 50,
        title: "eminem concert",
        userId: new mongoose.Types.ObjectId().toHexString(),
    }

    //create a fake msg object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    //return all
    return { listener, ticket, data, msg }
}

it('finds,updates and saves the ticket', async () => {
    const { data, listener, msg, ticket } = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.version).toEqual(data.version)
})

it('acks the message', async () => {
    const { data, listener, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has a skipped verison number', async () => {
    const { data, msg, listener } = await setup()

    data.version = 10
    try {
        await listener.onMessage(data, msg)
    } catch (error) { }

    expect(msg.ack).not.toHaveBeenCalled()

})