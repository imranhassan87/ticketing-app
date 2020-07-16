import { Request, Response, Router } from 'express'

const router = Router()

router.get('/api/orders', async (req: Request, res: Response) => {
    res.send('Orders Service')
})

router.get('/api/orders/:orderId', async (req: Request, res: Response) => {
    res.send('Orders Service')
})

export { router as showOrderRouter }