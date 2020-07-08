import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher'

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
})

stan.on('connect', async () => {
    console.log('publisher connected to NATS!')

    const publisher = new TicketCreatedPublisher(stan)
    try {
        await publisher.publish({
            id: '321',
            title: 'concert',
            price: 43
        })
    } catch (err) {
        console.error(err)
    }
})