import { TicketUpdatedEvent, Subjects, Publisher } from '@ihtickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated
}