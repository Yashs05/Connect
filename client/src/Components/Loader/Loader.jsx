import React from 'react'
import logo from '../../connect-logo2.png'
import './loader.css'

const Loader = () => {
    return (
        <div className='w-100 bg-main d-flex justify-content-center'>
            <div className='d-flex flex-column align-items-center' style={{ width: 'fit-content', marginTop: '12rem' }}>
                <img src={logo} alt="Connect" width={200} className='mb-4' />
                <div className='w-75 position-relative loading-bar'></div>
            </div>
        </div>
    )
}

export default Loader