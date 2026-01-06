import './index.css'

const Notfound = () => (
  <div className="not-found-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
      className="not-found-img"
      alt="not found"
    />
    <h1 className="page-result-heading">Page Not Found</h1>
    <p className="page-not-found-error">
      We are sorry, the page you requested could not be found
    </p>
  </div>
)

export default Notfound
