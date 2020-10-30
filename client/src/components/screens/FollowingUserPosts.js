import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';

const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:5000/getsubpost', {
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
    fetch('http://localhost:5000/like', {
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
    fetch('http://localhost:5000/unlike', {
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
    fetch('http://localhost:5000/comment', {
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
    fetch(`http://localhost:5000/deletepost/${id}`, {
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
  };

  return (
    <div className="home">
      {data
        .map((item) => {
          return (
            <div className="card home-card" key={item._id}>
              <h5>
                <Link to={`/profile/${item.postedBy._id}`}>
                  {item.postedBy.name}
                </Link>
                {item.postedBy._id === state._id && (
                  <i
                    className="material-icons"
                    style={{ color: 'grey', float: 'right', cursor: 'pointer' }}
                    onClick={() => deletePost(item._id)}
                  >
                    delete
                  </i>
                )}
              </h5>
              <div className="card-image">
                <img src={item.photo} alt="img" />
              </div>
              <div className="card-content">
                <i className="material-icons" style={{ color: 'red' }}>
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

                <h6>{item.likes.length} likes</h6>
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
                >
                  <input type="text" placeholder="add a comment" />
                </form>
              </div>
            </div>
          );
        })
        .reverse()}
    </div>
  );
};

export default Home;
