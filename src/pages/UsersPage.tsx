import React from 'react'
import SearchUsers from '../components/searchUsers'
import FollowingList from '../components/following'

function UsersPage() {
  return (
    <div>
      <SearchUsers /> 
      <FollowingList />
    </div>
  )
}

export default UsersPage
