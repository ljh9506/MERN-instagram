import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    fetch(`http://localhost:5000/profile/${id}`, {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setProfile(result);
      });
  }, []);

  const followUser = () => {
    fetch('http://localhost:5000/follow', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        followId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: 'UPDATE',
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem('user', JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
      });
  };

  return (
    <>
      {userProfile ? (
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
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '80px',
                }}
                src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                alt="proImg"
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h4>{userProfile.user.email}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h5>{userProfile.posts.length} posts</h5>
                <h5>{userProfile.user.followers.length} followers</h5>
                <h5>{userProfile.user.following.length} following</h5>
              </div>
              <button
                className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={() => followUser()}
              >
                Follow
              </button>
            </div>
          </div>

          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <img
                  className="item"
                  src={item.photo}
                  alt="img"
                  key={item._id}
                />
              );
            })}
          </div>
        </div>
      ) : (
        'Loading...'
      )}
    </>
  );
};

export default UserProfile;
