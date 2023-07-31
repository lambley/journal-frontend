import React from 'react'
import { useParams } from 'react-router-dom'

export const LabelPage:React.FC = () => {
  const { label } = useParams<{ label:string }>()
  return (
    <div>
      <h1><span className={`label-page-heading post-label-${label}`}>#{label}</span> Quotes</h1>
    </div>
  )
}
