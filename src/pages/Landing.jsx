import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import '@lottiefiles/lottie-player';
import { index as indexListings } from '../services/listing'

const features = [
    {
        title: 'Marketplace',
        text: 'Buy and sell sets with collectors across the GCC, sealed or built.',
        to: '/listings',
        cta: 'Browse listings',
    },
    {
        title: 'Sets',
        text: 'Search the catalogue and keep track of every set in your collection.',
        to: '/sets',
        cta: 'Search sets',
    },
    {
        title: 'Build Together',
        text: 'Pick a set, get matched with another builder, and build it step by step over video.',
        to: '/sign-up',
        cta: 'Find a partner',
    },
]

const steps = [
    {
        title: 'Pick a set',
        text: 'Choose the set you want to build and join its queue.',
    },
    {
        title: 'Get matched',
        text: 'We pair you with a builder who picked the same set.',
    },
    {
        title: 'Build side by side',
        text: 'Hop on a video call and follow each other’s progress, step by step.',
    },
]

const Landing = () => {
    const [listings, setListings] = useState([])

    useEffect(() => {
        const fetchListings = async () => {
            const data = await indexListings()
            if (!Array.isArray(data)) return
            const fresh = data
                .filter((listing) => listing.status !== 'sold' && listing.photos?.length)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 4)
            setListings(fresh)
        }
        fetchListings()
    }, [])

    return (
        <section className="landing">
            <div className="landing-hero">
                <div className="landing-hero-inner">
                    <div className="landing-content">
                        <h1>
                            <span>Build.</span>
                            <span>Share.</span>
                            <span>Collect.</span>
                        </h1>

                        <p>
                            Join the community for serious collectors and adult builders in the GCC.
                            Discover custom MOCs, source rare sets, and collaborate on massive projects.
                        </p>

                        <div className="landing-actions">
                            <Link to="/sign-up" className="landing-btn landing-btn-primary">
                                Join Brickmates
                            </Link>
                            <Link to="/listings" className="landing-btn landing-btn-ghost">
                                Browse the marketplace
                            </Link>
                        </div>
                    </div>

                    <div className="landing-image">
                        <lottie-player
                            src="/animations/legoman.json"
                            background="transparent"
                            speed="1"
                            loop
                            autoplay
                        ></lottie-player>
                        <div className="hero-brick" aria-hidden="true"></div>
                    </div>
                </div>
            </div>

            <div className="landing-features">
                {features.map((feature) => (
                    <Link to={feature.to} className="feature-tile" key={feature.title}>
                        <h2>{feature.title}</h2>
                        <p>{feature.text}</p>
                        <span className="feature-cta">{feature.cta}</span>
                    </Link>
                ))}
            </div>

            {listings.length > 0 && (
                <section className="landing-section">
                    <header className="landing-section-header">
                        <h2>Fresh on the marketplace</h2>
                        <Link to="/listings" className="landing-link">See all listings</Link>
                    </header>

                    <div className="fresh-grid">
                        {listings.map((listing) => (
                            <Link to="/listings" className="fresh-card" key={listing._id}>
                                <div className="fresh-image">
                                    <img src={listing.photos[0].url} alt={listing.setName || listing.setNum} />
                                    <span className="price-brick">BHD {listing.price}</span>
                                </div>
                                <h3>{listing.setName || listing.setNum}</h3>
                                <p>
                                    <span className="fresh-condition">{listing.condition}</span>
                                    {listing.owner?.username && <span>by {listing.owner.username}</span>}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <section className="how-band">
                <div className="how-inner">
                    <div className="how-intro">
                        <h2>How Build Together works</h2>
                        <p>Big sets are better with company. Find someone building the same thing and finish it together.</p>
                        <Link to="/sign-up" className="landing-btn landing-btn-primary">
                            Find a build partner
                        </Link>
                    </div>

                    <ol className="how-steps">
                        {steps.map((step, i) => (
                            <li className="how-step" key={step.title}>
                                <span className="how-step-number">{i + 1}</span>
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="closing-cta">
                <h2>Got a set to sell or a build to show off?</h2>
                <Link to="/sign-up" className="landing-btn landing-btn-primary">
                    Join Brickmates
                </Link>
            </section>

            <footer className="landing-footer">
                <div className="footer-brand">
                    <h3>Brickmates</h3>
                    <p>The LEGO marketplace and community for the GCC.</p>
                    <p>© 2026 Brickmates GCC. All rights reserved.</p>
                </div>
            </footer>
        </section>
    )
}

export default Landing
