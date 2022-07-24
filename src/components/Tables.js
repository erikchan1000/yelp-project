import React from 'react'
import {Table} from 'react-bootstrap'

export default function Tables(test) {

    console.log("test", test.test)

    return (
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
            {test.test.map((businesses, i) =>
            {
                <tr key={i}>
                    <th>{businesses.name}</th>
                    <th>{businesses.url}</th>
                </tr>
            }) }
        </tbody>
      </Table>
    )
}