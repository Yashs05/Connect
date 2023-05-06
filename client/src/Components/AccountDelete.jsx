import React, { useState } from 'react'
import logo from '../connect-logo2.png'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { deleteUser } from '../actions/auth'
import { toFormData } from 'axios'

const AccountDelete = () => {

    const dispatch = useDispatch()

    const [password, setPassword] = useState('')

    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!password.trim()) {
            dispatch({
                type: 'alert/showAlert',
                payload: {
                    msg: 'Please provide your password.',
                    success: false
                }
            })
        }
        else {
            const formData = toFormData({password: password})
            dispatch(deleteUser(formData))
        }
    }

    return (
        <div className='container my-5 account-delete-container' style={{ width: '30%' }}>
            <div className='d-flex justify-content-center'>
                <Link to='/'>
                    <img src={logo} alt="Connect" width={150} height={20} />
                </Link>
            </div>

            <main className='mt-5 bg-white px-3 py-3 border-radius-10'>
                <form className='mb-4' onSubmit={handleSubmit}>
                    <label htmlFor="password" className='mb-2'>To continue deleting account, enter your password</label>
                    <div className='input-group mb-4'>
                        <input type={showPassword ? 'text' : "password"} value={password} className='form-control border-input' id='password' onChange={(e) => setPassword(e.target.value)} />
                        <button type='button' className="input-group-text color-main fw-500 fs-small" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'HIDE' : 'SHOW'}</button>
                    </div>

                    <div className='d-flex justify-content-center'>
                        <button type='submit' className='btn btn-danger fs-medium border-radius-20' disabled={password.trim() ? false : true}>Delete account</button>
                    </div>
                </form>

                <div className='border-top pt-3'>
                    <i className="fa-solid fa-triangle-exclamation me-1 text-danger"></i>
                    <span className='text-danger'>Note: <span className='fs-medium text-secondary'>Account once deleted cannot be retrieved again.</span></span>
                </div>
            </main>
        </div>
    )
}

export default AccountDelete