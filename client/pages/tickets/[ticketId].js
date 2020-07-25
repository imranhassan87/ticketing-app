import React from 'react'
import useRequest from '../../hooks/useRequest'
import router from 'next/router'

const TicketShow = ({ ticket }) => {
    const { doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order) => router.push('/orders/[orderId]', `/orders/${order.id}`)
    })

    return <div>
        <h1>{ticket.title}</h1>
        <h4>price: {ticket.price}</h4>
        {errors}
        <button onClick={() => doRequest()} className="btn btn-primary">Purchase</button>
    </div>
}


TicketShow.getInitialProps = async (context, client) => {
    const { ticketId } = context.query
    const { data } = await client.get(`/api/tickets/${ticketId}`)

    return { ticket: data }
}

export default TicketShow