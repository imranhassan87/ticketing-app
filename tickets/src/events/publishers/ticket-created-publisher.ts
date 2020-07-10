import { TicketCreatedEvent, Publisher, Subjects } from '@ihtickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated

}