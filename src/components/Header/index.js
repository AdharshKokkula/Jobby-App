import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <div className="header-bg-container">
      <ul className="header-content">
        <Link to="/">
          <li>
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              className="navbar-website-logo"
              alt="website logo"
            />
          </li>
        </Link>
        <li className="navbar-items-container">
          <Link to="/" className="navbar-item-link">
            <p className="navbar-item">Home</p>
          </Link>
          <Link to="/jobs" className="navbar-item-link">
            <p className="navbar-item">Jobs</p>
          </Link>
        </li>
        <li>
          <button type="button" className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Header)
