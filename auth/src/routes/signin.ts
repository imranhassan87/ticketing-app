import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import { User } from '../models/User'
import { BadRequestError } from '../errors/bad-request-error'
import { validateRequest } from '../errors/validate-req'

const router = Router()

router.post('/api/users/signin', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().isLength({ min: 4, max: 20 }).withMessage('Password must be supplied')
], validateRequest, async (req: Request, res: Response) => {

    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) throw new BadRequestError('Invalid Email or Password')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new BadRequestError('Invalid Email or Passwords')

    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KET!
    )

    req.session = {
        jwt: userJwt
    }

    res.status(200).send(user)

})

export { router as signinRouter }