import React, { useEffect, useState, useContext, useRef } from 'react';
import { UserContext } from '../../App';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Spinner } from '../spinner';
import M from 'materialize-css';

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});

const UserProfile = () => {
  const history = useHistory();
  const followingModal = useRef(null);
  const followerModal = useRef(null);
  const [following, setFollowing] = useState([]);
  const [follower, setFollower] = useState([]);

  const [userProfile, setProfile] = useState(null);
  const [showFollow, setShowFollow] = useState(true);
  const { state, dispatch } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    M.Modal.init(followingModal.current);
    M.Modal.init(followerModal.current);

    fetch(`/profile/${id}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(
          result.user.followers.includes(
            JSON.parse(localStorage.getItem('user'))._id,
          ),
        );
        console.log(result, 'ㅇㅇ');
        console.log(
          result.user.followers.includes(
            JSON.parse(localStorage.getItem('user'))._id,
          ),
          'ㅋㅋ',
        );
        JSON.parse(localStorage.getItem('user')).following.forEach((p) => {
          if (p._id === result.user._id) {
            setShowFollow(false);
          }
        });
        setProfile(result);
      });
  }, [id]);

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
        dispatch({
          type: 'UPDATE',
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem('user', JSON.stringify(data));
        setFollowing(data.following);
        setFollower(data.followers);
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data],
            },
          };
        });
        console.log(userProfile.user.following, 'userProfile');
        setShowFollow(!showFollow);
      });

    fetch(`/profile/${id}`, {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(
          result.user.followers.includes(
            JSON.parse(localStorage.getItem('user'))._id,
          ),
        );
        console.log(result, 'ㅇㅇ');
        if (
          result.user.followers.includes(
            JSON.parse(localStorage.getItem('user'))._id,
          )
        ) {
          setShowFollow(false);
        }
        setProfile(result);
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
        setFollowing(data.following);
        setFollower(data.followers);
        setProfile((prevState) => {
          const arr = [];
          prevState.user.followers.forEach((p) => {
            arr.push(p._id);
          });
          const newFollower = arr.filter((item) => {
            return item !== data._id;
          });

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

    fetch(`/profile/${id}`, {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(
          result.user.followers.includes(
            JSON.parse(localStorage.getItem('user'))._id,
          ),
        );
        console.log(result, 'ㅇㅇ');
        if (
          result.user.followers.includes(
            JSON.parse(localStorage.getItem('user'))._id,
          )
        ) {
          setShowFollow(false);
        }
        setProfile(result);
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
                    className="btn-small waves-effect waves-light"
                    onClick={() => unfollowUser()}
                    style={{ fontWeight: 'bold' }}
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
                <h6
                  style={{ fontWeight: 'bold', marginRight: '10px' }}
                  data-target="followers"
                  className="modal-trigger"
                >
                  {userProfile ? userProfile.user.followers.length : '0'}{' '}
                  followers
                </h6>
                <h6
                  style={{ fontWeight: 'bold', marginRight: '10px' }}
                  data-target="followings"
                  className="modal-trigger"
                >
                  {userProfile ? userProfile.user.following.length : '0'}{' '}
                  following
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
      <div id="followings" className="modal" ref={followingModal}>
        <div className="modal-content">
          <ul className="collection clear">
            {userProfile
              ? userProfile.user.following.map((data, i) => {
                  return (
                    <Link
                      to={
                        data._id !== state._id
                          ? '/profile/' + data._id
                          : '/profile'
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
                })
              : 'nope'}
          </ul>
        </div>
        <div className="modal-footer">
          <a className="modal-close waves-effect waves-green btn-flat">Agree</a>
        </div>
      </div>

      <div id="followers" className="modal" ref={followerModal}>
        <div className="modal-content">
          <ul className="collection clear">
            {userProfile
              ? userProfile.user.followers.map((data, i) => {
                  return (
                    <Link
                      to={
                        data._id !== state._id
                          ? '/profile/' + data._id
                          : '/profile'
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
                })
              : 'nope'}
          </ul>
        </div>
        <div className="modal-footer">
          <a className="modal-close waves-effect waves-green btn-flat">Agree</a>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
