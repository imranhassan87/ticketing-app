import { Schema, Document, Model, model } from 'mongoose'

interface PaymentAttrs {
    orderId: string
    stripeId: string
}

interface PaymentDoc extends Document {
    orderId: string
    stripeId: string
}

interface PaymentModel extends Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc
}

const paymentSchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    stripeId: {
        type: String,
        required: true
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret.id
        }
    }
})

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs)
}

const Payment = model<PaymentDoc, PaymentModel>('Payment', paymentSchema)

export { Payment }