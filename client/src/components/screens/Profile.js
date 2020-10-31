import Axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import { Spinner } from '../spinner';

const Profile = () => {
  const [data, setData] = useState([]);
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch('/myposts', {
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

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append('file', image);
      data.append('upload_preset', 'insta-clone');
      data.append('cloud_name', 'ljhcloud1949');
      fetch('https://api.cloudinary.com/v1_1/ljhcloud1949/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setUrl(data.url);
        });

      console.log(url);

      setImage(null);
    }
  }, [image]);

  useEffect(() => {
    if (url) {
      fetch('/updateprofile', {
        method: 'put',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('jwt'),
        },
        body: JSON.stringify({ pic: url }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          localStorage.setItem('user', JSON.stringify(result));
          dispatch({ type: 'UPDATEPIC', payload: { pic: result.pic } });
        })
        .catch((err) => console.log(err));
    }
  }, [url]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0px auto' }}>
      <div
        style={{
          margin: '18px 0px',
          borderBottom: '1px solid grey',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <div>
            <img
              style={{ width: '80px', height: '80px', borderRadius: '80px' }}
              src={state ? state.pic : 'loading'}
              alt="proImg"
            />
          </div>
          <div style={{ marginLeft: '15px' }}>
            <h5>{state ? state.name : 'loading'}</h5>
            <h5>{state ? state.email : 'loading'}</h5>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h6 style={{ fontWeight: 'bold', marginRight: '10px' }}>
                {data.length} posts
              </h6>
              <h6 style={{ fontWeight: 'bold', marginRight: '10px' }}>
                {state ? state.followers.length : '0'} followers
              </h6>
              <h6 style={{ fontWeight: 'bold', marginRight: '10px' }}>
                {state ? state.following.length : '0'} following
              </h6>
            </div>
          </div>
        </div>

        <div className="file-field input-field">
          <div className="btn #64b5f6 blue darken-1">
            <span>Update profile Image</span>
            <input
              type="file"
              name="image"
              onChange={(e) => updatePhoto(e.target.files[0])}
            />
          </div>
          <div className="file-path-wrapper" style={{ opacity: '0' }}>
            <input className="file-path validate" />
          </div>
        </div>
      </div>

      <div className="gallery">
        {data.length === 0 ? (
          <Spinner />
        ) : (
          data.map((item) => {
            return (
              <img className="item" src={item.photo} alt="img" key={item._id} />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Profile;
