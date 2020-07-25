import React, { useState } from 'react'
import router from 'next/router'
import useRequest from '../../hooks/useRequest'

const NewTicket = () => {
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')

    const { doRequest, errors } = useRequest({
        method: 'post',
        url: '/api/tickets',
        body: {
            title,
            price
        },
        onSuccess: () => router.push('/')
    })

    const submitHandler = async (e) => {
        e.preventDefault()

        doRequest()
    }

    const onBlur = () => {
        const value = parseFloat(price)
        if (isNaN(value)) return;
        setPrice(value.toFixed(2))
    }

    return (
        <div>
            <h1>Create a Ticket</h1>
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label>Title</label>
                    <input className="form-control" type="text" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input onBlur={onBlur} className="form-control" type="number" value={price} onChange={e => setPrice(e.target.value)} />
                </div>
                <button className="btn btn-primary">Submit</button>
            </form>
            {errors}
        </div>
    )
}

export default NewTicket
