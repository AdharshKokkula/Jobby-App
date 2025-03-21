import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

class Home extends Component {
  render() {
    console.log('home')
    return (
      <>
        <Header />
        <div className="home-bg-container">
          <h1 className="home-main-h1">Find The Job That Fits Your Life</h1>
          <p className="home-main-p">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs">
            <button type="button" className="find-jobs-button">
              Find Jobs
            </button>
          </Link>
        </div>
      </>
    )
  }
}

export default Home
