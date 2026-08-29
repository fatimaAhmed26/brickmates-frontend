import { useState, useEffect } from 'react'
import { useParams } from "react-router"
import * as setService from "../services/set";
const SetDetails = () => {
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

  return (
    <div>
      <img src={set.image} alt={set.name} />
      <h2>{set.name}</h2>
      <p>{set.theme} · {set.year} · {set.pieceCount} pieces</p>
    </div>
  );
};

export default SetDetails;