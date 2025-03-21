import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', loginError: false, loginErrorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onLoginSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 1})
    const {history} = this.props
    history.replace('/')
  }

  onLoginFailure = errorMsg => {
    this.setState({loginError: true, loginErrorMsg: errorMsg})
  }

  loginSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const loginUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginUrl, options)
    const responseData = await response.json()
    if (response.ok === true) {
      this.onLoginSuccess(responseData.jwt_token)
    } else {
      this.onLoginFailure(responseData.error_msg)
    }
  }

  render() {
    const {username, password, loginError, loginErrorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg-container">
        <form className="login-form" onSubmit={this.loginSubmit}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="login-form-website-logo"
            alt="website logo"
          />
          <label htmlFor="username" className="label">
            USERNAME
          </label>
          <input
            type="text"
            id="username"
            className="input-field"
            placeholder="Username"
            onChange={this.onChangeUsername}
            value={username}
          />
          <label htmlFor="password" className="label">
            PASSWORD
          </label>
          <input
            type="password"
            id="password"
            className="input-field"
            placeholder="Password"
            onChange={this.onChangePassword}
            value={password}
          />
          <button type="submit" className="login-submit-button">
            Login
          </button>
          {loginError && <p className="login-error-msg">{loginErrorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
