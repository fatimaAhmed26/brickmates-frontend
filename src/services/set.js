const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/sets`;

const index = async () => {
  try {
    const res = await fetch(BASE_URL);
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const show = async (setId) => {
  try {
    const res = await fetch(`${BASE_URL}/${setId}`);
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const search = async (query) => {
  try {
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

export { index, show, search };