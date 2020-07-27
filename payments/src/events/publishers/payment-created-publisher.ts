import { Subjects, Publisher, PaymentCreatedEvent } from '@ihtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
