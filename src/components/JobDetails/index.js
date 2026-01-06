import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {TiStarFullOutline} from 'react-icons/ti'
import {IoLocationSharp} from 'react-icons/io5'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'
import Header from '../Header'
import SkillBadge from '../SkillBadge'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  pending: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class JobDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobItemDetails: {},
    similarJobsList: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getFilteredData = jobDetails => ({
    companyLogoUrl: jobDetails.company_logo_url,
    companyWebsiteUrl: jobDetails.company_website_url,
    employmentType: jobDetails.employment_type,
    id: jobDetails.id,
    title: jobDetails.title,
    jobDescription: jobDetails.job_description,
    location: jobDetails.location,
    packagePerAnnum: jobDetails.package_per_annum,
    rating: jobDetails.rating,
    skills: jobDetails.skills,
    lifeAtCompany: jobDetails.life_at_company,
    similarJobs: jobDetails.similar_jobs,
  })

  getSimilarJobsFiltereddata = jobDetails => ({
    companyLogoUrl: jobDetails.company_logo_url,
    employmentType: jobDetails.employment_type,
    id: jobDetails.id,
    jobDescription: jobDetails.job_description,
    location: jobDetails.location,
    title: jobDetails.title,
    rating: jobDetails.rating,
  })

  getJobItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.pending})
    const {match} = this.props
    const {id} = match.params
    const userAuthToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${userAuthToken}`},
    }

    try {
      const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
      if (response.ok) {
        const data = await response.json()
        console.log('data: ', data)
        const {job_details: jobDetails, similar_jobs: similarJobs} = data
        const {skills, life_at_company: lifeAtCompany} = jobDetails
        const filteredSkillsList = skills.map(eachSkill => ({
          name: eachSkill.name,
          imageUrl: eachSkill.image_url,
        }))
        const filteredLifeAtCompanyData = {
          description: lifeAtCompany.description,
          imageUrl: lifeAtCompany.image_url,
        }
        const filteredSimilarJobsList = similarJobs.map(eachJob =>
          this.getSimilarJobsFiltereddata(eachJob),
        )
        const filteredJobDetails = this.getFilteredData(jobDetails)
        console.log('job details: ', filteredJobDetails)
        console.log('similar jobs: ', filteredSimilarJobsList)
        this.setState({
          apiStatus: apiStatusConstants.success,
          jobItemDetails: {
            ...filteredJobDetails,
            skills: filteredSkillsList,
            lifeAtCompany: filteredLifeAtCompanyData,
          },
          similarJobsList: filteredSimilarJobsList,
        })
      } else {
        this.setState({
          apiStatus: apiStatusConstants.failure,
        })
      }
    } catch (err) {
      console.log('error: ', err)
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderJobDetailsSection = () => {
    const {jobItemDetails, similarJobsList} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      title,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      skills,
    } = jobItemDetails

    return (
      <div className="responsive-container">
        <div className="job-details-card">
          <div className="basic-company-info-section">
            <img
              src={companyLogoUrl}
              className="company-logo"
              alt="job details company logo"
            />
            <div className="title-rating-section">
              <h1 className="card-title">{title}</h1>
              <div className="star-rating-container">
                <TiStarFullOutline size={20} className="rating-star" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <hr className="job-details-card-separator" />
          <div className="job-meta-section">
            <div className="location-employment-section">
              <div className="job-meta-data-container">
                <IoLocationSharp size={23} className="meta-data-icon" />
                <p className="meta-data">{location}</p>
              </div>
              <div className="job-meta-data-container">
                <BsFillBriefcaseFill size={22} className="meta-data-icon" />
                <p className="meta-data">{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>

          <div className="description-visit-section">
            <h1 className="card-sub-heading">Description</h1>

            <a
              href={companyWebsiteUrl}
              className="visit"
              target="_blank"
              rel="noreferrer"
            >
              Visit
              <FiExternalLink size={20} />
            </a>
          </div>
          <p className="card-description">{jobDescription}</p>
          <div className="skills-section">
            <h1 className="card-sub-heading">Skills</h1>
            <ul className="skills-container">
              {skills.map(eachSkill => (
                <SkillBadge key={eachSkill.name} skillDetails={eachSkill} />
              ))}
            </ul>
          </div>
          {this.renderLifeAtCompanySection()}
        </div>
        <div className="similar-jobs-section">
          <h1 className="card-sub-heading">Similar jobs</h1>
          <div className="similar-jobs-container">
            {similarJobsList.map(eachJobItem => (
              <SimilarJobs key={eachJobItem.id} similarJobItem={eachJobItem} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  renderLifeAtCompanySection = () => {
    const {jobItemDetails} = this.state
    const {lifeAtCompany} = jobItemDetails
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="life-at-company-section">
        <h1 className="card-sub-heading">Life At Company</h1>
        <div className="life-at-company-description-img-section">
          <p className="card-description">{description}</p>
          <img
            src={imageUrl}
            className="company-environment-img"
            alt="life at company"
          />
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-img"
        alt="failure view"
      />
      <h1 className="api-failure-error-msg">Oops! Something Went Wrong</h1>
      <p className="api-failure-response-msg">
        We cannot seem to find the page you are looking for.
      </p>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    let jobDetailsBasedOnApiResponse
    switch (apiStatus) {
      case apiStatusConstants.success:
        jobDetailsBasedOnApiResponse = this.renderJobDetailsSection()
        break
      case apiStatusConstants.pending:
        jobDetailsBasedOnApiResponse = this.renderLoader()
        break
      case apiStatusConstants.failure:
        jobDetailsBasedOnApiResponse = this.renderFailureView()
        break
      default:
        jobDetailsBasedOnApiResponse = null
        break
    }
    return (
      <div className="job-details-container">
        <Header />
        {jobDetailsBasedOnApiResponse}
      </div>
    )
  }
}

export default JobDetails
