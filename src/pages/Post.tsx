import React from 'react'
import { useParams } from 'react-router-dom'

export function Post() {
  const { id } = useParams()

  return <div>Post: {id}</div>
}
