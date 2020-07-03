import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { User } from '../models/User'
import { BadRequestError } from '../errors/bad-request-error'
import { validateRequest } from '../errors/validate-req'

const router = Router()

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4 }).withMessage('Password must be 4 characters')
], validateRequest, async (req: Request, res: Response) => {

    const { email, password } = req.body

    let user = await User.findOne({ email })
    if (user) throw new BadRequestError('User already registered')

    user = await User.build({
        email,
        password
    }).save()

    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KET!
    )

    req.session = { jwt: userJwt }

    res.status(201).send(user)
})

export { router as signupRouter }