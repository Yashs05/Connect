import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../Components/Navbar/Navbar'
import { fetchConnectionsById } from '../actions/connections'
import { useParams } from 'react-router-dom'
import Connections from '../Components/Connections/Connections'
import Spinner from '../Components/Loader/Spinner'
import { Helmet } from 'react-helmet'

const ConnectionsPage = () => {

    const dispatch = useDispatch()

    const { id } = useParams()

    const { user } = useSelector(state => state.auth)

    const { connections, otherConnections, otherConnectionsLoading, otherConnectionsError } = useSelector(state => state.connections)

    useEffect(() => {
        dispatch(fetchConnectionsById(id))

        return () => {
            dispatch({
                type: 'connections/setOtherConnectionsDefault'
            })
        }
    }, [dispatch, id])

    if (otherConnectionsError) return (
        <main className='d-flex flex-column align-items-center my-5'>
            <h3 className='color-main'>Something went wrong</h3>
            <div className='mb-3'>Either this page does not exist or we might be having some issues.</div>
        </main>
    )

    return (
        <>
            <Helmet>
                <title>Connect | Connections</title>
            </Helmet>
            <Navbar />
            {otherConnectionsLoading ?
                <Spinner /> :
                <Connections connections={id === user._id ? connections : otherConnections} user={user} id={id} />
            }
        </>
    )
}

export default ConnectionsPage