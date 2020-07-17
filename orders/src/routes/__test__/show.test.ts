import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'


it('fetches the order', async () => {
    //craete a ticket
    const ticket = await Ticket.build({
        title: 'new orleans',
        price: 500
    }).save()

    const user = global.signin()
    //make a request to build an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set("Cookie", user)
        .send({ ticketId: ticket.id })
        .expect(201)

    //make request to fetch the order
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(200)

    expect(fetchedOrder.id).toEqual(order.id)
})


it('returns an error if one user tries to fetch another user order', async () => {
    //craete a ticket
    const ticket = await Ticket.build({
        title: 'new orleans',
        price: 500
    }).save()

    const user = global.signin()
    //make a request to build an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set("Cookie", user)
        .send({ ticketId: ticket.id })
        .expect(201)

    //make request to fetch the order
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", global.signin())
        .send()
        .expect(401)
})