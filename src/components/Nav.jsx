import { Link, NavLink } from "react-router"

const BrickMark = () => (
    <svg className="brick-mark" viewBox="0 0 32 22" aria-hidden="true">
        <rect x="5" y="0" width="8" height="5" rx="1.5" />
        <rect x="19" y="0" width="8" height="5" rx="1.5" />
        <rect x="0" y="4" width="32" height="18" rx="3" />
    </svg>
)

const Nav = (props) => {

    const handleSignOut = () => {
        localStorage.removeItem('token')
        props.setUser(null)
    }

    return (
        <nav className="navbar">
            <Link className="nav-brand" to="/">
                <BrickMark />
                Brickmates
            </Link>

            {props.user ? (
                <>
                    <ul className="nav-links">
                        <li><NavLink to="/" end>Community</NavLink></li>
                        <li><NavLink to="/listings">Marketplace</NavLink></li>
                        <li><NavLink to="/build-together">Build Together</NavLink></li>
                        <li><NavLink to="/sets">Sets</NavLink></li>
                        <li><NavLink to="/builds">Builds</NavLink></li>
                        <li><NavLink to={`/profile/${props.user._id}`}>Profile</NavLink></li>
                        <li><NavLink to="/messages">Messages</NavLink></li>
                    </ul>

                    <div className="nav-actions">
                        <button className="user-icon" onClick={handleSignOut}>
                            Sign out
                        </button>
                    </div>
                </>
            ) : (
                <ul className="nav-links nav-links-guest">
                    <li><NavLink to="/listings">Marketplace</NavLink></li>
                    <li><NavLink to="/sets">Sets</NavLink></li>
                    <li><NavLink to="/sign-in">Sign in</NavLink></li>
                    <li><Link className="nav-cta" to="/sign-up">Sign up</Link></li>
                </ul>
            )}
        </nav>
    )
}

export default Nav
