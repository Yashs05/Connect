import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../../connect-logo.png'
import './navbar.css'
import { logout } from '../../actions/auth'

const Navbar = () => {

  const dispatch = useDispatch()

  const nav = useNavigate()

  const { isAuthenticated, user } = useSelector(state => state.auth)
  const { connections } = useSelector(state => state.connections)

  const handleSignout = () => {
    dispatch(logout(nav))
  }

  return (
    <nav className='d-flex justify-content-between align-items-center bg-white sticky-top top-navbar'>
      <Link to='/'>
      <img src={logo} alt="Logo" className='navbar-logo' width={130} height={18} />
      </Link>

      <div className='d-flex align-items-center'>
        <ul className={`d-flex mb-0 list-unstyled ${window.screen.width < 600 ? !isAuthenticated ? 'mobile-ul-after' : 'top-navbar-ul-mobile' : 'top-navbar-ul'}`}>
          {isAuthenticated ?
            <>
              <li>
                <NavLink to={`/${user._id}/posts`} className={({ isActive }) => `d-flex flex-column align-items-center px-3 py-3 line-height-normal text-decoration-none ${isActive ? 'color-main active-border' : 'navbar-items-color'}`}>
                  <i className="fa-solid fa-images fs-icons mb-1"></i>
                  <span className='fs-medium'>Posts</span>
                </NavLink>
              </li>

              <li>
                <NavLink to={`/${user._id}/connections`} className={({ isActive }) => `d-flex px-3 py-3 line-height-normal text-decoration-none ${isActive ? 'color-main active-border' : 'navbar-items-color'}`}>
                  <div className='d-flex flex-column align-items-center position-relative'>
                    <i className="fa-solid fa-user-group fs-icons mb-1 position-relative"></i>
                    <span className='fs-medium'>Connections</span>
                    {connections?.requestsReceived?.length ?
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger fw-500">
                        {connections.requestsReceived.length}
                      </span> : null}
                  </div>
                </NavLink>
              </li>
            </> : null
          }

          <li>
            <NavLink to='/people' className={({ isActive }) => `d-flex flex-column align-items-center px-3 py-3 line-height-normal text-decoration-none ${isActive ? 'color-main active-border' : 'navbar-items-color'}`}>
              <i className="fa-solid fa-magnifying-glass fs-icons mb-1"></i>
              <span className='fs-medium'>People</span>
            </NavLink>
          </li>
        </ul>
        <div className='ps-4 navbar-profile-btn'>
          {isAuthenticated ?
            <div className="dropdown-menu-end">
              <button
                className="dropdown-toggle border-0 navbar-image-btn"
                style={{ backgroundColor: 'unset', zIndex: 100 }}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                <img src={user.profilePicture} alt={user.name} width={35} height={35} className='rounded-circle' />
              </button>
              <ul className="dropdown-menu box-shadow">
                <li>
                  <Link className="dropdown-item profile-link" to={`/${user._id}`}>
                    <div className='d-flex align-items-center mb-2'>
                      <img src={user.profilePicture} alt={user.name} width={60} height={60} className='rounded-circle me-3' />
                      <div>
                        <h5 className='mb-0 line-height-normal'>{user.name}</h5>
                        <span className='text-secondary fs-small'>{user.email}</span>
                      </div>
                    </div>

                    <button type='button' className='w-100 py-1 color-main border-radius-20 fs-medium border-main bg-white bg-hover-main'>View or edit profile</button>
                  </Link>
                </li>

                <li><hr className="dropdown-divider" /></li>

                <li><h6 className='dropdown-item fw-500 mb-0 profile-link'>Account</h6></li>
                <li><Link className="dropdown-item text-secondary fs-medium dropdown-item-hover" to="/account">View or edit account</Link></li>
                <li><Link className="dropdown-item text-secondary fs-medium dropdown-item-hover" to="/account">Change password</Link></li>
                <li><Link className="dropdown-item text-secondary fs-medium dropdown-item-hover" to="/deleteaccount">Delete account</Link></li>

                <li><hr className="dropdown-divider" /></li>

                <li className='dropdown-item'>
                  <button className='w-100 py-1 text-danger border-radius-20 border border-danger bg-white bg-hover-danger' onClick={handleSignout}>Sign out</button>
                </li>
              </ul>
            </div> :
            <>
              <Link to='/login' className='no-word-break px-3 py-2 me-2 text-secondary text-decoration-none border-radius-20 bg-hover-main'>Sign In</Link>
              <Link to='/register' className='no-word-break px-3 py-2 color-main text-decoration-none border-radius-20 border-main bg-hover-main'>Sign Up</Link>
            </>
          }
        </div>
      </div>
    </nav>
  )
}

export default Navbar