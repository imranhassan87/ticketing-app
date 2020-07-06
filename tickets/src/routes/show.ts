import { Request, Response, Router } from 'express'
import { Ticket } from '../models/tickets'
import { NotFoundError } from '@ihtickets/common'

const router = Router()

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) {
        throw new NotFoundError()
    }
    res.status(200).send(ticket)
})

export { router as showTicketRouter }