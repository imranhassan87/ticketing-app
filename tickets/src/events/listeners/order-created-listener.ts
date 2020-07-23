import { Listener, OrderCreatedEvent, Subjects, NotFoundError } from '@ihtickets/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/tickets'
import { TicketSrvQueueGroup } from './queueGroupName'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

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
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        })
        //ack the message
        msg.ack()
    }


}