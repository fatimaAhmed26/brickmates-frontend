const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/sets`;
const THEMES_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/themes`;

const index = async (page = 1) => {
  try {
    const res = await fetch(`${BASE_URL}?page=${page}`);
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

const show = async (setId) => {
  try {
    const res = await fetch(`${BASE_URL}/${setId}`);
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

const search = async (query, page = 1) => {
  try {
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}`);
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

const themes = async () => {
  try {
    const res = await fetch(THEMES_URL);
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

export { index, show, search, themes };