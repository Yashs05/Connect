import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const selectAlertState = state => state.alert

const Alert = () => {

    const dispatch = useDispatch()

    const { msg, success } = useSelector(selectAlertState)

    const handleClick = () => {
        dispatch({
            type: 'alert/hideAlert',
            payload: {
                display: false,
                msg: '',
                success: null
            }
        })
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            dispatch({
                type: 'alert/hideAlert',
                payload: {
                    display: false,
                    msg: '',
                    success: null
                }
            })
        }, 5000)
        return () => {
            clearTimeout(timeout)
        }
    }, [dispatch, msg])

    return (
        <div className={`d-inline-block position-fixed border-radius-5 alert main-alert py-3 px-3 ${success ? 'bg-success' : 'bg-danger'}`}
            style={{ boxShadow: 'rgb(75 75 75) 0px 0px 30px -5px', bottom: 30, left: '50%', transform: 'translateX(-50%)' }}>
            <div className='d-flex align-items-center text-white'>
                <i className={`me-2 fa-solid fa-${success ? 'check' : 'triangle-exclamation'}`}></i>
                <span className='fw-100'>{msg}</span>

                <button type='button' className='d-flex ms-3' style={{ backgroundColor: 'unset', border: 'none' }} onClick={handleClick}>
                    <i className="fa-solid fa-xmark fa-lg text-white"></i>
                </button>
            </div>
        </div>
    )
}

export default Alert