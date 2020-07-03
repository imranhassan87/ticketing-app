import request from 'supertest'
import { app } from '../../app'

it('returns a 200 on a successful signin', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201)
    await request(app)
        .post('/api/users/signin')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(200)
})

it('returns a 400 on a incorrect email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test1@test.com",
            password: "password"
        })
        .expect(201)
    await request(app)
        .post('/api/users/signin')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(400)

})
it('returns a 400 on a incorrect password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test1@test.com",
            password: "password"
        })
        .expect(201)
    await request(app)
        .post('/api/users/signin')
        .send({
            email: "test1@test.com",
            password: "password1"
        })
        .expect(400)

})

it('sets a cookie after a successful sign up', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201)


    const res = await request(app)
        .post('/api/users/signin')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(200)

    expect(res.get('Set-Cookie')).toBeDefined()
})