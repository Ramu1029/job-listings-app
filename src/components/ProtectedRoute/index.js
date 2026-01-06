import {Route, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = ({component: Component, ...rest}) => {
  const token = Cookies.get('jwt_token')

  if (!token) {
    return <Redirect to="/login" />
  }

  return (
    <Route
      {...rest}
      render={routeProps => <Component {...routeProps} {...rest} />}
    />
  )
}

export default ProtectedRoute
