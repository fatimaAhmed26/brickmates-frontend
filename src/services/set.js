const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/sets`

const search = async (query) => {
    try {
        const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`)
        return res.json()
    } catch (err) {
        console.log(err)
    }
}

export { search }