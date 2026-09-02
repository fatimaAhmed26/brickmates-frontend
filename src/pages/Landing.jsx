import { Link } from 'react-router'
import '@lottiefiles/lottie-player';

const Landing = () => {
    return (
        <section className="landing">
            <div className="landing-hero">
                <div className="landing-content">
                    {/* <div className="landing-logo">
                        <div className="landing-logo-icon">🧱</div>
                        <h2>BRICKM<span>A</span>TES</h2>
                    </div> */}

                    <h1>Build. Share. Collect.</h1>

                    <p>
                        Join the premier community for serious collectors and adult builders in the GCC.
                        Discover custom MOCs, source rare sets, and collaborate on massive projects.
                    </p>

                    <div className="landing-actions">
                        <Link to="/listings">
                            <button className="btn-primary">
                                Explore Marketplace <span>→</span>
                            </button>
                        </Link>
                        <Link to="/sign-up">
                            <button className="btn-secondary">
                                Join Community
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="landing-image">
                    <lottie-player
  src="/animations/legoman.json"
  background="transparent"
  speed="1"
  style={{ width: '600px', height: '600px' }}
  loop
  autoplay
></lottie-player>
                    
                </div>
            </div>

            <footer className="landing-footer">
                <div className="footer-brand">
                    <h3>Brickmates</h3>
                    <p>© 2026 Brickmates GCC. All rights reserved.</p>
                    <p>Premium LEGO Marketplace & Community.</p>
                </div>

               
            </footer>
        </section>
    )
}

export default Landing