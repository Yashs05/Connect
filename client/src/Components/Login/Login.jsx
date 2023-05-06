import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../../actions/auth'
import { validateEmail } from '../../utils/validation'
import logo from '../../connect-logo2.png'

const Login = () => {

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
        <div className='w-100 d-flex align-items-center'>
            <div className='container login-container my-5' style={{ width: '30%' }}>

                <div className='d-flex justify-content-center'>
                    <Link to='/'>
                        <img src={logo} alt="Connect" width={150} height={20} />
                    </Link>
                </div>

                <main className='py-4 px-4 my-4 bg-white box-shadow border-radius-10 login-form-container'>
                    <h3 className='mb-4 text-center fw-400'>Sign In</h3>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <div className="mb-3">
                                <label htmlFor="email" className={errors.find(err => err === 'email') ? 'text-danger' : 'text-secondary'}>Email address</label>
                                <input type="email" value={creds.email} name="email" className={`form-control padding-mobile ${errors.find(err => err === 'email') ? 'is-invalid' : 'border-input'}`} id='email' onChange={onChange} onBlur={handleFocusOut} />
                                <span className={`${!errors.find(err => err === 'email') ? 'd-none' : 'text-danger'} fs-small`}>Please provide a valid email address.</span>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className={errors.find(err => err === 'password') ? 'text-danger' : 'text-secondary'}>Password</label>
                                <div className="input-group">
                                    <input type={showPassword ? 'text' : 'password'} value={creds.password} name="password" className={`form-control padding-mobile ${errors.find(err => err === 'password') ? 'is-invalid' : 'border-input'}`} id='password' onChange={onChange} onBlur={handleFocusOut} />
                                    <button type='button' className="input-group-text color-main fw-500 fs-small" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'HIDE' : 'SHOW'}</button>
                                </div>
                                <span className={`${!errors.find(err => err === 'password') ? 'd-none' : 'text-danger'} fs-small`} >Please provide your password</span>
                                <div className='color-main mt-2 fw-400 fs-medium'>Forgot password?</div>
                            </div>
                        </div>

                        <div className='d-flex justify-content-center'>
                            <button type="submit" className="btn btn-primary px-5 py-2 border-radius-20">Sign In</button>
                        </div>
                    </form>
                </main>

                <section className='text-center'>
                    Don't have an account? <Link to='/register' className='color-main fw-500 text-decoration-none'>Sign up now</Link>
                </section>
            </div>
        </div>
    )
}

export default Login