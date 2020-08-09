import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@ihtickets/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
  > {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
