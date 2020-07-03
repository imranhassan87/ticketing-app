import { Schema, model, Model, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

interface UserAttributes {
    email: string,
    password: string
}

interface UserModel extends Model<UserDoc> {
    build(attrs: UserAttributes): UserDoc
}

interface UserDoc extends Document {
    email: string,
    password: string
    //can add extra properties here e.g createdAt updatedAt
}

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
            delete ret.password
        }
    }
})

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(this.get('password'), salt)
        this.set('password', hashed)
    }
    done()
})

userSchema.statics.build = (attrs: UserAttributes) => {
    return new User(attrs)
}

const User = model<UserDoc, UserModel>('User', userSchema)

export { User }