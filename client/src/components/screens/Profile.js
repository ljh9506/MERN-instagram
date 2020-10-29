import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';

const Profile = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:5000/myposts', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.myposts);
      });
  }, []);
  return (
    <div style={{ maxWidth: '1000px', margin: '0px auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          margin: '18px 0px',
          borderBottom: '1px solid grey',
        }}
      >
        <div>
          <img
            style={{ width: '160px', height: '160px', borderRadius: '80px' }}
            src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
            alt="proImg"
          />
        </div>
        <div>
          <h4>{state ? state.name : 'loading'}</h4>
          <h4>{state ? state.email : 'loading'}</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h5>40 posts</h5>
            <h5>40 followers</h5>
            <h5>40 following</h5>
          </div>
        </div>
      </div>

      <div className="gallery">
        {data.map((item) => {
          return (
            <img className="item" src={item.photo} alt="img" key={item._id} />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
