import React from 'react'
import serverError from '../server-error.png'
import { Helmet } from 'react-helmet'

const Error = () => {
  return (
    <div>
      <Helmet>
        <title>Connect | Server error</title>
      </Helmet>
      <img src={serverError} alt="Server Error" className='img-fluid h-full server-error-image' />
    </div>
  )
}

export default Error