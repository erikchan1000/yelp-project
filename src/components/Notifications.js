import React, {useEffect, useState} from 'react'
import {Button, Row, Col, Toast} from 'react-bootstrap'
import {getMyToken} from './Firebase/Firebase'


const Notifications = (props) => {
  const [isTokenFound, setTokenFound] = useState(false)
  

  console.log("Token Found: ", isTokenFound)

  useEffect(() => {
    let data;
    async function tokenFunc() {
      data = await getMyToken(setTokenFound)
      if (data) {
        console.log("Token Found: ", data)
      }
      return data
    }
    tokenFunc()
  }
  , [setTokenFound])



  return (
    <>
    <h1>{isTokenFound}</h1>
    </>
  )
      }

Notifications.propTypes = {}

export default Notifications