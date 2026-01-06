import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showErrorMsg: false,
    errMsg: '',
  }

  onChangeUsername = event => {
    this.setState({
      username: event.target.value,
    })
  }

  onChangePassword = event => {
    this.setState({
      password: event.target.value,
    })
  }

  onSuccessfulSubmit = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 10})
    history.replace('/')
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const apiUrl = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    try {
      const response = await fetch(apiUrl, options)
      const data = await response.json()
      if (response.ok) {
        this.onSuccessfulSubmit(data.jwt_token)
      } else {
        this.setState({
          showErrorMsg: true,
          errMsg: data.error_msg,
        })
      }
    } catch (err) {
      console.log('Error:', err)
    }
  }

  render() {
    const {showErrorMsg, errMsg, username, password} = this.state
    if (Cookies.get('jwt_token') !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-page-container">
        <div className="login-form-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="app-logo"
            alt="website logo"
          />
          <form className="form-container" onSubmit={this.onSubmitLoginForm}>
            <div className="label-input-container">
              <label htmlFor="username" className="form-label">
                USERNAME
              </label>
              <br />
              <input
                type="text"
                id="username"
                className="form-input"
                onChange={this.onChangeUsername}
                value={username}
                placeholder="Username"
              />
            </div>
            <div className="label-input-container">
              <label htmlFor="password" className="form-label">
                PASSWORD
              </label>
              <br />
              <input
                type="password"
                id="password"
                className="form-input"
                onChange={this.onChangePassword}
                value={password}
                placeholder="Password"
              />
            </div>
            <input type="submit" className="submit-btn" value="Login" />
            {showErrorMsg && <p className="error-msg">*{errMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default LoginForm
