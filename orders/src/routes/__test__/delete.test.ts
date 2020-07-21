import request from 'supertest'
import { OrderStatus } from '@ihtickets/common'
import mongoose from 'mongoose'

import { app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it('marks an order as cancelled', async () => {

    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10
    })
    await ticket.save()

    const user = global.signin()

    const { body: order } = await request(app)
        .post('/api/orders')
        .set("Cookie", user)
        .send({ ticketId: ticket.id })
        .expect(201)

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send({})
        .expect(204)

    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits an event for order been cancelled', async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10
    })
    await ticket.save()

    const user = global.signin()

    const { body: order } = await request(app)
        .post('/api/orders')
        .set("Cookie", user)
        .send({ ticketId: ticket.id })
        .expect(201)

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send({})
        .expect(204)


    expect(natsWrapper.client.publish).toHaveBeenCalled()
})