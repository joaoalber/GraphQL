import React from 'react'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import AuthPage from './views/Auth'
import BookingsPage from './views/Bookings'
import EventsPage from './views/Events'
import MainNavigation from './components/Navigation/MainNavigation'

import './App.css';

function App() {
  return (
    <BrowserRouter>
    <React.Fragment>
      <MainNavigation/>
        <main className="main-content">
          <Switch>
            <Redirect from="/" to="/auth" exact />
            <Route path="/auth" component={AuthPage} />
            <Route path="/eventos" component={EventsPage} />
            <Route path="/reservas" component={BookingsPage} />
          </Switch>
        </main>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
