const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/matches`

const show = async (matchId) => {
    try {
        const res = await fetch(`${BASE_URL}/${matchId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return res.json()
    } catch (err) {
        console.log(err)
    }
}

const updateStep = async (matchId, data) => {
    try {
        const res = await fetch(`${BASE_URL}/${matchId}/step`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(data),
        })
        return res.json()
    } catch (err) {
        console.log(err)
    }
}

export {
    show,
    updateStep,
}