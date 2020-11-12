import Axios from 'axios';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { UserContext } from '../../App';
import { Spinner } from '../spinner';
import M from 'materialize-css';
import { Link } from 'react-router-dom';

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});

const Profile = () => {
  const followingModal = useRef(null);
  const followerModal = useRef(null);
  const [userDetails, setUserDetails] = useState([]);
  const [follower, setFollower] = useState([]);
  const [data, setData] = useState([]);
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    console.log(state, '스테이트');
    M.Modal.init(followingModal.current);
    M.Modal.init(followerModal.current);

    fetch('/following-user', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUserDetails(result.following);
        setFollower(result.followers);
      });
  }, []);

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
    <>
      <div style={{ maxWidth: '800px', margin: '0px auto' }}>
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
              alignItems: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                style={{ width: '80px', height: '80px', borderRadius: '80px' }}
                src={state ? state.pic : 'loading'}
                alt="proImg"
              />

              <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    Update Profile Image
                  </span>
                  <input
                    type="file"
                    name="image"
                    onChange={(e) => updatePhoto(e.target.files[0])}
                  />
                </div>
                <div className="file-path-wrapper" style={{ opacity: '0' }}>
                  <input
                    className="file-path validate"
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* <div style={{ marginLeft: '15px' }}>
              <h5>{state ? state.name : 'loading'}</h5>
              <h5>{state ? state.email : 'loading'}</h5>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h6 style={{ fontWeight: 'bold', marginRight: '10px' }}>
                  {data.length} posts
                </h6>
                <h6
                  style={{ fontWeight: 'bold', marginRight: '10px' }}
                  data-target="followers"
                  className="modal-trigger"
                >
                  {state ? state.followers.length : '0'} followers
                </h6>
                <h6
                  style={{ fontWeight: 'bold', marginRight: '10px' }}
                  data-target="followings"
                  className="modal-trigger"
                >
                  {state ? state.following.length : '0'} following
                </h6>
              </div>
            </div> */}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              borderBottom: '1px solid lightgrey',
              borderTop: '1px solid lightgrey',
              padding: '10px 0',
              margin: '20px 0',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontWeight: 'bold',
                alignItems: 'center',
              }}
            >
              <h6
                style={{ fontWeight: 'bold' }}
                data-target="followers"
                className="modal-trigger"
              >
                <span style={{ color: 'grey' }}>posts</span>
              </h6>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {data.length}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontWeight: 'bold',
                alignItems: 'center',
              }}
            >
              <h6
                style={{ fontWeight: 'bold' }}
                data-target="followers"
                className="modal-trigger"
              >
                <span style={{ color: 'grey' }}>followers</span>
              </h6>
              <span
                data-target="followers"
                className="modal-trigger"
                style={{ fontSize: '16px', fontWeight: 'bold' }}
              >
                {state ? state.followers.length : '0'}{' '}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontWeight: 'bold',
                alignItems: 'center',
              }}
            >
              <h6
                style={{ fontWeight: 'bold' }}
                data-target="followings"
                className="modal-trigger"
              >
                <span style={{ color: 'grey' }}>following</span>
              </h6>
              <span
                data-target="followings"
                className="modal-trigger"
                style={{ fontSize: '16px', fontWeight: 'bold' }}
              >
                {state ? state.following.length : '0'}
              </span>
            </div>
          </div>
        </div>

        <div className="gallery">
          {data.length === 0 ? (
            <img
              src="http://cgcollege.org/Assets/images/icons/nodata-found.png"
              alt="no-data"
              style={{ width: '100%' }}
            ></img>
          ) : (
            data.map((item) => {
              return (
                <img
                  className="item"
                  src={item.photo}
                  alt="img"
                  key={item._id}
                />
              );
            })
          )}
        </div>
      </div>

      <div id="followings" className="modal" ref={followingModal}>
        <div className="modal-content">
          <ul className="collection clear">
            {state.following.map((data, i) => {
              return (
                <Link
                  to={
                    data._id !== state._id ? '/profile/' + data._id : '/profile'
                  }
                  onClick={() => {
                    M.Modal.getInstance(followingModal.current).close();
                  }}
                  style={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid lightgrey',
                  }}
                  key={i}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={data.pic}
                      alt="img"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        marginRight: '10px',
                      }}
                    ></img>
                    <li className="collection-item">{data.email}</li>
                  </div>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className="modal-footer">
          <a className="modal-close btn-flat" style={{ fontWeight: 'bold' }}>
            Close
          </a>
        </div>
      </div>

      <div id="followers" className="modal" ref={followerModal}>
        <div className="modal-content">
          <ul className="collection clear">
            {state.followers.map((data, i) => {
              return (
                <Link
                  to={
                    data._id !== state._id ? '/profile/' + data._id : '/profile'
                  }
                  onClick={() => {
                    M.Modal.getInstance(followerModal.current).close();
                  }}
                  style={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid lightgrey',
                  }}
                  key={i}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={data.pic}
                      alt="img"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        marginRight: '10px',
                      }}
                    ></img>
                    <li className="collection-item">{data.email}</li>
                  </div>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className="modal-footer">
          <a className="modal-close btn-flat" style={{ fontWeight: 'bold' }}>
            Close
          </a>
        </div>
      </div>
    </>
  );
};

export default Profile;
