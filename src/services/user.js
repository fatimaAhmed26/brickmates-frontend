const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`

const index = async (formData) => {
    try {
        const res = await fetch(`${BASE_URL}/users`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        const data = await res.json()
        

        if (data.err) {
            console.log(data.err)
            throw new Error(data.err)
        }

        return data
    } catch (err) {
        throw new Error(err)
    }
}

const show = async (userId) => {
    try {
        const res = await fetch(`${BASE_URL}/users/${userId}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        const data = await res.json()

        if (data.err) {
            console.log(data.err)
            throw new Error(data.err)
        }

        return data
    } catch (err) {
        throw new Error(err)
    }
}

const update = async (userId, formData) => {
    try {
        const res = await fetch(`${BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: formData,
        })
        const data = await res.json()

        if (data.err) {
            console.log(data.err)
            throw new Error(data.err)
        }

        return data
    } catch (err) {
        throw new Error(err)
    }
}

const followToggle = async (userId) => {
    try {
        const res = await fetch(`${BASE_URL}/users/${userId}/follow`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        const data = await res.json()

        if (data.err) {
            console.log(data.err)
            throw new Error(data.err)
        }

        return data
    } catch (err) {
        throw new Error(err)
    }
}

const collectionToggle = async (userId, setId) => {
    try {
        const res = await fetch(`${BASE_URL}/users/${userId}/collection`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ setId }),
        })
        const data = await res.json()

        if (data.err) {
            console.log(data.err)
            throw new Error(data.err)
        }

        return data
    } catch (err) {
        throw new Error(err)
    }
}

export {
    index,
    show,
    update,
    followToggle,
    collectionToggle
}