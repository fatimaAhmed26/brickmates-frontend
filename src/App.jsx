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
import Profile from "./pages/Profile"
import EditProfile from "./pages/EditProfile"
import Chat from './pages/Chat'
import Inbox from "./pages/Inbox"

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
        <Route path='/profile/:userId' element={user ? <Profile user={user} /> : <Landing />} />
        <Route path='/profile/edit' element={user ? <EditProfile user={user} setUser={setUser} /> : <Landing />} />
        <Route path='/listings/new' element={user ? <ListingForm /> : <Landing />} />
        <Route path='/listings' element={user ? <Marketplace /> : <Landing />} />
        <Route path='/listings/:listingId' element={user ? <ListingDetail user={user} /> : <Landing />} />
        <Route path='/listings/:listingId/edit' element={user ? <EditListingForm /> : <Landing />} />
        <Route path='/chat' element={<Chat user={user} />} />
        <Route path='/chat/:recipientId' element={<Chat user={user} />} />
        <Route path='/messages/:recipientId' element={ user ? ( <div className="messages-page"> <Inbox user={user} /> <Chat user={user} /> 
        </div> ) : (  <Landing /> ) } />
        <Route path='/messages' element={user ? <Inbox user={user} /> : <Landing />} />
      </Routes>
      </main>
    </div>
  )
}

export default App