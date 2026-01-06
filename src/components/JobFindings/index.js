import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import FilterItem from '../FilterItem'
import JobItemCard from '../JobItemCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  pending: 'IN_PENDING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobFindings extends Component {
  state = {
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
    profileDetails: {},
    jobsDetailsList: [],
    activeEmploymentFilters: [],
    activeSalaryFilterId: '',
    searchInputVal: '',
  }

  componentDidMount() {
    console.log('Api fetches here')
    this.getProfileDetails()
    this.getJobsDetails()
  }

  onSearchInputChange = event => {
    this.setState({
      searchInputVal: event.target.value,
    })
  }

  onSearchJobs = () => {
    this.getJobsDetails()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsDetails()
    }
  }

  onRetryJobsDetails = () => {
    this.getJobsDetails()
  }

  onRetryProfileAPI = () => {
    this.getProfileDetails()
  }

  getJobsDetails = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.pending})
    const {activeEmploymentFilters, activeSalaryFilterId, searchInputVal} =
      this.state
    const userJwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentFilters.join(
      ',',
    )}&minimum_package=${activeSalaryFilterId}&search=${searchInputVal}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${userJwtToken}`},
    }

    try {
      const response = await fetch(apiUrl, options)
      const data = await response.json()
      console.log('jobs data:', data)
      console.log('response status: ', response.status)
      if (response.ok) {
        const formatedJobsData = data.jobs.map(eachItem =>
          this.getJobFormatedData(eachItem),
        )
        this.setState({
          jobsApiStatus: apiStatusConstants.success,
          jobsDetailsList: formatedJobsData,
        })
      } else {
        this.setState({jobsApiStatus: apiStatusConstants.failure})
      }
    } catch {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  getJobFormatedData = jobItem => ({
    companyLogoUrl: jobItem.company_logo_url,
    employmentType: jobItem.employment_type,
    jobDescription: jobItem.job_description,
    location: jobItem.location,
    packagePerAnnum: jobItem.package_per_annum,
    rating: jobItem.rating,
    id: jobItem.id,
    title: jobItem.title,
  })

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.pending})
    const userJwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${userJwtToken}`},
    }
    try {
      const response = await fetch('https://apis.ccbp.in/profile', options)
      console.log('response status: ', response.status)
      if (response.ok) {
        const data = await response.json()
        const {profile_details: profileInfo} = data
        console.log('Profile Data:', data)
        console.log('Profile info:', profileInfo)
        const formatedProfileData = {
          name: profileInfo.name,
          profileImageUrl: profileInfo.profile_image_url,
          shortBio: profileInfo.short_bio,
        }
        this.setState({
          profileDetails: formatedProfileData,
          profileApiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({profileApiStatus: apiStatusConstants.failure})
      }
    } catch {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
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
        we cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.onRetryJobsDetails}
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="profile-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileFailureView = () => (
    <div className="profile-failure-section">
      <button
        type="button"
        className="retry-btn"
        onClick={this.onRetryProfileAPI}
      >
        Retry
      </button>
    </div>
  )

  renderProfileSection = () => {
    const {profileApiStatus, profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return (
          <div className="profile-container">
            <img src={profileImageUrl} className="profile-pic" alt="profile" />
            <h1 className="name">{name}</h1>
            <p className="bio">{shortBio}</p>
          </div>
        )
      case apiStatusConstants.pending:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  renderNoJobsFoundSection = () => (
    <div className="no-jobs-found-section">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="no-jobs-found-img"
        alt="no jobs"
      />
      <h1 className="no-jobs-found-heading">No Jobs Found</h1>
      <p className="job-find-result-text">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsSection = () => {
    const {jobsApiStatus, jobsDetailsList} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return (
          <div className="jobs-list-container">
            {jobsDetailsList.length !== 0
              ? jobsDetailsList.map(eachItem => (
                  <JobItemCard key={eachItem.id} jobCardDetails={eachItem} />
                ))
              : this.renderNoJobsFoundSection()}
          </div>
        )
      case apiStatusConstants.pending:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  onSelectFilters = (event, type) => {
    const {value, checked} = event.target

    if (type === 'radio') {
      this.setState(
        {
          activeSalaryFilterId: value,
        },
        this.getJobsDetails,
      )
    } else {
      this.setState(prevState => {
        let updatedFilters = [...prevState.activeEmploymentFilters]

        if (checked) {
          if (!updatedFilters.includes(value)) {
            updatedFilters.push(value)
          }
        } else {
          updatedFilters = updatedFilters.filter(item => item !== value)
        }
        return {
          activeEmploymentFilters: updatedFilters,
        }
      }, this.getJobsDetails)
    }
  }

  render() {
    const {filtersList, searchInputVal} = this.props
    const {salaryRangesList, employmentTypesList} = filtersList

    return (
      <div className="jobs-find-container">
        <Header />
        <div className="jobs-section">
          <div className="profile-filters-container">
            <div className="small-device-search-input-container">
              <input
                type="search"
                className="search-input"
                onChange={this.onSearchInputChange}
                onKeyDown={this.onEnterSearchInput}
                value={searchInputVal}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-icon-btn"
                onClick={this.onSearchJobs}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderProfileSection()}
            <hr className="separater" />
            <div className="filters-container">
              <div className="filter-section">
                <h1 className="filter-heading">Type of Employment</h1>
                {employmentTypesList.map(eachItem => (
                  <FilterItem
                    key={eachItem.employmentTypeId}
                    filterDetails={eachItem}
                    filterTypeValue="checkbox"
                    onChangeHandler={this.onSelectFilters}
                  />
                ))}
              </div>
              <hr className="separater" />
              <div className="filter-section">
                <h1 className="filter-heading">Salary Range</h1>
                {salaryRangesList.map(eachItem => (
                  <FilterItem
                    key={eachItem.salaryRangeId}
                    filterDetails={eachItem}
                    filterTypeValue="radio"
                    onChangeHandler={this.onSelectFilters}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="jobs-board-container">
            <div className="large-device-search-input-container">
              <input
                type="search"
                className="search-input"
                onChange={this.onSearchInputChange}
                onKeyDown={this.onEnterSearchInput}
                value={searchInputVal}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-icon-btn"
                onClick={this.onSearchJobs}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div className="jobs-container">{this.renderJobsSection()}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default JobFindings
