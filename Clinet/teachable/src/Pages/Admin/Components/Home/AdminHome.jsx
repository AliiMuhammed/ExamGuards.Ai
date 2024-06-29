import React from 'react'
import { getAuthUser } from '../../../../Helper/Storage'
import './style/adminHome.css'
import { Gauge } from '@mui/x-charts/Gauge';

const AdminHome = () => {
  const user =getAuthUser().data.data.user;
 
  return (
    <section className='admin-home'>
      <div className="container">

        <div className="header">
        <span>Welcome</span>
        <h1>{`${user.firstName} ${user.lastName}`}</h1>
        </div>
      </div>
    </section>
  )
}

export default AdminHome