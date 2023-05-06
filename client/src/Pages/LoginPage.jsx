import React from 'react'
import Login from '../Components/Login/Login'
import { Helmet } from 'react-helmet'

const LoginPage = () => {
    return (
        <>
            <Helmet>
                <title>Connect | Sign in</title>
            </Helmet>
            <Login />
        </>
    )
}

export default LoginPage