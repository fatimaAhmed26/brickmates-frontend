const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/queue`

const create = async (setNum, setName) => {
    try {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ setNum, setName }),
        })
        return res.json()
    } catch (err) {
        console.log(err)
    }
}

const deleteQueue = async (queueId) => {
    try {
        const res = await fetch(`${BASE_URL}/${queueId}`, {
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

const status = async (queueId) => {
    try {
        const res = await fetch(`${BASE_URL}/${queueId}/status`, {
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
    create,
    deleteQueue,
    status,
}