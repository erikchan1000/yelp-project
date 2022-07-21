import React from 'react'
import {UseBusinessSearch} from './YelpApi/BusinessSearch'

export default function Search() {
    const [businesses, amountResults, searchParams, setSearchParams] = UseBusinessSearch(term, latitude, longitude)

  return (
    <div>Search</div>
  )
}
