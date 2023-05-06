import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../../actions/auth'
import { validateEmail } from '../../utils/validation'

import peopleFindImg from '../../people_find.png'

const LoginHome = () => {

    const dispatch = useDispatch()

    const nav = useNavigate()

    const [creds, setCreds] = useState({
        email: '',
        password: '',
    })

    const [errors, setErrors] = useState([])

    const [showPassword, setShowPassword] = useState(false)

    const onChange = (e) => {
        setCreds({
            ...creds,
            [e.target.name]: e.target.value
        })

        if (errors.find(err => err === e.target.name)) setErrors(errors => errors.filter(err => err !== e.target.name))
    }

    const handleFocusOut = (e) => {

        switch (e.target.name) {
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
                    setErrors([
                        ...errors,
                        e.target.name
                    ])
                }
                break;
            case 'password':
                if (!e.target.value.trim()) {
                    setErrors([
                        ...errors,
                        e.target.name
                    ])
                }
                break;

            default:
                break;
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const onSubmitErrors = []

        const inputs = [
            { name: 'email', value: creds.email, validation: (value) => validateEmail(value), message: 'Please provide a valid email address.' },
            { name: 'password', value: creds.password, validation: (value) => value.trim() !== '', message: 'Please provide your password.' },
        ];

        inputs.forEach((input) => {
            if (!input.validation(input.value)) {
                onSubmitErrors.push(input.name);
            }
        });

        if (onSubmitErrors.length) {
            setErrors(onSubmitErrors);
        }
        else {
            const formData = new FormData()

            formData.append('email', creds.email)
            formData.append('password', creds.password)

            dispatch(loginUser(formData, nav))
        }
    }

    return (
        <div className='d-flex flex-wrap justify-content-center my-5 login-home'>
            <div className='w-50 login-home-main mb-5' style={{ paddingInlineStart: '12rem' }}>
                <h1 className='mb-4 fw-400 text-secondary'>Connect professionally with the community</h1>

                <main className='w-75 form-container'>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <div className="mb-3">
                                <label htmlFor="email" className={errors.find(err => err === 'email') ? 'text-danger' : 'text-secondary'}>Email address</label>
                                <input type="email" value={creds.email} name="email" className={`form-control py-3 ${errors.find(err => err === 'email') ? 'is-invalid' : 'border-input'}`} id='email' onChange={onChange} onBlur={handleFocusOut} />
                                <span className={`${!errors.find(err => err === 'email') ? 'd-none' : 'text-danger'} fs-small`}>Please provide a valid email address.</span>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className={errors.find(err => err === 'password') ? 'text-danger' : 'text-secondary'}>Password</label>
                                <div className="input-group">
                                    <input type={showPassword ? 'text' : 'password'} value={creds.password} name="password" className={`form-control py-3 ${errors.find(err => err === 'password') ? 'is-invalid' : 'border-input'}`} id='password' onChange={onChange} onBlur={handleFocusOut} />
                                    <button type='button' className="input-group-text color-main fw-500 fs-small" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'HIDE' : 'SHOW'}</button>
                                </div>
                                <span className={`${!errors.find(err => err === 'password') ? 'd-none' : 'text-danger'} fs-small`} >Please provide your password</span>
                                <div className='color-main mt-2 fw-400 fs-medium'>Forgot password?</div>
                            </div>
                        </div>

                        <div className='d-flex justify-content-center mb-4'>
                            <button type="submit" className="w-100 btn btn-primary text-white py-2 border-radius-20">Sign In</button>
                        </div>
                    </form>

                    <div className='d-flex justify-content-center'>
                        <Link to='/register' className='w-100 py-2 text-center text-decoration-none border border-dark border-radius-20'>Don't have an account? Sign up now</Link>
                    </div>
                </main>
            </div>

            <div className='w-50 login-home-people-container'>
                <img src={peopleFindImg} alt="Find People" style={{ width: '100%' }} />

                <div className='d-flex justify-content-end login-home-people-btn' style={{ marginInlineEnd: '12rem' }}>
                    <Link to='/people' className='px-5 py-2 text-center text-decoration-none btn btn-primary text-white border-radius-20'>
                        <span className='me-2'>Find people</span>
                        <i className="fa-solid fa-magnifying-glass fa-sm"></i>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LoginHome