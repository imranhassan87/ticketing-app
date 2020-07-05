import { Request, Response, Router } from 'express'
import { requireAuth } from '@ihtickets/common'

const router = Router()

router.post('/api/tickets', requireAuth, async (req: Request, res: Response) => {
    res.sendStatus(200)
})

export { router as createTicketRouter }