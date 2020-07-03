import request from 'supertest'
import { app } from '../../app'

it('returns details about current user', async () => {
    //  const cookie = await global.signin
    const res = await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        })
    const cookiee = res.get('Set-Cookie')
    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookiee)
        .send({})
        .expect(200)

    expect(response.body.currentUser.email).toEqual('test@test.com')
})

it('respond with null if not authenticated', async () => {
    const response = await request(app).get('/api/users/currentuser').send().expect(200)
    expect(response.body.currentUser).toEqual(null)
})