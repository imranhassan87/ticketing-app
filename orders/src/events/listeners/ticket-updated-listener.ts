import { Message } from 'node-nats-streaming'
import { Subjects, Listener, TicketUpdatedEvent, NotFoundError } from '@ihtickets/common'
import { Ticket } from '../../models/ticket'
import { OrderSrvQueueGroup } from './queue-group-name'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{

    readonly subject = Subjects.TicketUpdated
    queueGroupName = OrderSrvQueueGroup

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { id, title, price } = data

        const ticket = await Ticket.findById(id)
        if (!ticket) throw new NotFoundError()

        ticket.set({ title, price })

        await ticket.save()

        msg.ack()
    }
}