import { Publisher, OrderCancelledEvent, Subjects } from '@ihtickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled
}