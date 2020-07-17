import { Request, Response, Router } from 'express'
import { Order } from '../models/order'
import { OrderStatus, requireAuth, NotFoundError, NotAuthorizedError } from '@ihtickets/common'

const router = Router()

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const { orderId } = req.params

    const order = await Order.findById(orderId)
    if (!order) throw new NotFoundError()

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()

    order.status = OrderStatus.Cancelled
    await order.save()

    res.status(204).send(order)
})

export { router as deleteOrderRouter }