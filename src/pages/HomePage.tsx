import React from 'react'
import LatestReviews from '../components/LatestReviews'

function HomePage() {
  return (
    <>
    <div style={{margin: "auto", display: "flex", flexDirection: "column", justifyContent: "space-around", padding: "2em"
    }}>
      <h1>Create your personal book collection</h1>
      <br />
      <h2>Review your favorite books <br />and share them with your friends</h2>
    </div>
    <LatestReviews />
    </>
  )
}

export default HomePage
