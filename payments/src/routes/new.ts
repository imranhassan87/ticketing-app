import { Request, Response, Router } from 'express'
import { BadRequestError, requireAuth, validateRequest, NotFoundError, NotAuthorizedError, OrderStatus } from '@ihtickets/common'
import { body } from 'express-validator'
import { Order } from '../models/order'
import { stripe } from '../stripe'

const router = Router()

router.post(
    '/api/payments',
    requireAuth,
    [
        body('token').not().isEmpty(),
        body('orderId').not().isEmpty()
    ],
    validateRequest, async (req: Request, res: Response) => {
        const { token, orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new Error('stuck here?');
        }
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay for an cancelled order');
        }

        await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: token,
        });

        res.status(201).send({ success: true });
    })


export { router as createChargeRouter }