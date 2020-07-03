import React from 'react'
import buildClient from '../api/build-client'

const LandingPage = ({ currentUser }) => {
    console.log(currentUser)
    return (
        <div>
            NEXT JS
            {currentUser ? <h4>You are Signed in</h4> : <h4>You are not signed in</h4>}
        </div>
    )
}

LandingPage.getInitialProps = async (context) => {

    const { data } = await buildClient(context).get('/api/users/currentuser')
    return data
}

export default LandingPage
