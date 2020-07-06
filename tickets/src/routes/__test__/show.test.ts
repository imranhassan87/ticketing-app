import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

it('returns 404 if ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    const response = await request(app).get(`/api/tickets/${id}`).send({}).expect(404)
})

it('returns a ticket if ticket is found', async () => {
    const title = 'concert'
    const price = 300
    const response = await request(app)
        .post('/api/tickets')
        .set("Cookie", global.signin())
        .send({ title, price })
        .expect(201)

    const responseTicket = await request(app).get(`/api/tickets/${response.body.id}`).send().expect(200)
    expect(responseTicket.body.title).toEqual(title)
    expect(responseTicket.body.price).toEqual(price)

})