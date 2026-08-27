const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/listings`

const index = async () => {
    try {
        const res = await fetch(BASE_URL, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return res.json()
    } catch (err) {
        console.log(err)
    }
}

const show = async (listingId) => {
    try {
        const res = await fetch(`${BASE_URL}/${listingId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return res.json()
    } catch (err) {
        console.log(err)
    }
}

const create = async (formData) => {
    try {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        })
        return res.json()
    } catch (err) {
        console.log(err)
    }
}

const update = async (listingId, formData) => {
    try {
        const res = await fetch(`${BASE_URL}/${listingId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        })
        return res.json()
    } catch (err) {
        console.log(err)
    }
}

const deleteListing = async (listingId) => {
    try {
        const res = await fetch(`${BASE_URL}/${listingId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return res.json()
    } catch (err) {
        console.log(err)
    }
}

export {
    index,
    show,
    create,
    update,
    deleteListing

}