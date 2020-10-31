import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import { Spinner } from '../spinner';

const Home = () => {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState(false);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {}, []);

  useEffect(() => {
    fetch('/allposts', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result.posts);
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch('/like', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const unlikePost = (id) => {
    fetch('/unlike', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const makeComment = (text, postId) => {
    fetch('/comment', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        text,
        postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);

        if (result) {
        }
      })
      .catch((err) => console.log(err));
  };

  const deletePost = (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('정말 삭제하시겠습니까??') === true) {
      fetch(`/deletepost/${id}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('jwt'),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          const newData = data.filter((item) => {
            return item._id !== result.deletedPost._id;
          });
          setData(newData);
        })
        .catch((err) => console.log(err));
    } else {
      return;
    }
  };

  const onChange = (e) => {
    if (e.target.value) {
      setInputValue(true);
    } else {
      setInputValue(false);
    }
    console.log(inputValue);
  };

  return (
    <div className="home">
      {data.length === 0 ? (
        <Spinner />
      ) : (
        data.map((item) => {
          return (
            <div className="card home-card" key={item._id}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Link
                  to={`/profile/${item.postedBy._id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={item.postedBy.pic}
                    alt="img"
                    style={{
                      display: 'block',
                      width: '35px',
                      height: '35px',
                      borderRadius: '50%',
                      margin: '20px 10px 20px 20px',
                      border: '2px solid grey',
                      overflow: 'hidden',
                    }}
                  ></img>
                  <h5 style={{ margin: '0' }}>{item.postedBy.name}</h5>
                </Link>
                {item.postedBy._id === state._id && (
                  <i
                    className="material-icons"
                    style={{
                      color: 'grey',
                      float: 'right',
                      cursor: 'pointer',
                    }}
                    onClick={() => deletePost(item._id)}
                  >
                    delete
                  </i>
                )}
              </div>
              <div className="card-image">
                <img src={item.photo} alt="img" />
              </div>
              <div className="card-content">
                <div
                  className="icon-content"
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <i
                    className="material-icons"
                    style={{ cursor: 'pointer', color: 'red' }}
                  >
                    favorite
                  </i>
                  {item.likes.includes(state._id) ? (
                    <i
                      className="material-icons"
                      onClick={() => unlikePost(item._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      thumb_down
                    </i>
                  ) : (
                    <i
                      className="material-icons"
                      onClick={() => likePost(item._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      thumb_up
                    </i>
                  )}
                  <i className="material-icons" style={{ cursor: 'pointer' }}>
                    chat_bubble_outline
                  </i>
                </div>
                <h6 style={{ fontWeight: 'bold' }}>
                  {item.likes.length} likes
                </h6>
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                {item.comments.map((comment) => {
                  return (
                    <h6 key={comment._id}>
                      <span style={{ fontWeight: '500' }}>
                        {comment.postedBy.name}
                      </span>{' '}
                      {comment.text}
                    </h6>
                  );
                })}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    makeComment(e.target[0].value, item._id);
                    e.target[0].value = '';
                  }}
                  onChange={(e) => onChange(e)}
                  style={{ display: 'block', position: 'relative' }}
                  className="home-input"
                >
                  <input type="text" placeholder="add a comment..." />
                  <button
                    style={{
                      position: 'absolute',
                      right: '3px',
                      top: '0',
                      bottom: '20%',
                      margin: 'auto',
                      color: '#0095f6',
                      opacity: inputValue ? '1' : '.3',
                      cursor: 'pointer',
                      border: 'none',
                      backgroundColor: 'white',
                    }}
                    type="submit"
                  >
                    게시
                  </button>
                </form>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Home;
