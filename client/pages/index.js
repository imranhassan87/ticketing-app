import React from 'react'
import Link from 'next/link'

const LandingPage = ({ currentUser, tickets }) => {
    console.log(currentUser)

    const ticketList = tickets.map(({ title, id, price }) => {
        return <tr key={id}>
            <td>{title}</td>
            <td>{price}</td>
            <td>
                <Link href="/tickets/[ticketId]" as={`/tickets/${id}`}>
                    <a>View</a>
                </Link>
            </td>
        </tr>
    })

    return (
        <div>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketList}
                </tbody>
            </table>
        </div>
    )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/tickets')

    return { tickets: data }
}

export default LandingPage
