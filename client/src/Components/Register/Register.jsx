import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../actions/auth'
import { validateEmail, validatePassword } from '../../utils/validation'
import logo from '../../connect-logo2.png'

const Register = () => {

    const dispatch = useDispatch()

    const nav = useNavigate()

    const [creds, setCreds] = useState({
        name: '',
        email: '',
        password: '',
        profilePicture: ''
    })

    const [errors, setErrors] = useState([])

    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e) => {
        setCreds({
            ...creds,
            [e.target.name]: e.target.value
        })

        if (errors.find(err => err === e.target.name)) setErrors(errors => errors.filter(err => err !== e.target.name))
    }

    const handlePhotoChange = (event) => {
        setCreds({
            ...creds,
            profilePicture: event.target.files[0]
        })
    }

    const handleFocusOut = (e) => {

        switch (e.target.name) {
            case 'name':
                if (!e.target.value) {
                    setErrors([
                        ...errors,
                        e.target.name
                    ])
                }
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
                    setErrors([
                        ...errors,
                        e.target.name
                    ])
                }
                break;
            case 'password':
                if (!/^(?=.*\d)(?=.*[a-zA-Z]).{6,15}$/.test(e.target.value)) {
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
            { name: 'name', value: creds.name, validation: (value) => value.trim() !== '', message: 'Please provide your name.' },
            { name: 'email', value: creds.email, validation: (value) => validateEmail(value), message: 'Please provide a valid email address.' },
            { name: 'password', value: creds.password, validation: (value) => validatePassword(value), message: 'Password length must be between 6-15 characters and must contain atleast one letter and one number.' },
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

            formData.append('name', creds.name)
            formData.append('email', creds.email)
            formData.append('password', creds.password)
            formData.append('profilePicture', creds.profilePicture)

            dispatch(registerUser(formData, nav))
        }
    }

    return (
        <div className='w-100 d-flex align-items-center'>
            <div className='container my-5 register-container' style={{ width: '30%' }}>

                <div className='d-flex justify-content-center'>
                    <Link to='/'>
                        <img src={logo} alt="Connect" width={150} height={20} />
                    </Link>
                </div>

                <main className='py-4 px-4 my-4 bg-white box-shadow border-radius-10 register-form-container'>
                    <h3 className='mb-4 text-center fw-400'>Create Account</h3>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <div className="mb-3">
                                <label htmlFor="email" className={errors.find(err => err === 'email') ? 'text-danger' : 'text-secondary'}>Email address <span className='text-secondary fs-small'>(Cannot be changed later)</span></label>
                                <input type="email" value={creds.email} name="email" className={`form-control padding-mobile ${errors.find(err => err === 'email') ? 'is-invalid' : 'border-input'}`} id='email' onChange={handleChange} onBlur={handleFocusOut} />
                                <span className={`${!errors.find(err => err === 'email') ? 'd-none' : 'text-danger'} fs-small`}>Please provide a valid email address.</span>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="name" className={errors.find(err => err === 'name') ? 'text-danger' : 'text-secondary'}>Name <span className='text-secondary fs-small'>(To be displayed on your profile)</span></label>
                                <input type="text" value={creds.name} name="name" className={`form-control padding-mobile ${errors.find(err => err === 'name') ? 'is-invalid' : 'border-input'}`} id='name' onChange={handleChange} onBlur={handleFocusOut} />
                                <span className={`${!errors.find(err => err === 'name') ? 'd-none' : 'text-danger'} fs-small`}>Please provide your name.</span>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className={errors.find(err => err === 'password') ? 'text-danger' : 'text-secondary'}>Choose a password</label>
                                <div className="input-group">
                                    <input type={showPassword ? 'text' : 'password'} value={creds.password} name="password" className={`form-control padding-mobile ${errors.find(err => err === 'password') ? 'is-invalid' : 'border-input'}`} id='password' onChange={handleChange} onBlur={handleFocusOut} />
                                    <button type='button' className="input-group-text color-main fw-500 fs-small" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'HIDE' : 'SHOW'}</button>
                                </div>
                                <span className={`${!errors.find(err => err === 'password') ? 'd-none' : 'text-danger d-inline-flex'} fs-small`} >Password length must be between 6-15 characters and must contain atleast one letter and one number.</span>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="profilePicture" className='text-secondary'>Choose your profile picture <span className='fs-small'>(Optional)</span></label>
                                <input type="file" className='form-control padding-mobile border-input' name="profilePicture" id="profilePicture" accept="image/*" onChange={handlePhotoChange} />
                                <div className='text-secondary text-end fs-small'>Maximum size : 1mb</div>
                            </div>
                        </div>

                        <div className='d-flex justify-content-center'>
                            <button type="submit" className="btn btn-primary px-5 py-2 border-radius-20">Sign Up</button>
                        </div>
                    </form>
                </main>

                <section className='text-center'>
                    Already on Connect? <Link to='/login' className='color-main fw-500 text-decoration-none'>Sign In</Link>
                </section>
            </div>
        </div>
    )
}

export default Register