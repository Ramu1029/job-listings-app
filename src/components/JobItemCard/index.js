import {Link} from 'react-router-dom'
import {TiStarFullOutline} from 'react-icons/ti'
import {IoLocationSharp} from 'react-icons/io5'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobItemCard = props => {
  const {jobCardDetails} = props

  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    title,
    id,
    rating,
    packagePerAnnum,
  } = jobCardDetails

  return (
    <Link className="route-link" to={`/jobs/${id}`}>
      <div className="job-card">
        <div className="basic-company-info-section">
          <img
            src={companyLogoUrl}
            className="company-logo"
            alt="company logo"
          />
          <div className="title-rating-section">
            <h3 className="card-title">{title}</h3>
            <p className="rating">
              <TiStarFullOutline size={20} className="rating-star" /> {rating}
            </p>
          </div>
        </div>
        <hr className="job-card-separator" />
        <div className="job-meta-section">
          <div className="location-employment-section">
            <p className="job-meta">
              <IoLocationSharp size={23} />
              {location}
            </p>
            <p className="job-meta">
              <BsFillBriefcaseFill size={22} />
              {employmentType}
            </p>
          </div>
          <p className="package">{packagePerAnnum}</p>
        </div>
        <div>
          <h3 className="description-heading">Description</h3>
          <p className="card-description">{jobDescription}</p>
        </div>
      </div>
    </Link>
  )
}
export default JobItemCard
