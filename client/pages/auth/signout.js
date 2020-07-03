import React, { useEffect } from 'react'
import router from 'next/router'
import useRequest from '../../hooks/useRequest'

const signout = () => {
    const { doRequest } = useRequest({
        url: '/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => router.push('/')
    })
    useEffect(() => {
        doRequest()
    }, [])
    return (
        <div>
            signing you out...
        </div>
    )
}

export default signout
