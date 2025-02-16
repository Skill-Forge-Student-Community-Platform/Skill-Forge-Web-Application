import React from 'react'
import Notification from '../components/Notification'
import SearchBar from '../components/searchbar'
import FriendsList from '../components/friendslist'

export default function Home() {
  return (
    <div>
      <Notification/>
      <SearchBar/>
    </div>
  )
}
