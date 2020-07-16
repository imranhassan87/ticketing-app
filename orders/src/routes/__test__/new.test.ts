import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'

it('returns an error if the ticket does not exist', async () => {
    const ticketId = mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId })
        .expect(404);
});


it('returns an error if the ticket is already reserved', async () => {
    // const ticket = await Ticket.build({})
})

// it('reserves a ticket', async () => {

// })