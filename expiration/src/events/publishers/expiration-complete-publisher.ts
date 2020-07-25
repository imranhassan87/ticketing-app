import {
    Subjects,
    Publisher,
    ExpirationCompleteEvent,
} from '@ihtickets/common';

export class ExpirationCompletePublisher extends Publisher<
    ExpirationCompleteEvent
    > {
    readonly subject = Subjects.ExpirationComplete;
}