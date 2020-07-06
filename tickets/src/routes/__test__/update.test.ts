import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

it('returns a 404 if the provided id does not exist', async () => {
    const id = mongoose.Types.ObjectId().toHexString()
    const title = 'eminem'
    const price = 20

    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", global.signin())
        .send({ title, price })
        .expect(404)
})

it('returns a 401 if the user is not authenticated', async () => {
    const id = mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({ title: 'eminem1', price: 50 })
        .expect(401)
})

it('returns a 401 if the user does not owns the ticket', async () => {
    const title = 'eminem'
    const price = 20

    const response = await request(app)
        .post('/api/tickets/')
        .set("Cookie", global.signin()
        ).send({ title, price })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", global.signin())
        .send({ title: 'eminem20', price: 60 })
        .expect(401)
})

it('returns a 400 if the user provides invalid title or price', async () => {
    const cookie = global.signin()
    const title = 'eminem'
    const price = 20

    const response = await request(app)
        .post('/api/tickets/')
        .set("Cookie", cookie)
        .send({ title, price })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({ title: '', price: 30 })
        .expect(400)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({ title: 'faf', price: -30 })
        .expect(400)
})

it('updates the ticket if valid arguments are provided', async () => {
    const cookie = global.signin()
    const title = 'eminem'
    const price = 20

    const response = await request(app)
        .post('/api/tickets/')
        .set("Cookie", cookie)
        .send({ title, price })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({ title: 'Eminem20', price: 50 })
        .expect(200)

    const ticketResponse =
        await request(app)
            .get(`/api/tickets/${response.body.id}`)
            .send()

    expect(ticketResponse.body.title).toEqual('Eminem20')
    expect(ticketResponse.body.price).toEqual(50)
})