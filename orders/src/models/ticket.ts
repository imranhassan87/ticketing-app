import { Schema, model, Model, Document, } from 'mongoose'
import { OrderStatus } from '@ihtickets/common'
import { Order } from './order'

interface TicketAttr {
    id: string
    title: string,
    price: number
}

export interface TicketDoc extends Document {
    title: string,
    price: number,
    isReserved(): Promise<boolean>
}

interface TicketModel extends Model<TicketDoc> {
    build(attrs: TicketAttr): TicketDoc
}

const ticketSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

ticketSchema.statics.build = (attrs: TicketAttr) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    })
}

ticketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [OrderStatus.Created, OrderStatus.Complete, OrderStatus.AwaitingPayment]
        }
    })

    return !!existingOrder
}

const Ticket = model<TicketDoc, TicketModel>("Ticket", ticketSchema)

export { Ticket }