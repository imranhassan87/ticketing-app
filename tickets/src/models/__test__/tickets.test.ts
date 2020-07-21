import { Ticket } from '../tickets'

it('implements optimistic concurrency control', async (done) => {
    //create a instance of a ticket
    const ticket = Ticket.build({
        title: 'con',
        price: 20,
        userId: '123'
    })
    //save the ticket to db
    await ticket.save()
    //fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id)
    const secondInstance = await Ticket.findById(ticket.id)
    //make two seperate changes to the ticket the we just fetched
    firstInstance!.set({ price: 30 })
    secondInstance!.set({ price: 40 })
    //save the first fetct ticket
    await firstInstance!.save()
    //save the second fetched ticket, this is gonna have outdated version number so we expect an error
    try {
        await secondInstance!.save()
    } catch (err) {
        return done()
    }
    throw new Error('Should not reach this point')
})

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: '123'
    })
    await ticket.save()
    expect(ticket.version).toEqual(0)

    await ticket.set({ title: 'eminem show' }).save()
    expect(ticket.version).toEqual(1)

    await ticket.set({ title: 'beatles show' }).save()
    expect(ticket.version).toEqual(2)
})