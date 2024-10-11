import React from 'react'
import './login.css'
const Login: React.FC = () => {
  return (
    <div className="background">
      <div className="wrapper">
        <form action="">
          <h1>LogIn</h1>
          <div className="input-box">
            <input type="text" placeholder="user ID" required />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="21"
              viewBox="0 0 24 24"
              style={{ fill: 'rgba(0, 0, 0, 1)' }}
            >
              <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z" />
            </svg>
          </div>
          <div className="input-box">
            <input type="password" placeholder="password" required />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              style={{ fill: 'rgba(0, 0, 0, 1)' }}
            >
              <path d="M20 12c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5S7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z" />
            </svg>
          </div>

          <div className="forget">
            <a href="#">Forgot password ?</a>
          </div>

          <button className="btn">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login
