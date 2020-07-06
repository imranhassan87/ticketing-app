import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import { requireAuth, currentUser, validateRequest, NotFoundError, NotAuthorizedError } from '@ihtickets/common'
import { Ticket } from '../models/tickets'

const router = Router()

router.put(
    '/api/tickets/:id',
    requireAuth,
    [
        body('title').not().isEmpty().withMessage('title is required'),
        body('price').isFloat({ gt: 0 }).withMessage('required and greater than zero')
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const ticket = await Ticket.findById(req.params.id)
        if (!ticket) {
            throw new NotFoundError()
        }
        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError()
        }
        ticket.set({
            title: req.body.title,
            price: req.body.price
        })
        await ticket.save()
        res.send(ticket)
    })

export { router as updateTicketRouter }