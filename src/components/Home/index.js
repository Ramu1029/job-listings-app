import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = props => {
  return (
    <div className="home-page-container">
      <Header />
      <div className="home-content-container">
        <div className="description-container">
          <h1 className="home-heading">Find The Job That Fits Your Life</h1>
          <p className="home-description">
            Millions of people are searching for jobs, salary, information,
            company reviews. Find the jobs that fits your abilities and
            potential.
          </p>
          <Link to="/jobs" className="route-link">
            <button type="button" className="home-btn">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Home
