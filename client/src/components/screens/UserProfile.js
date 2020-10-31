import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';
import { Spinner } from '../spinner';

const UserProfile = () => {
  const [userProfile, setProfile] = useState(null);
  const [showFollow, setShowFollow] = useState(true);
  const { state, dispatch } = useContext(UserContext);
  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    fetch(`/profile/${id}`, {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result.user.followers.includes(state._id));
        if (result.user.followers.includes(state._id)) {
          setShowFollow(false);
        }
        setProfile(result);
      });
  }, []);

  const followUser = () => {
    fetch('/follow', {
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
        setShowFollow(!showFollow);
      });
  };

  const unfollowUser = () => {
    fetch('/unfollow', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        unfollowId: id,
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
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id,
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(!showFollow);
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
              paddingBottom: '30px',
              paddingTop: '30px',
              borderBottom: '1px solid grey',
            }}
          >
            <div>
              <img
                style={{
                  display: 'block',
                  width: '80px',
                  height: '80px',
                  borderRadius: '80px',
                }}
                src={userProfile.user.pic}
                alt="proImg"
              />
            </div>
            <div style={{ marginLeft: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h5 style={{ margin: 0, marginRight: '15px' }}>
                  {userProfile.user.name}
                </h5>
                {showFollow ? (
                  <button
                    className="btn-small waves-effect waves-light"
                    onClick={() => followUser()}
                    style={{ fontWeight: 'bold' }}
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    className="btn waves-effect waves-light"
                    onClick={() => unfollowUser()}
                  >
                    UnFollow
                  </button>
                )}
              </div>
              <h6>{userProfile.user.email}</h6>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h6 style={{ fontWeight: 'bold', marginRight: '15px' }}>
                  {userProfile.posts.length} posts
                </h6>
                <h6 style={{ fontWeight: 'bold', marginRight: '15px' }}>
                  {userProfile.user.followers.length} followers
                </h6>
                <h6 style={{ fontWeight: 'bold', marginRight: '15px' }}>
                  {userProfile.user.following.length} following
                </h6>
              </div>

              {/* <button
                className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={() => followUser()}
              >
                Follow
              </button>

              <button
                className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={() => followUser()}
              >
                UnFollow
              </button> */}
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
        <Spinner />
      )}
    </>
  );
};

export default UserProfile;
