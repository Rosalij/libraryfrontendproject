import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from "../context/AuthContext"

function Header() {
    const { user, logout } = useAuth();


    return (
        <header>
            <NavLink to="/">
                <div className='logo'>
                    <img src="./src/assets/books.png" alt="books icon" width="200" />
                    <p className="headerTitle">Bookshelf Reviews</p>
                </div>
            </NavLink>

            <nav>
                <ul>

                    <li>
                        <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>
                            Home
                        </NavLink>
                    </li>     <li>
                            <NavLink to="/books" className={({ isActive }) => isActive ? "active-link" : ""}>
                                Books
                            </NavLink>
                        </li>



                    {/* Only show when logged in */}
                    {user && (
                        <>

                            <li>
                                <NavLink to="/profile" className={({ isActive }) => isActive ? "active-link" : ""}>
                                    <img src="../src/assets/account_circle.svg" alt="account icon" width="20" />
                                    Profile
                                </NavLink>
                            </li>
                               <li>
                                <NavLink to="/users" className={({ isActive }) => isActive ? "active-link" : ""}>
                                    Friends
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* Login / Logout */}
                    {!user ? (
                        <li>
                            <NavLink to="/login" className={({ isActive }) => isActive ? "active-link" : ""}>
                                Login
                            </NavLink>
                        </li>
                    ) : (
                        <li onClick={logout} className="logout-button">
                            Log out
                        </li>
                    )}

                </ul>
            </nav>
        </header>
    )
}

export default Header
