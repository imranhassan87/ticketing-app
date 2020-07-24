import { Schema, model, Document, Model, Mongoose } from 'mongoose'
import { OrderStatus } from '@ihtickets/common'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface OrderAttrs {
    id: string
    userId: string
    status: OrderStatus
    version: number
    price: number
}

interface OrderDoc extends Document {
    id: string
    userId: string
    status: OrderStatus
    version: number
    price: number
}

interface OrderModel extends Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }

}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
    const { userId, status, version, price } = attrs
    return new Order({
        _id: attrs.id,
        userId,
        status,
        version,
        price
    })
}

const Order = model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }