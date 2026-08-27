import Nav from "./components/Nav"
import SignUpForm from "./pages/SignUpForm"
import './App.css'
import { Routes, Route } from "react-router"
import { useState } from "react"
import SignInForm from "./pages/SignInForm"
import Landing from "./pages/Landing"
import Dashboard from "./pages/Dashboard"
import ListingForm from "./pages/ListingForm"
import Marketplace from "./pages/Marketplace"
import ListingDetail from "./pages/ListingDetails"
import EditListingForm from "./pages/EditListingForm"
const getUserFromToken = () => {
  const token = localStorage.getItem('token')

  if (!token) return null

  return JSON.parse(atob(token.split('.')[1])).payload
}

const App = () => {

  const [user, setUser] = useState(getUserFromToken())
  
  return (
    <div>
      <Nav user={user} setUser={setUser} />
      <main className="app-main">
      <Routes>
        <Route path='/' element={user ? <Dashboard user={user} /> : <Landing />} />
        <Route path='/sign-up' element={<SignUpForm setUser={setUser} />} />
        <Route path='/sign-in' element={<SignInForm setUser={setUser} />} />
        <Route path='/listings/new' element={user ? <ListingForm /> : <Landing />} />
        <Route path='/listings' element={user ? <Marketplace /> : <Landing />} />
        <Route path='/listings/:listingId' element={user ? <ListingDetail user={user} /> : <Landing />} />
        <Route path='/listings/:listingId/edit' element={user ? <EditListingForm /> : <Landing />} />
      </Routes>
      </main>
    </div>
  )
}

export default App