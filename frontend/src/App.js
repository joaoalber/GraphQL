import React from 'react'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import AuthPage from './views/Auth'
import BookingsPage from './views/Bookings'
import EventsPage from './views/Events'
import MainNavigation from './components/Navigation/MainNavigation'
import AuthContext from './context/auth-context'

import './App.css';

function App() {

  state = {
    token: null,
    userId: null
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId })
  }

  logout = () => {
    this.setState({ token: null, userId: null })
  }

  return (
    <BrowserRouter>
    <React.Fragment>
      <AuthContextContext.Provider 
        value=
        {{
          token: this.state.token, 
          userId: this.state.userId, 
          login: this.login, 
          logout: this.logout
        }}>
        <MainNavigation/>
          <main className="main-content">
            <Switch>
              {!this.state.token && <Redirect from="/" to="/auth" exact />}
              {this.state.token && <Redirect from="/" to="/eventos" exact />}
              {this.state.token && <Redirect from="/auth" to="/eventos" exact />}
              {!this.state.token && <Route path="/auth" component={AuthPage} />}
              <Route path="/eventos" component={EventsPage} />
              {this.state.toke && <Route path="/reservas" component={BookingsPage} />}
            </Switch>
          </main>
        </AuthContextContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
