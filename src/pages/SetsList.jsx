import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import * as setService from "../services/set";

const SetsList = () => {
  const [sets, setSets] = useState([])

  useEffect(() => {
    const fetchSets = async () => {
      const setsData = await setService.index()
      setSets(setsData)
    }
    fetchSets()
  }, [])

  return (
    <div>
     {sets.map((set) => (
  <Link to={`/sets/${set.setNum}`} key={set.setNum}>
    <img src={set.image} alt={set.name} />
    <h3>{set.name}</h3>
    <p>{set.theme} · {set.year} · {set.pieceCount} pieces</p>
  </Link>
))}
    </div>
  );
};

export default SetsList