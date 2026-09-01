import { useState, useEffect } from 'react'
import { useParams } from "react-router"
import toast from 'react-hot-toast'
import * as setService from "../services/set"
import { collectionToggle } from '../services/user'

const SetDetails = ({ user, setUser }) => {
  const { setId } = useParams()
  const [set, setSet] = useState(null)

  useEffect(() => {
    const fetchSet = async () => {
      const setData = await setService.show(setId)
      setSet(setData)
    }
    fetchSet()
  }, [setId])

  if (!set) return <p>Loading...</p>

  const isOwned = user?.collectionSetIds?.includes(set.setNum)

  const handleOwnToggle = async () => {
    const updatedUser = await collectionToggle(user._id, set.setNum)
    setUser(updatedUser)
    toast.success(
      updatedUser.collectionSetIds?.includes(set.setNum)
        ? 'Added to your collection'
        : 'Removed from your collection'
    )
  }

  return (
    <div>
      <img src={set.image} alt={set.name} />
      <h2>{set.name}</h2>
      <p>{set.theme} · {set.year} · {set.pieceCount} pieces</p>
      {user && (
        <button onClick={handleOwnToggle}>
          {isOwned ? 'Owned ✓ (remove)' : 'Own it'}
        </button>
      )}
    </div>
  )
}

export default SetDetails