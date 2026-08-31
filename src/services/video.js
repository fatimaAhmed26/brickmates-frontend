const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/video-token`;

const getToken = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

export { getToken };