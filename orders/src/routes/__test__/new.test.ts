import request from 'supertest'
import mongoose from 'mongoose'
import { OrderStatus } from '@ihtickets/common'

import { app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'


it('returns an error if the ticket does not exist', async () => {
    const ticketId = mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId })
        .expect(404);
});


it('returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 50
    })
    await ticket.save()

    const order = Order.build({
        ticket,
        userId: 'afafafadasdsf',
        status: OrderStatus.Created,
        expiresAt: new Date()
    })
    await order.save()

    await request(app)
        .post('/api/orders')
        .set("Cookie", global.signin())
        .send({ ticketId: ticket.id })
        .expect(400)
})

it('reserves a ticket', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 50
    })
    await ticket.save()

    await request(app)
        .post('/api/orders')
        .set("Cookie", global.signin())
        .send({ ticketId: ticket.id })
        .expect(201)

})

it('emits an event for order created', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 50
    })
    await ticket.save()

    await request(app)
        .post('/api/orders')
        .set("Cookie", global.signin())
        .send({ ticketId: ticket.id })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})