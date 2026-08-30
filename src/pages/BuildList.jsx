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
    <div>
      <div>
        <h1>Builds</h1>
        <Link to="/builds/new">Post a build</Link>
      </div>
      {builds.map((build) => (
        <Link to={`/builds/${build._id}`} key={build._id}>
          <div>
            {build.image?.url && (
              <img src={build.image.url} alt={build.caption} width="200" />
            )}
            <p>{build.caption}</p>
            <p>
              {build.theme} · {build.isMOC ? 'MOC' : 'Official set'} · {build.status}
            </p>
            <p>by {build.owner?.username}</p>
            <p>{build.likes?.length || 0} likes</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BuildList;
