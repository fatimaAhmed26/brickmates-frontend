import { Link } from "react-router"


const Nav = (props) => {

    const handleSignOut = () => {
        localStorage.removeItem('token')
        props.setUser(null)
    }

    return (
        <nav className="navbar">
            <Link className="nav-brand" to="/">Brickmates</Link>

            {props.user ? (
                <>
                    <ul className="nav-links">
                        <li>
                            <Link to="/">Community</Link>
                        </li>
                        <li>
                            <Link to="/listings">Marketplace</Link>
                        </li>
                        <li>
                            <Link to="/">Build Together</Link>
                        </li>
                    </ul>

                    <div className="nav-actions">

                        <button className="user-icon" onClick={handleSignOut}>
                            Signout
                        </button>
                    </div>
                </>
            ) : (
            <ul>
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                    <Link to='/sign-up'>Sign Up</Link>
                </li>
                <li>
                    <Link to='/sign-in'>Sign In</Link>
                </li>
            </ul>
            ) }

        </nav>
    )
}

export default Nav