import React from 'react'
import { NavLink } from 'react-router-dom'

import AuthContext from '../../context/auth-context'
import './MainNavigation.css'

const mainNavigation = props => (
    <AuthContext.Consumer>
        {context => {
            return (
                <header className="main-navigation">
                    <div className="main-navigation__logo">
                        <h1>Gerenciador de Eventos</h1>
                    </div>
                    <nav className="main-navigation__items">
                        <ul>
                            {!context.token && (<li><NavLink to="/auth">Fazer login</NavLink></li>)}
                            <li><NavLink to="/eventos">Eventos</NavLink></li>
                            {context.token && (
                                <React.Fragment>
                                    <li><NavLink to="/reservas">Agenda</NavLink></li>
                                    <li><button onClick={context.logout}>Logout</button></li>
                                </React.Fragment>
                            )}
                        </ul>
                    </nav>
                </header>
            )
        }}

    </AuthContext.Consumer>
);

export default mainNavigation;