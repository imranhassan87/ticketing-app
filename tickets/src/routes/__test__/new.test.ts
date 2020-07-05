import request from 'supertest'
import { app } from '../../app'
import { response } from 'express'

it('has a route handler listening to /api/tickets for post requests', async () => {
    const resposne = await request(app).post('/api/tickets').send({})
    expect(response.status).not.toEqual(404)
})

it('can only be assessed if the user is signed in', async () => {
    const resposne = await request(app).post('/api/tickets').send({}).expect(401)
})

it('returns status other than 401 if user is signed in', async () => {
    const resposne = await request(app).post('/api/tickets').send({})
    expect(response.status).not.toEqual(401)
})
it('returns an error if an invalid title is provided', async () => {

})

it('returns an error if an invalid price is provided', async () => {

})

it('creates a ticket with valid inputs', async () => {

})