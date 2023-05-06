import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editUser } from '../actions/auth'
import { toFormData } from 'axios'
import Spinner from './Loader/Spinner'
import { Link } from 'react-router-dom'

const Account = () => {

    const dispatch = useDispatch()

    const { user } = useSelector(state => state.auth)

    const [creds, setCreds] = useState({
        name: '',
        password: '',
        newPassword: '',
        profilePicture: ''
    })

    const [showPassword, setShowPassword] = useState(false)

    const [showNewPassword, setShowNewPassword] = useState(false)

    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setCreds({
            ...creds,
            [e.target.name]: e.target.value
        })
    }

    const handlePhotoChange = (event) => {
        setCreds({
            ...creds,
            profilePicture: event.target.files[0]
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!creds.password.trim()) {
            dispatch({
                type: 'alert/showAlert',
                payload: {
                    msg: 'Please enter your current password.',
                    success: false
                }
            })
        }
        else {
            const formData = toFormData(creds)
            dispatch(editUser(formData, setLoading))
            setLoading(true)
        }
    }

    if (loading) return <Spinner />

    return (
        <main style={{ padding: '0 20rem' }} className='my-5 account-container'>
            <section>
                <h4 className='account-headings'>Your Account</h4>

                <div className='d-flex justify-content-between align-items-center bg-white border-radius-10 mb-5 px-4 py-4 account-cards'>
                    <img src={user.profilePicture} alt={user.name} width={150} height={150} className='rounded-circle me-4 account-image' />

                    <div className='text-end'>
                        <h4 className='fw-400 mb-0'>{user.name}</h4>
                        <div className='text-secondary mb-4'>{user.email}</div>

                        <Link to='/deleteaccount' className='px-3 py-1 text-decoration-none text-danger border-radius-20 border border-danger bg-hover-danger'>Delete account</Link>
                    </div>
                </div>
            </section>

            <section>
                <h4 className='account-headings'>Edit your account</h4>
                <div className='bg-white border-radius-10 mb-5 px-4 py-4 account-cards'>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className='text-secondary'>Change name</label>
                            <input type="text" value={creds.name} name="name" className='form-control border-input' id='name' onChange={handleChange} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="newPassword" className='text-secondary'>Change password</label>
                            <div className='input-group'>
                                <input type={showNewPassword ? 'text' : "password"} value={creds.newPassword} name="newPassword" className='form-control border-input' id='newPassword' onChange={handleChange} />
                                <button type='button' className="input-group-text color-main fw-500 fs-small" onClick={() => setShowNewPassword(!showNewPassword)}>{showNewPassword ? 'HIDE' : 'SHOW'}</button>
                            </div>
                            <ul className='mb-0 text-secondary'>
                                <li className='fs-small'>Password length: 6-15 characters</li>
                                <li className='fs-small'>Must contain a letter and a number</li>
                            </ul>
                        </div>

                        <div>
                            <label htmlFor="profilePicture" className='text-secondary'>Change profile picture</label>
                            <input type="file" className='form-control border-input' name="profilePicture" id="profilePicture" accept="image/*" onChange={handlePhotoChange} />
                            <div className='text-secondary text-end fs-small'>Maximum size : 1mb</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className='text-secondary'>Your current password <span className='fs-small'>(required)</span></label>
                            <div className='input-group'>
                                <input type={showPassword ? 'text' : "password"} value={creds.password} name="password" className='form-control border-input' id='password' onChange={handleChange} />
                                <button type='button' className="input-group-text color-main fw-500 fs-small" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'HIDE' : 'SHOW'}</button>
                            </div>
                        </div>

                        <div className='d-flex justify-content-end mt-4'>
                            <button type="submit" className="btn btn-primary px-4 py-2 border-radius-20" disabled={creds.password.trim() ? false : true}>Save changes</button>
                        </div>
                    </form>
                </div>
            </section>

        </main>
    )
}

export default Account