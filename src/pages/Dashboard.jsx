import { useEffect, useState } from "react"
import { index } from '../services/user'
import { index as indexBuilds } from '../services/build'
import { Link } from "react-router"

const formatTimeAgo = (dateString) => {
    if (!dateString) return ''
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000)

    const intervals = [
        { label: 'year', secs: 31536000 },
        { label: 'month', secs: 2592000 },
        { label: 'day', secs: 86400 },
        { label: 'hour', secs: 3600 },
        { label: 'minute', secs: 60 },
    ]

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.secs)
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
        }
    }

    return 'Just now'
}

const Dashboard = ({ user }) => {
    const [allUsers, setAllUsers] = useState([])
    const [builds, setBuilds] = useState([])

    useEffect(() => {
        const fetchUsers = async () => {
            const usersData = await index()
            setAllUsers(usersData)
        }

        fetchUsers()
    }, [])

    useEffect(() => {
        const fetchBuilds = async () => {
            try {
                const buildsData = await indexBuilds()
                setBuilds(buildsData)
            } catch (err) {
                console.log(err)
                setBuilds([])
            }
        }

        fetchBuilds()
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
                {allUsers.slice(0, 3).map((builder) => (
                    <Link
                        to={`/profile/${builder._id}`}
                        key={builder._id}
                        className="builder-link"
                    >
                        <div className="builder-card">
                            <div className="builder-image">
                                <img
                                    src={builder.avatar || 'https://placehold.co/80x80?text=%20'}
                                    alt={builder.username}
                                />
                            </div>

                            <h2>{builder.username}</h2>

                            <p>{builder.bio}</p>

                            <button className="follow-btn">Follow</button>
                        </div>
                    </Link>
                ))}
            </div>

            <header className="dashboard-header">
                <div>
                    <h1>Community Highlights</h1>
                </div>
            </header>

            <div className="feed">
                {builds.slice(0, 5).map((build) => {
                    const hashtags = [
                        build.isMOC ? '#MOC' : null,
                        build.theme ? `#${build.theme.replace(/\s+/g, '')}` : null,
                    ].filter(Boolean)

                    return (
                        <article className="post-card" key={build._id}>
                            <div className="post-header">
                                <img
                                    className="post-avatar"
                                    src={build.owner?.avatar || 'https://placehold.co/40x40?text=%20'}
                                    alt={build.owner?.username}
                                />
                                <div className="post-owner">
                                    <Link to={`/profile/${build.owner?._id}`}>
                                        {build.owner?.username}
                                    </Link>
                                    <span className="post-time">
                                        {formatTimeAgo(build.createdAt)}
                                    </span>
                                </div>
                            </div>

                            <Link to={`/builds/${build._id}`}>
                                {build.image?.url ? (
                                    <img
                                        className="post-image"
                                        src={build.image.url}
                                        alt={build.caption}
                                    />
                                ) : (
                                    <div className="post-image post-image-placeholder">
                                        No image
                                    </div>
                                )}
                            </Link>

                            <div className="post-body">
                                <h3 className="post-title">
                                    {build.theme}{build.isMOC ? ' MOC' : ''}
                                </h3>
                                {build.caption && (
                                    <p className="post-caption">{build.caption}</p>
                                )}

                                {hashtags.length > 0 && (
                                    <div className="post-hashtags">
                                        {hashtags.map((tag) => (
                                            <span key={tag} className="hashtag">{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="post-footer">
                                <span>Like{build.likes?.length || 0}</span>
                                <span>comment {build.comment?.length || 0}</span>
                                <span className="post-share">↗</span>
                            </div>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}

export default Dashboard