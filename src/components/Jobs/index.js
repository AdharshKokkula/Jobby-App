import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FaStar, FaShoppingBag} from 'react-icons/fa'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileDetails: '',
    profileApiStatus: apiStatusConstants.initial,
    employmentTypeFilters: [],
    salaryRangeFilter: '',
    searchInput: '',
    jobsList: [],
    jobsListApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const token = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    const profileData = (await response.json()).profile_details
    if (response.ok === true) {
      const formatedProfileDetails = {
        name: profileData.name,
        profileImageUrl: profileData.profile_image_url,
        shortBio: profileData.short_bio,
      }
      this.setState({
        profileDetails: formatedProfileDetails,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  renderProfileLoadingView = () => (
    <div className="profile-loading-view-container">
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  renderProfileView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-view-container">
        <img src={profileImageUrl} className="profile-pic" alt="profile" />
        <h1 className="name">{name}</h1>
        <p className="short-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <div className="profile-failure-view-container">
      <button type="button" onClick={this.getProfileDetails}>
        Retry
      </button>
    </div>
  )

  profileSwitchView = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderProfileLoadingView()
      case apiStatusConstants.success:
        return this.renderProfileView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  handleEmploymentTypeChange = event => {
    this.setState(
      prevState => ({
        employmentTypeFilters: [
          ...prevState.employmentTypeFilters,
          event.target.value,
        ],
      }),
      this.getJobsDetails,
    )
  }

  handleSalaryRangeChange = event => {
    this.setState({salaryRangeFilter: event.target.value}, this.getJobsDetails)
  }

  updateSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  getJobsDetails = async () => {
    this.setState({jobsListApiStatus: apiStatusConstants.inProgress})
    const {employmentTypeFilters, salaryRangeFilter, searchInput} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeFilters.join(
      ',',
    )}&minimum_package=${salaryRangeFilter}&search=${searchInput}`
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    console.log(url)
    const response = await fetch(url, options)
    const jobsListData = await response.json()
    if (response.ok === true) {
      const formatedJobsList = jobsListData.jobs.map(eachItem => ({
        id: eachItem.id,
        title: eachItem.title,
        rating: eachItem.rating,
        companyLogoUrl: eachItem.company_logo_url,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        employmentType: eachItem.employment_type,
        packagePerAnnum: eachItem.package_per_annum,
      }))
      this.setState({
        jobsList: formatedJobsList,
        jobsListApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsListApiStatus: apiStatusConstants.failure})
    }
  }

  renderJobsListLoadingView = () => (
    <div className="jobs-list-loading-view-container">
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  renderJobsListView = () => {
    const {jobsList} = this.state
    console.log(jobsList.length)
    if (jobsList.length !== 0) {
      return (
        <ul className="jobs-list-container">
          {jobsList.map(eachItem => (
            <li key={eachItem.id} className="jobs-item">
              <Link to={`/jobs/${eachItem.id}`} className="job-item-link">
                <div className="job-top-section">
                  <img
                    src={eachItem.companyLogoUrl}
                    className="company-logo"
                    alt="company logo"
                  />
                  <div className="job-top-right-section">
                    <h1 className="job-title">{eachItem.title}</h1>
                    <p className="job-rating">
                      <FaStar className="star-icon" />
                      {eachItem.rating}
                    </p>
                  </div>
                </div>
                <div className="job-location-type-package-container">
                  <div className="job-location-type-container">
                    <p className="job-location">
                      <MdLocationOn className="job-icons" />
                      {eachItem.location}
                    </p>
                    <p className="job-type">
                      <FaShoppingBag className="job-icons" />
                      {eachItem.employmentType}
                    </p>
                  </div>
                  <p className="job-packange">{eachItem.packagePerAnnum}</p>
                </div>
                <hr className="job-hr-rule" />
                <div className="job-description-container">
                  <h1 className="job-description-h1">Description</h1>
                  <p className="job-description">{eachItem.jobDescription}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )
    }
    return (
      <div className="no-job-found-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-job-found-img"
          alt="no jobs"
        />
        <h1 className="no-job-h1">No Jobs Found</h1>
        <p className="no-job-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderJobsListFailureView = () => (
    <div className="jobs-list-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="jobs-list-failure-img"
        alt="failure view"
      />
      <h1 className="jobs-list-failure-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-list-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" onClick={this.getJobsDetails}>
        Retry
      </button>
    </div>
  )

  jobsSwitchView = () => {
    const {jobsListApiStatus} = this.state
    switch (jobsListApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderJobsListLoadingView()
      case apiStatusConstants.success:
        return this.renderJobsListView()
      case apiStatusConstants.failure:
        return this.renderJobsListFailureView()
      default:
        return null
    }
  }

  render() {
    const {employmentTypesList = '', salaryRangesList = ''} = this.props
    const {employmentTypeFilters, salaryRangeFilter, searchInput} = this.state
    console.log(employmentTypeFilters.join(','), salaryRangeFilter, searchInput)
    return (
      <>
        <Header />
        <div className="jobs-bg-container">
          <div className="profile-filter-container">
            {this.profileSwitchView()}
            <hr className="hr-rule" />
            <h1>Type of Employment</h1>
            <ul className="employment-type-filters-container">
              {employmentTypesList.map(type => (
                <li key={type.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={type.employmentTypeId}
                    value={type.employmentTypeId}
                    onChange={this.handleEmploymentTypeChange}
                  />
                  <label htmlFor={type.employmentTypeId}>{type.label}</label>
                </li>
              ))}
            </ul>
            <hr className="hr-rule" />
            <h1>Salary Range</h1>
            <ul className="salary-filters-container">
              {salaryRangesList.map(range => (
                <li key={range.salaryRangeId}>
                  <input
                    type="radio"
                    id={range.salaryRangeId}
                    name="salaryRange"
                    value={range.salaryRangeId}
                    onChange={this.handleSalaryRangeChange}
                  />
                  <label htmlFor={range.salaryRangeId}>{range.label}</label>
                </li>
              ))}
            </ul>
          </div>
          <div className="jobs-search-container">
            <div className="search-bar-container">
              <input
                type="search"
                className="search-bar"
                placeholder="Search"
                onChange={this.updateSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.getJobsDetails}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div className="jobs-view-container">{this.jobsSwitchView()}</div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
