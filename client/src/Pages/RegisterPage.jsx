import React from 'react'
import Register from '../Components/Register/Register'
import { Helmet } from 'react-helmet'

const RegisterPage = () => {
  return (
    <>
      <Helmet>
        <title>Connect | Sign up</title>
      </Helmet>
      <Register />
    </>
  )
}

export default RegisterPage