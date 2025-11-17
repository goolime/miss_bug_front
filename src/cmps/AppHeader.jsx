
import { useState, useEffect } from 'react'
import { UserMsg } from './UserMsg'
import { LoginSignup } from './Login_signup.jsx'
import { NavLink } from 'react-router-dom'
import { userService } from '../services/user.service.js'

export function AppHeader() {

    const [user, setUser] = useState(null)

    function onLogin({username, password}) {
        console.log('onLogin from AppHeader', username, password);
        const credentials = { username, password }
        userService.login(credentials)
            .then((loggedInUser) => {
                setUser(loggedInUser)
            })
            .catch((err) => {
                console.log('Cannot login', err)
            })
    }

    function onSignup({username, password, fullname}) {
        const credentials = { username, password, fullname }
        userService.signup(credentials)
            .then((signedUpUser) => {   
                setUser(signedUpUser)
            }
            )
            .catch((err) => {
                console.log('Cannot signup', err)
            })
    }

    function onLogout() {
        userService.logout()
            .then(() => {
                setUser(null)
            })
            .catch((err) => {
                console.log('Cannot logout', err)
            })
    }

    useEffect(() => {
        // component did mount when dependancy array is empty
    }, [])

    return (
        <header className='app-header container'>
            <div className='header-container'>
                <h1>Bugs are Forever</h1>
                {user?
                <div>
                    <div>Welcome, {user.fullname}</div>
                    <button onClick={onLogout}>Logout</button>
                </div>
                :
                <LoginSignup onLogin={onLogin} onSignup={onSignup} />
                }             
                <nav className='app-nav'>
                    <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
                    <NavLink to="/about">About</NavLink>
                    {user &&<>|<NavLink to="/profile">Profile</NavLink></>}
                </nav>
            </div>
            <UserMsg />
        </header>
    )
}
