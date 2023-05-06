import React from 'react'
import Account from '../Components/Account'
import { useSelector } from 'react-redux'
import Error from '../Components/Error'
import Navbar from '../Components/Navbar/Navbar'
import { Helmet } from 'react-helmet'

const AccountPage = () => {

    const { error } = useSelector(state => state.auth)

    if (error) return <Error />

    return (
        <>
            <Helmet>
                <title>Connect | Account</title>
            </Helmet>

            <Navbar />
            <Account />
        </>
    )
}

export default AccountPage