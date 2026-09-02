import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as buildService from '../services/build';
import * as set from '../services/set';
import toast from 'react-hot-toast'

const EditBuildForm = () => {
  const { buildId } = useParams();
  const navigate = useNavigate();
  const [themes, setThemes] = useState([]);
  const [formData, setFormData] = useState({
    theme: '',
    isMOC: false,
    status: 'in progress',
    caption: '',
    timeTaken: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [build, themesData] = await Promise.all([
        buildService.show(buildId),
        set.themes(),
      ]);

      setThemes(themesData);
      setFormData({
        theme: build.theme || '',
        isMOC: build.isMOC,
        status: build.status,
        caption: build.caption,
        timeTaken: build.timeTaken,
      });
      setLoaded(true);
    };
    fetchData();
  }, [buildId]);

  const handleChange = (evt) => {
    const { name, value, type, checked } = evt.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (evt) => {
    setImageFile(evt.target.files[0]);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const data = new FormData();
    data.append('theme', formData.theme);
    data.append('isMOC', formData.isMOC);
    data.append('status', formData.status);
    data.append('caption', formData.caption);
    data.append('timeTaken', formData.timeTaken);
    if (imageFile) data.append('image', imageFile);

    const updated = await buildService.update(buildId, data);
    if (updated.err) {
      toast.error(updated.err)
      return
    }

    toast.success('Build updated!')
    navigate(`/builds/${buildId}`);
  };

  if (!loaded) return <p>Loading...</p>;

  return (
    <div className="form-page">
      <div className="card">
        <header><h1>Edit build</h1></header>
        <form onSubmit={handleSubmit}>
          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            name="theme"
            value={formData.theme}
            onChange={handleChange}
            required
          >
            <option value="">Select a theme</option>
            {themes.map((theme) => (
              <option key={theme.id} value={theme.name}>
                {theme.name}
              </option>
            ))}
          </select>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isMOC"
              checked={formData.isMOC}
              onChange={handleChange}
            />
            This is a MOC (My Own Creation)
          </label>

          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="in progress">In progress</option>
            <option value="completed">Completed</option>
          </select>

          <label htmlFor="caption">Caption</label>
          <textarea
            id="caption"
            name="caption"
            value={formData.caption}
            onChange={handleChange}
          />

          <label htmlFor="timeTaken">Time taken (minutes)</label>
          <input
            type="number"
            id="timeTaken"
            name="timeTaken"
            value={formData.timeTaken}
            onChange={handleChange}
          />

          <label htmlFor="image">Replace photo or video</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />

          <button type="submit">Save changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditBuildForm;