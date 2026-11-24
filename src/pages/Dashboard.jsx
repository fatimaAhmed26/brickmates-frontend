import { useEffect, useState } from "react"
import { index, followToggle } from '../services/user'
import { index as indexBuilds } from '../services/build'
import { Link } from "react-router"
import { HeartIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline'

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

    const fetchUsers = async () => {
        const usersData = await index()
        setAllUsers(usersData)
    }

    useEffect(() => {
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

    const handleFollow = async (event, builderId) => {
        event.preventDefault()
        event.stopPropagation()

        await followToggle(builderId)
        fetchUsers()
    }

    const isFollowing = (builder) => {
        return builder.followers && builder.followers.includes(user?._id)
    }

    const topBuilders = allUsers.filter((builder) => builder._id !== user?._id).slice(0, 5)
    const feedBuilds = builds.slice(0, 5)

    return (
        <section className="community">
            <header className="community-hero">
                <div className="community-hero-inner">
                    <div className="community-welcome">
                        <h1>Welcome back, {user?.username}</h1>
                        <p>Here’s what builders across the GCC are working on.</p>
                    </div>

                    <div className="quick-actions">
                        <Link to="/builds/new" className="landing-btn landing-btn-primary">Post a build</Link>
                        <Link to="/listings/new" className="landing-btn landing-btn-ghost">Sell a set</Link>
                        <Link to="/build-together" className="landing-btn landing-btn-ghost">Find a build partner</Link>
                    </div>
                </div>
            </header>

            <div className="community-body">
                <div className="community-feed">
                    <h2 className="community-title">Community highlights</h2>

                    {feedBuilds.length === 0 ? (
                        <div className="feed-empty">
                            <h3>No builds yet</h3>
                            <p>Share what you’re working on and be the first in the feed.</p>
                            <Link to="/builds/new" className="feed-empty-btn">Post a build</Link>
                        </div>
                    ) : (
                        <div className="feed">
                            {feedBuilds.map((build) => {
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
                                            {build.isMOC && <span className="post-badge">MOC</span>}
                                        </div>

                                        <Link to={`/builds/${build._id}`} className="post-media">
                                            {build.image?.url ? (
                                                <img
                                                    className="post-image"
                                                    src={build.image.url}
                                                    alt={build.caption || build.theme}
                                                />
                                            ) : (
                                                <div className="post-image post-image-placeholder">
                                                    No photo yet
                                                </div>
                                            )}
                                        </Link>

                                        <div className="post-footer">
                                            <span className="post-stat">
                                                <HeartIcon aria-hidden="true" />
                                                {build.like?.length || 0}
                                                <span className="sr-only"> likes</span>
                                            </span>
                                            <Link to={`/builds/${build._id}`} className="post-stat">
                                                <ChatBubbleOvalLeftIcon aria-hidden="true" />
                                                {build.comment?.length || 0}
                                                <span className="sr-only"> comments</span>
                                            </Link>
                                            <Link to={`/builds/${build._id}`} className="post-open">
                                                View build
                                            </Link>
                                        </div>

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
                                    </article>
                                )
                            })}
                        </div>
                    )}
                </div>

                <aside className="community-sidebar">
                    <div className="sidebar-card">
                        <header className="sidebar-card-header">
                            <h2>Top builders</h2>
                            <Link to="/users" className="landing-link">View all</Link>
                        </header>

                        <ul className="builder-list">
                            {topBuilders.map((builder) => (
                                <li key={builder._id}>
                                    <Link to={`/profile/${builder._id}`} className="builder-row">
                                        <img
                                            src={builder.avatar || 'https://placehold.co/80x80?text=%20'}
                                            alt=""
                                        />
                                        <span className="builder-row-text">
                                            <strong>{builder.username}</strong>
                                            {builder.bio && <span>{builder.bio}</span>}
                                        </span>
                                    </Link>
                                    <button
                                        className={`follow-chip ${isFollowing(builder) ? 'following' : ''}`}
                                        onClick={(event) => handleFollow(event, builder._id)}
                                    >
                                        {isFollowing(builder) ? 'Following' : 'Follow'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </section>
    )
}

export default Dashboard