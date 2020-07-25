import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { OrderStatus } from '@ihtickets/common'
import { Order } from '../../models/order'
import { stripe } from '../../stripe'
import { Payment } from '../../models/payment'

jest.mock('../../stripe')

it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'adfsdf',
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404)

})

it('returns a 401 when purchasing an order that does not belongs to the user', async () => {
    const order = await Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Created,
        version: 0
    }).save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'dasda',
            orderId: order.id
        })
        .expect(401)
})

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toHexString()

    const order = await Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        price: 20,
        status: OrderStatus.Cancelled,
        version: 0
    }).save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            orderId: order.id,
            token: 'dasfa'
        })
        .expect(400)
})

it('returns a 204 with valid inputs', async () => {
    const userId = mongoose.Types.ObjectId().toHexString()

    const order = await Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        price: 20,
        status: OrderStatus.Created,
        version: 0
    }).save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            orderId: order.id,
            token: 'tok_visa'
        })
        .expect(201)

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]

    expect(chargeOptions.source).toEqual('tok_visa')
    expect(chargeOptions.amount).toEqual(20 * 100)
    expect(chargeOptions.currency).toEqual('usd')

    const payment = await Payment.findOne(order.id)
    expect(payment).not.toBeNull()
})