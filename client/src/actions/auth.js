import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import { fetchConnections } from './connections'
import socket from '../utils/socket'

// Register user
export const registerUser = (formData, nav) => async dispatch => {

    try {
        const response = await axios.post(`${process.env.REACT_APP_END_POINT}/api/users`, formData)

        dispatch({
            type: 'auth/setLoading',
            payload: true
        })

        dispatch({
            type: 'auth/setToken',
            payload: response.data.token
        })

        dispatch(loadUser('register', nav))
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

// Load user
export const loadUser = (type, nav) => async dispatch => {
    setAuthToken(localStorage.token)

    try {
        const response = await axios.get(`${process.env.REACT_APP_END_POINT}/api/auth`)

        dispatch({
            type: 'auth/setUser',
            payload: response.data
        })

        dispatch(fetchConnections())

        if (type === 'register') {
            dispatch({
                type: 'alert/showAlert',
                payload: {
                    msg: 'Sign up successful.',
                    success: true
                }
            })
        } else {
            dispatch({
                type: 'alert/showAlert',
                payload: {
                    msg: `Hey ${response.data.name}, welcome back.`,
                    success: true
                }
            })
        }

        if (nav) nav('/')
        socket.connect()
        socket.emit('join', response.data._id)
    } catch (err) {
        if (err.response.status === 500) {
            dispatch({
                type: 'auth/setError',
                payload: true
            })
        }
        else {
            dispatch({
                type: 'auth/setLoading',
                payload: false
            })
        }
        dispatch({
            type: 'connections/setLoading',
            payload: false
        })
        dispatch({
            type: 'auth/removeUser'
        })
    }
}

// Log in user
export const loginUser = (formData, nav) => async dispatch => {

    try {
        const response = await axios.post(`${process.env.REACT_APP_END_POINT}/api/auth`, formData)

        dispatch({
            type: 'auth/setLoading',
            payload: true
        })
        dispatch({
            type: 'connections/setLoading',
            payload: true
        })

        dispatch({
            type: 'auth/setToken',
            payload: response.data.token
        })

        dispatch(loadUser('', nav))
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

// Edit user setUser

export const editUser = (formData, setLoading) => async dispatch => {

    try {
        const response = await axios.put(`${process.env.REACT_APP_END_POINT}/api/users`, formData)

        dispatch({
            type: 'auth/setUser',
            payload: response.data
        })

        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: 'Account updated successfully.',
                success: true
            }
        })
        setLoading(false)
    } catch (err) {
        setLoading(false)
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: err.response.data.msg,
                success: false
            }
        })
    }
}

// Log out user
export const logout = nav => dispatch => {
    dispatch({
        type: 'auth/removeUser'
    })
    dispatch({
        type: 'profile/removeProfile'
    })
    dispatch({
        type: 'connections/removeConnections'
    })
    dispatch({
        type: 'posts/setDefault'
    })
    setAuthToken()
    nav('/', { replace: true })
}

// Delete user
export const deleteUser = formData => async dispatch => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_END_POINT}/api/users/deleteuser`, formData)

        dispatch({
            type: 'auth/removeUser'
        })
        dispatch({
            type: 'profile/removeProfile'
        })
        dispatch({
            type: 'connections/removeConnections'
        })
        dispatch({
            type: 'posts/setDefault'
        })
        setAuthToken()
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: response.data.msg,
                success: true
            }
        })
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