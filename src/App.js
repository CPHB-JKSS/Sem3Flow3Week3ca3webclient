import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import facade from "./apiFacade";

function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);

  const performLogin = (evt) => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  }

  const onChange = (evt) => {
    setLoginCredentials({ ...loginCredentials, [evt.target.id]: evt.target.value })
  }

  return (
    <div class="text-center">
      <h3>CA3 - Group 1</h3>
      <form onChange={onChange} class="mt-3">
        Login with your credentials below
        <div class="form-group" aria-label="loginFormLabel">
          <input type="text" class="form-control" id="username" aria-describedby="userHelp" placeholder="username" />
        </div>
        <div class="form-group">
          <input type="password" class="form-control" id="password" placeholder="password" />
        </div>
        <button onClick={performLogin} class="btn btn-warning w-100">Login</button>
      </form>
    </div>
  )
}

function LoggedIn() {
  const [dataFromServer, setDataFromServer] = useState("Loading...")

  useEffect(() => {
    facade.fetchData().then(data => setDataFromServer(data.msg));
  }, [])

  return (
    <div>
      <h2>Data Received from server</h2>
      <h3>{dataFromServer}</h3>
    </div>
  )
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  const logout = () => {
    facade.logout()
    setLoggedIn(false)
  }
  const login = (user, pass) => {
    facade.login(user, pass)
      .then(res => setLoggedIn(true));
  }

  return (
    <div>
      <header className="App-header">
        <div class="container text-dark">
          <div class="row d-flex justify-content-center">
            <div class="col-md-auto">
              <div class="card">
                <div class="card-body">
                  {!loggedIn ? (<LogIn login={login} />) :
                    (<div>
                      <LoggedIn />
                      <button onClick={logout}>Logout</button>
                    </div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default App;