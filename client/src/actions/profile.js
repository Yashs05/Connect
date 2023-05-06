import axios from "axios"
import socket from "../utils/socket"

export const loadProfile = id => async dispatch => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_END_POINT}/api/profile/${id}`)

        dispatch({
            type: 'profile/setProfile',
            payload: response.data
        })
    } catch (err) {
        if (err.response.status === 500) {
            dispatch({
                type: 'profile/setError',
                payload: err.response.data.msg
            })
        }
        else {
            dispatch({
                type: 'profile/setLoading',
                payload: false
            })
        }
    }
}

export const createProfile = (formData, profile, setUpdate) => async dispatch => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_END_POINT}/api/profile`, formData)

        dispatch({
            type: 'profile/setProfile',
            payload: response.data
        })
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: profile ? 'Profile updated successfully.' : 'Your profile has been created.',
                success: true
            }
        })
        setUpdate(false)
        socket.emit('profileEmit', response.data)
    } catch (err) {
        if (err.response.status === 500) {
            dispatch({
                type: 'profile/setError',
                payload: true
            })
        }
        else {
            dispatch({
                type: 'alert/showAlert',
                payload: {
                    msg: err.response.data.msg,
                    success: false
                }
            })
        }
    }
}

export const deleteProfile = (id) => async dispatch => {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_END_POINT}/api/profile/deleteprofile`)

        dispatch({
            type: 'profile/removeProfile'
        })
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: response.data.msg,
                success: true
            }
        })
        socket.emit('profileDelete', id)
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

export const addExperience = (formData, initialExpCreds, setExpCreds) => async dispatch => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_END_POINT}/api/profile/addexperience`, formData)

        document.getElementById("staticBackdrop").classList.remove("modal-backdrop", "show");
        dispatch({
            type: 'profile/setProfile',
            payload: response.data
        })
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: 'Experience added successfully.',
                success: true
            }
        })
        setExpCreds(initialExpCreds)
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

export const addEducation = (formData, initialEduCreds, setEduCreds) => async dispatch => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_END_POINT}/api/profile/addeducation`, formData)

        dispatch({
            type: 'profile/setProfile',
            payload: response.data
        })
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: 'Education added successfully.',
                success: true
            }
        })
        setEduCreds(initialEduCreds)
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

export const deleteExperience = (expId) => async dispatch => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_END_POINT}/api/profile/deleteexperience/${expId}`)

        dispatch({
            type: 'profile/setProfile',
            payload: response.data
        })
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: 'Experience deleted successfully.',
                success: true
            }
        })
    } catch (err) {
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: err.response.data.msg,
                success: true
            }
        })
    }
}

export const deleteEducation = (eduId) => async dispatch => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_END_POINT}/api/profile/deleteeducation/${eduId}`)

        dispatch({
            type: 'profile/setProfile',
            payload: response.data
        })
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: 'Education deleted successfully.',
                success: true
            }
        })
    } catch (err) {
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: err.response.data.msg,
                success: true
            }
        })
    }
}