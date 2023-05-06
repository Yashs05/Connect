import axios from "axios"
import socket from "../utils/socket"

export const fetchConnections = () => async dispatch => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_END_POINT}/api/connections`)

        dispatch({
            type: 'connections/setConnections',
            payload: response.data
        })
    } catch (err) {
        dispatch({
            type: 'connections/setError',
            payload: true
        })
    }
}

export const fetchConnectionsById = (id) => async dispatch => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_END_POINT}/api/connections/${id}`)

        dispatch({
            type: 'connections/setOtherConnections',
            payload: response.data
        })
    } catch (err) {
        dispatch({
            type: 'connections/setOtherConnectionsError',
            payload: true
        })
    }
}

export const sendConnectionRequest = (id) => async dispatch => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_END_POINT}/api/connections/sendrequest/${id}`)

        dispatch({
            type: 'connections/setConnections',
            payload: response.data
        })

        socket.emit('connectionEmit', id)
    } catch (err) {
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: err.response.data.msg,
                success: false
            }
        })
    }
}

export const acceptConnectionRequest = (id) => async dispatch => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_END_POINT}/api/connections/acceptrequest/${id}`)

        dispatch({
            type: 'connections/setConnections',
            payload: response.data
        })
        socket.emit('connectionEmit', id)
    } catch (err) {
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: err.response.data.msg,
                success: false
            }
        })
    }
}

export const cancelConnectionRequest = (id) => async dispatch => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_END_POINT}/api/connections/cancelrequest/${id}`)

        dispatch({
            type: 'connections/setConnections',
            payload: response.data
        })
        socket.emit('connectionEmit', id)
    } catch (err) {
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: err.response.data.msg,
                success: false
            }
        })
    }
}

export const declineConnectionRequest = (id) => async dispatch => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_END_POINT}/api/connections/declinerequest/${id}`)

        dispatch({
            type: 'connections/setConnections',
            payload: response.data
        })
        socket.emit('connectionEmit', id)
    } catch (err) {
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: err.response.data.msg,
                success: false
            }
        })
    }
}

export const removeConnection = (id) => async dispatch => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_END_POINT}/api/connections/removeconnection/${id}`)

        dispatch({
            type: 'connections/setConnections',
            payload: response.data
        })
        socket.emit('connectionEmit', id)
    } catch (err) {
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: err.response.data.msg,
                success: false
            }
        })
    }
}