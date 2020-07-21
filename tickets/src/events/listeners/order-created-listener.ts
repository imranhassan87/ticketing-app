import { Listener, OrderCreatedEvent, Subjects, NotFoundError } from '@ihtickets/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/tickets'
import { TicketSrvQueueGroup } from './queueGroupName'

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{

    readonly subject = Subjects.OrderCreated
    queueGroupName = TicketSrvQueueGroup

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        //find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id)
        if (!ticket) throw new NotFoundError()

        //mark the ticket being reserved by setting its orderId property
        ticket.set({ orderId: data.id })

        //save the ticket
        await ticket.save()

        //ack the message
        msg.ack()
    }


}