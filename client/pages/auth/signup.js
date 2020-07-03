import { useState } from 'react';
import useRequest from '../../hooks/useRequest'
import router from 'next/router';

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        method: 'post',
        url: '/api/users/signup',
        body: { email, password },
        onSuccess: () => router.push('/')
    })
    const onSubmit = async event => {
        event.preventDefault();

        doRequest()
        setEmail('')
        setPassword('')
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    className="form-control"
                />
            </div>
            {errors}
            <button className="btn btn-primary">Sign Up</button>
        </form>
    );
};
