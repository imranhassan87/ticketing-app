import { Message } from 'node-nats-streaming'
import { Subjects, Listener, TicketCreatedEvent } from '@ihtickets/common'
import { Ticket } from '../../models/ticket'
import { OrderSrvQueueGroup } from './queue-group-name'

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated
    queueGroupName = OrderSrvQueueGroup

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data
        const ticket = await Ticket.build({
            id,
            title,
            price
        }).save()

        msg.ack()
    }
}