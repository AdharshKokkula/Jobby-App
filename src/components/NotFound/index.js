import './index.css'

const NotFound = props => {
  console.log(props)
  return (
    <div className="not-found-bg-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
        className="not-found-img"
        alt="not found"
      />
      <h1 className="not-found-h1">Page Not Found</h1>
      <p className="not-found-p">
        We are sorry, the page you requested could not be found
      </p>
    </div>
  )
}

export default NotFound
