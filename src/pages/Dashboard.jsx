import { useEffect, useState } from "react"
import { index } from '../services/user'
import { Link } from "react-router"

const Dashboard = (props) => {

    const [allUsers, setAllUsers] = useState([])

    useEffect(() => {
        const fetchUsers = async () => {
            const usersData =  await index()
            setAllUsers(usersData)
        }
        fetchUsers()
        
    }, [])

    return (
        <section>
            <header>
                <h1>Welcome {props.user.username}!</h1>
                <h2>View All the Users</h2>
            </header>
            {allUsers.map((user) => (
                <Link to ={`/profile/${user._id}`} key={user._id}>

                
                <div className="card" key={user._id}>
                    <header>
                        <h1>
                        {user.username}
                        </h1>
                    </header>
                </div></Link>
            ))}
        </section>
    )
}

export default Dashboard