import { ExpirationCompleteEvent, Publisher, Subjects } from '@ihtickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete
}