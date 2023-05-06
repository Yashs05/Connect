import React from 'react'
import { useSelector } from 'react-redux'
import LoginHome from '../Components/Login/LoginHome'
import Navbar from '../Components/Navbar/Navbar'
import Loader from '../Components/Loader/Loader'
import Error from '../Components/Error'
import Posts from '../Components/Posts/Posts'

const selectConnetionsState = state => [state.connections.loading, state.connections.error]

const HomePage = () => {

    const { user, loading, error } = useSelector(state => state.auth)
    const [ connectionsLoading, connectionsError ] = useSelector(selectConnetionsState)

    if (error || connectionsError) return <Error />

    if (loading || connectionsLoading) {
        return <Loader />
    }

    return (
        <>
            <Navbar />
            {user ?
                <Posts /> :
                <LoginHome />
            }
        </>
    )
}

export default HomePage