const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/builds`;

const getToken = () => localStorage.getItem('token');

const index = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();

    if (data.err) {
      console.log(data.err);
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

const show = async (buildId) => {
  try {
    const res = await fetch(`${BASE_URL}/${buildId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();

    if (data.err) {
      console.log(data.err);
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

const create = async (formData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    const data = await res.json();

    if (data.err) {
      console.log(data.err);
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

const update = async (buildId, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/${buildId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    const data = await res.json();

    if (data.err) {
      console.log(data.err);
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteBuild = async (buildId) => {
  try {
    const res = await fetch(`${BASE_URL}/${buildId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();

    if (data.err) {
      console.log(data.err);
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

const likeToggle = async (buildId) => {
  try {
    const res = await fetch(`${BASE_URL}/${buildId}/like`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();

    if (data.err) {
      console.log(data.err);
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

const addComment = async (buildId, commentData) => {
  try {
    const res = await fetch(`${BASE_URL}/${buildId}/comments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    });
    const data = await res.json();

    if (data.err) {
      console.log(data.err);
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteComment = async (buildId, commentId) => {
  try {
    const res = await fetch(`${BASE_URL}/${buildId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();

    if (data.err) {
      console.log(data.err);
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export {
  index,
  show,
  create,
  update,
  deleteBuild,
  likeToggle,
  addComment,
  deleteComment,
};