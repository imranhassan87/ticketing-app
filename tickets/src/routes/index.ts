import { Request, Response, Router } from 'express'
import { Ticket } from '../models/tickets'

const router = Router()

router.get('/api/tickets', async (req: Request, res: Response) => {
    const tickets = await Ticket.find({ orderId: undefined })
    res.send(tickets)
})

export { router as indexTicketsRouter }