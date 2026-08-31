const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/sets`;
const THEMES_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/themes`;

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
    const data = await res.json();
    console.log('SET SEARCH RESULT:', data);   // ADD THIS LINE
    return data;
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const themes = async () => {
  try {
   const res = await fetch(THEMES_URL, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
    return res.json();
    console.log(res);
    
  } catch (err) {
    console.log(err);
  }
};

export { index, show, search, themes };