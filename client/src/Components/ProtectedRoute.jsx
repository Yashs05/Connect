import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import Loader from './Loader/Loader'

const selectConnectionsState = state => state.connections.loading

const ProtectedRoute = ({ children }) => {

    const location = useLocation()

    const { isAuthenticated, loading } = useSelector(state => state.auth)
    const connectionsLoading = useSelector(selectConnectionsState)

    if (loading || connectionsLoading) {
        return <Loader />
    }

    if (!isAuthenticated) {
        return <Navigate to='/login' state={{ from: location }} replace />
    }

    return children
}

export default ProtectedRoute