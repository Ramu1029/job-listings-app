import {TiStarFullOutline} from 'react-icons/ti'
import {IoLocationSharp} from 'react-icons/io5'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobs = props => {
  const {similarJobItem} = props

  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    rating,
    location,
    title,
  } = similarJobItem
  return (
    <div className="similar-job-card">
      <div className="basic-company-info-section">
        <img
          src={companyLogoUrl}
          className="similar-job-company-logo"
          alt="similar job company logo"
        />
        <div>
          <h1 className="similar-job-title">{title}</h1>
          <div className="star-rating-container">
            <TiStarFullOutline size={18} className="rating-star" />
            <p className="rating">{rating}</p>
          </div>
        </div>
      </div>
      <div>
        <h1 className="card-sub-heading">Description</h1>
        <p className="card-description">{jobDescription}</p>
      </div>
      <div className="location-employment-section">
        <div className="job-meta-data-container">
          <IoLocationSharp size={20} className="meta-data-icon" />
          <p className="meta-data">{location}</p>
        </div>
        <div className="job-meta-data-container">
          <BsFillBriefcaseFill size={20} className="meta-data-icon" />
          <p className="meta-data">{employmentType}</p>
        </div>
      </div>
    </div>
  )
}

export default SimilarJobs
