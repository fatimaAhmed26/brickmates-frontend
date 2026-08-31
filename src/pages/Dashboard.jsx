import { useEffect, useState } from "react"
import { index } from '../services/user'
import { Link } from "react-router"

const Dashboard = (props) => {
    const [allUsers, setAllUsers] = useState([])

    useEffect(() => {
        const fetchUsers = async () => {
            const usersData = await index()
            setAllUsers(usersData)
        }

        fetchUsers()
    }, [])

    return (
        <section className="dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>Top Builders</h1>
                    <p>Discover masters of the craft in the GCC.</p>
                </div>

                <Link to="/users" className="view-all">
                    View All
                </Link>
            </header>

            <div className="builders-grid">
                {allUsers.slice(0, 3).map((user) => (
                    <Link
                        to={`/profile/${user._id}`}
                        key={user._id}
                        className="builder-link"
                    >
                        <div className="builder-card">
                            <div className="builder-image">
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                />
                            </div>

                            <h2>{user.username}</h2>

                            <p>{user.bio}</p>

                            <button>Follow</button>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default Dashboard