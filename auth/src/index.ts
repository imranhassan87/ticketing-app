import mongoose from 'mongoose'
import { app } from './app'

const start = async () => {
    if (!process.env.JWT_KET) {
        throw new Error('JWT_KEY must be defined')
    }
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log('mongodb Conneted')
    } catch (err) {
        console.error(err)
    }
    app.listen(3000, () => {
        console.log('app is running on port 3000')
    })
}

start()