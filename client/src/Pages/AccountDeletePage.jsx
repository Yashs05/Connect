import React from 'react'
import Alert from '../Components/Alert/Alert'
import AccountDelete from '../Components/AccountDelete'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'

const AccountDeletePage = () => {

    const { display } = useSelector(state => state.alert)

    return (
        <>
            <Helmet>
                <title>Connect | Delete account</title>
            </Helmet>

            <AccountDelete />
            {display ? <Alert /> : null}
        </>
    )
}

export default AccountDeletePage