import React, { useState, useEffect } from "react";
import facade from "./apiFacade";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

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
    <div className="text-center">
      <h3>CA3 - Group 1</h3>
      <form onChange={onChange} className="mt-3">
        <h5 className="font-weight-normal mb-3">Login with your credentials below</h5>
        <div className="form-group" aria-label="loginFormLabel">
          <input type="text" className="form-control" id="username" aria-describedby="userHelp" placeholder="username" />
        </div>
        <div className="form-group">
          <input type="password" className="form-control" id="password" placeholder="password" />
        </div>
        <button onClick={performLogin} className="btn btn-warning">Login</button>
      </form>
    </div>
  )
}

let fetchDemo;

function FetchDemo() {
  fetch('https://jkss.dk/ca3backend/api/info/fetchdemo')
    .then(response => response.json())
    .then(json => fetchDemo = json)
  return (<p>{fetchDemo}</p>)
}

function AdminPage(props) {
  return (
    <div>
      <p>test</p>
      <p>Admin stuff: {props.dataFromServer.msg}</p>
    </div>
  )
}

function LoggedIn(props) {
  const role = props.roles.includes("admin") ? "admin" : "user"

  useEffect(() => {
    facade.fetchData(role)
      .then(data => props.setDataFromServer(data));
  }, [])

  return (
    <div>
      <h2>Data Received from server</h2>
      <h3>{props.dataFromServer.msg}</h3>
    </div>
  )
}

function App() {
  const [dataFromServer, setDataFromServer] = useState("Loading...")
  const [loggedIn, setLoggedIn] = useState(false)

  /*
  let loginState
  if (localStorage.getItem("jwtToken") != null) { //Silly workaround to "remember" someone logged in. Does not work for a different window/tab.
    loginState = true
  } else {
    loginState = false
  }
  const [loggedIn, setLoggedIn] = useState(loginState)
*/

  const logout = () => {
    facade.logout();
    setLoggedIn(false);
  }

  const login = (user, pass) => {
    facade.login(user, pass)
      .then((res) => {
        setLoggedIn(true)
      })
  }

  return (
    <Router>
      <div>
        <header className="App-header">
          <div className="container text-dark">
            <div className="card">
              <div className="card-body">
                {!loggedIn ? (
                  <div className="row d-flex justify-content-center align-items-center">
                    <div className="col">
                      <div className="card h-100">
                        <div className="card-body">
                          <LogIn login={login} />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                    <div>
                      <div className="card mb-3">
                        <div className="card-body">
                          <LoggedIn dataFromServer={dataFromServer} setDataFromServer={setDataFromServer} roles={facade.getRoles()} />
                          <div className="d-flex justify-content-end">
                            <button className="btn btn-warning" onClick={logout}>Logout</button>
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-2 border-right">
                              <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                <Link to="/home"><a className="nav-link badge-light border mb-1">Home</a></Link>
                                <Link to="/user"><a className="nav-link badge-light border mb-1">User</a></Link>
                                <Link to="/external"><a className="nav-link badge-light border mb-1">External</a></Link>
                                {loggedIn && facade.getRoles().includes("admin") ?
                                  <Link to="/admin"><a className="nav-link badge-dark">Admin</a></Link> : ""}
                              </div>
                            </div>
                            <div className="col-10 mh-100">
                              <Switch>
                                <Route path="/home">
                                  <p>Standard stuff</p>
                                </Route>
                                <Route path="/user">
                                  <p>User stuff: {dataFromServer.msg}</p>
                                </Route>
                                <Route path="/admin">
                                  {!facade.getRoles().includes("admin") ? <Redirect to="/" /> : (<AdminPage dataFromServer={dataFromServer} />)}
                                </Route>
                                <Route path="/external">
                                <p>Fetch using API endpoint: 'https://jkss.dk/ca3backend/api/info/fetchdemo'</p>
                                  <div style={{backgroundColor: "#F8F8FF" }} className="card">
                                    <div className="card-body border rounded border-light overflow-auto" style={{maxHeight: "500px"}}>
                                      <FetchDemo></FetchDemo>
                                    </div>
                                  </div>
                                </Route>
                              </Switch>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </header>
      </div >
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    </Router >
  )
}

export default App;