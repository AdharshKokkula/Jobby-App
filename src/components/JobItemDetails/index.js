import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
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

class JobItemDetails extends Component {
  state = {jobDetails: {}, jobApiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({jobApiStatus: apiStatusConstants.inProgress})
    const toCamelCase = obj => {
      if (Array.isArray(obj)) {
        return obj.map(item => toCamelCase(item))
      }
      if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc, key) => {
          const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
            letter.toUpperCase(),
          )
          acc[camelKey] = toCamelCase(obj[key])
          return acc
        }, {})
      }
      return obj
    }

    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await fetch(url, options)
    const jobItemData = await response.json()
    if (response.ok === true) {
      const formattedJobItemDetails = toCamelCase(jobItemData)
      this.setState({
        jobDetails: formattedJobItemDetails,
        jobApiStatus: apiStatusConstants.success,
      })
    } else {
      console.log('failed')
      this.setState({jobApiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getJobItemDetails}
      >
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {jobDetails} = this.state
    const {jobDetails: details, similarJobs} = jobDetails

    return (
      <div className="job-details-container">
        {/* Job Details Card */}
        <div className="job-details-card">
          <div className="job-top-section">
            <img
              src={details.companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="job-top-right-section">
              <h1 className="job-title">{details.title}</h1>
              <div className="rating-container">
                <p className="job-rating">
                  <FaStar className="star-icon" />
                  {details.rating}
                </p>
              </div>
            </div>
          </div>
          <div className="job-type-package-container">
            <div className="location-employment-container">
              <div className="location-container">
                <p className="job-location">
                  <MdLocationOn className="jobs-icon" />
                  {details.location}
                </p>
              </div>
              <div className="employment-type-container">
                <p className="job-employment-type">
                  <FaShoppingBag className="jobs-icon" />
                  {details.employmentType}
                </p>
              </div>
            </div>
            <p className="job-package">{details.packagePerAnnum}</p>
          </div>
          <hr className="job-hr-rule" />
          <div className="job-description-container">
            <div className="description-header">
              <h1 className="job-description-h1">Description</h1>
              <a
                href={details.companyWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="visit-link"
              >
                Visit
              </a>
            </div>
            <p className="job-description">{details.jobDescription}</p>
          </div>
          <div className="skills-container">
            <h1 className="section-heading">Skills</h1>
            <ul className="skills-list">
              {details.skills && details.skills.length > 0 ? (
                details.skills.map(skill => (
                  <li key={skill.name} className="skill-item">
                    <img
                      src={skill.imageUrl}
                      alt={skill.name}
                      className="skill-image"
                    />
                    <p className="skill-name">{skill.name}</p>
                  </li>
                ))
              ) : (
                <p>No skills available</p>
              )}
            </ul>
          </div>
          <div className="life-at-company-container">
            <h1 className="section-heading">Life at Company</h1>
            <div className="life-at-company-content">
              {details.lifeAtCompany ? (
                <>
                  <p className="life-description">
                    {details.lifeAtCompany.description}
                  </p>
                  <img
                    src={details.lifeAtCompany.imageUrl}
                    alt="life at company"
                    className="life-image"
                  />
                </>
              ) : (
                <p>No life at company information available</p>
              )}
            </div>
          </div>
        </div>

        {/* Similar Jobs Section */}
        <div className="similar-jobs-container">
          <h1 className="section-heading">Similar Jobs</h1>
          <ul className="similar-jobs-list">
            {similarJobs && similarJobs.length > 0 ? (
              similarJobs.map(job => (
                <li key={job.id} className="similar-job-item">
                  <div className="job-top-section">
                    <img
                      src={job.companyLogoUrl}
                      alt="similar job company logo"
                      className="company-logo"
                    />
                    <div className="job-top-right-section">
                      <h1 className="job-title">{job.title}</h1>
                      <div className="rating-container">
                        <p className="job-rating">
                          <FaStar className="star-icon" />
                          {job.rating}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="job-description-container">
                    <h1 className="job-description-h1">Description</h1>
                    <p className="job-description">{job.jobDescription}</p>
                  </div>
                  <div className="location-employment-container">
                    <div className="location-container">
                      <p className="job-location">
                        <MdLocationOn className="jobs-icon" />
                        {job.location}
                      </p>
                    </div>
                    <div className="employment-type-container">
                      <p className="job-employment-type">
                        <FaShoppingBag className="jobs-icon" />
                        {job.employmentType}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p>No similar jobs available</p>
            )}
          </ul>
        </div>
      </div>
    )
  }

  renderJobSwitchView = () => {
    const {jobApiStatus} = this.state
    switch (jobApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-bg-container">
          {this.renderJobSwitchView()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
