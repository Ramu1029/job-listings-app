import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {IoMdHome} from 'react-icons/io'
import {FiLogOut} from 'react-icons/fi'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="header-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="website-logo"
          alt="website logo"
        />
      </Link>
      <div className="mobile-device-nav-items-container">
        <Link className="mobile-view-nav-link" to="/">
          <IoMdHome size={24} color="#ffffff" />
        </Link>
        <Link className="mobile-view-nav-link" to="/jobs">
          <BsFillBriefcaseFill size={20} color="#ffffff" />
        </Link>
        <button
          type="button"
          className="mobile-view-logout-btn"
          onClick={onClickLogout}
        >
          <FiLogOut size={20} color="#ffffff" />
        </button>
      </div>
      <ul className="large-device-route-links-list-container">
        <li>
          <Link to="/" className="route-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="route-link">
            Jobs
          </Link>
        </li>
      </ul>
      <button type="button" className="logout-btn" onClick={onClickLogout}>
        Logout
      </button>
    </div>
  )
}
export default withRouter(Header)
