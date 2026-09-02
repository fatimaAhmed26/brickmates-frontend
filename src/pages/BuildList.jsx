import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import * as buildService from '../services/build';

const BuildList = () => {
  const [builds, setBuilds] = useState([]);

  useEffect(() => {
    const fetchBuilds = async () => {
      const buildsData = await buildService.index();
      setBuilds(buildsData);
    };
    fetchBuilds();
  }, []);

  return (
    <div className="builds-page">
      <div className="builds-header">
        <h1>Builds</h1>
        <Link to="/builds/new">
          <button>Post a build</button>
        </Link>
      </div>

      <div className="builds-grid">
        {builds.map((build) => (
          <Link to={`/builds/${build._id}`} key={build._id} className="build-card">
            <div className="build-image">
              {build.image?.url ? (
                build.image.type === 'video' ? (
                  <video src={build.image.url} muted loop playsInline />
                ) : (
                  <img src={build.image.url} alt={build.caption} />
                )
              ) : (
                <div className="placeholder-img">No media</div>
              )}
            </div>
            <div className="build-body">
              <p className="build-caption">{build.caption}</p>
              <p className="build-meta">
                {build.theme} · {build.isMOC ? 'MOC' : 'Official set'} · {build.status}
              </p>
              <p className="build-owner">by {build.owner?.username}</p>
              <p className="build-likes">♥ {build.like?.length || 0}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BuildList;