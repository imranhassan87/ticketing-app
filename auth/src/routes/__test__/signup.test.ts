import request from 'supertest'
import { app } from '../../app'

it('returns a 201 on a successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201)

})


it('returns a 400 with invalid email', async () => {
    return (await request(app).post('/api/users/signup').send({
        email: "testgmail.com",
        password: "123dasdas"
    }).expect(400)
    )
})

it('returns a 400 with invalid password', async () => {
    return request(app).post('/api/users/signup').send({
        email: "imran@gamil.com",
        password: '23'
    }).expect(400)
})

it('returns a 400 with no email or passwords given', async () => {
    return request(app).post('/api/users/signup').send({}).expect(400)
})

it('disallows duplicate email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "imran@gmail.com",
            password: "imran123"
        })
        .expect(201)

    await request(app)
        .post('/api/users/signup')
        .send({
            email: "imran@gmail.com",
            password: "imran123"
        })
        .expect(400)
})

it('sets a cookie after a successful sign up', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined()
})