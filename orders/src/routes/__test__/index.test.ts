import request from 'supertest'
import { app } from '../../app'

import { Ticket } from '../../models/ticket'

const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 10
    })
    await ticket.save()

    return ticket
}

it('fetches an order for a particular user', async () => {
    //create 3 ticktes
    const ticket1 = await buildTicket()
    const ticket2 = await buildTicket()
    const ticket3 = await buildTicket()

    const user1 = global.signin()
    const user2 = global.signin()
    // 1 for user#1
    await request(app)
        .post('/api/orders')
        .set("Cookie", user1)
        .send({ ticketId: ticket1.id })
        .expect(201)
    //2 for user#2
    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set("Cookie", user2)
        .send({ ticketId: ticket2.id })
        .expect(201)

    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set("Cookie", user2)
        .send({ ticketId: ticket3.id })
        .expect(201)

    //fetch the tickets for user 2

    const response = await request(app)
        .get('/api/orders')
        .set("Cookie", user2)
        .expect(200)

    expect(response.body.length).toEqual(2)
    expect(response.body[0].id).toEqual(orderOne.id)
    expect(response.body[1].id).toEqual(orderTwo.id)
})