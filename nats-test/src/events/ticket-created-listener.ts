import { Message } from 'node-nats-streaming'
import { Listener } from './base-listener'
import { TicketCreatedEvent } from './ticket-created-event'
import { Subjects } from './subject'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
    queueGroupName = "payments-service"
    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('Event Data', data)
        msg.ack()
    }
}