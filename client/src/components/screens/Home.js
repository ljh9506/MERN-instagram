import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import { Spinner } from '../spinner';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [fetchBlock, setFetchBlock] = useState(true);
  const [inputValue, setInputValue] = useState(false);
  const { state, dispatch } = useContext(UserContext);
  let dataPage = useRef(1);

  const fetchData = async () => {
    console.log(dataPage.current);
    if (dataPage.current >= 2) {
      setLoading(true);
    }

    setFetching(true);

    await fetch(`/allposts?p=${dataPage.current}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result.posts);
        console.log(dataPage.current);
        if (result.posts.length === 0) {
          dataPage.current--;
          setFetchBlock(false);
          return;
        }
        const mergedData = data.concat(...result.posts);
        setData(mergedData);
      });
    setFetching(false);
    setLoading(false);
  };

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    // console.log(scrollHeight, scrollTop + clientHeight);
    if (
      scrollTop + clientHeight + 100 >= scrollHeight &&
      fetching === false &&
      fetchBlock
    ) {
      // 페이지 끝에 도달하면 추가 데이터를 받아온다
      dataPage.current++;
      fetchData();
    }
  };

  useEffect(() => {
    // scroll event listener 등록
    window.addEventListener('scroll', handleScroll);
    return () => {
      // scroll event listener 해제
      window.removeEventListener('scroll', handleScroll);
    };
  });

  useEffect(() => {
    fetchData();
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
    if (!inputValue) {
      alert('내용을 입력하세요');
      return;
    }
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
    setInputValue(false);
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

  const deleteComment = (commentId, postId) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('정말 삭제하시겠습니까??') === true) {
      fetch(`/deletecomment/${postId}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('jwt'),
        },
        body: JSON.stringify({
          id: commentId,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
        })
        .catch((err) => console.log(err));
    } else {
      return;
    }
    console.log(commentId, postId);
  };

  const onChange = (e) => {
    console.log(e.target.value.length);
    if (e.target.value.length === 0) {
      setInputValue(false);
    } else {
      setInputValue(true);
    }
    console.log(inputValue);
  };

  return (
    <>
      <div className="home">
        {data.length === 0 ? (
          <div className="spinner-container">
            <Spinner />
          </div>
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
                        marginRight: '20px',
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
                  <h5 style={{ fontWeight: 'bold' }}>{item.title}</h5>
                  <h6 style={{ margin: '20px 0', fontSize: '18px' }}>
                    {item.body}
                  </h6>
                  {item.comments.map((comment) => {
                    return (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginTop: '5px',
                        }}
                        key={comment._id}
                      >
                        <Link
                          to={`/profile/${comment.postedBy._id}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <div className="card-image">
                            <img
                              src={comment.postedBy.pic}
                              alt="img"
                              style={{
                                display: 'block',
                                width: '25px',
                                height: '25px',
                                borderRadius: '50%',
                                margin: '5px 10px 5px 0',
                                border: '2px solid grey',
                                overflow: 'hidden',
                              }}
                            />
                          </div>
                        </Link>
                        <h6 key={comment._id} style={{ margin: '0 10px 0 0' }}>
                          <span
                            style={{
                              fontWeight: 'bold',
                              marginRight: '10px',
                            }}
                          >
                            {comment.postedBy.name}
                          </span>{' '}
                          {comment.text}
                          {/* {comment.postedBy._id === state._id && (
                            <i
                              className="material-icons"
                              style={{
                                color: 'grey',
                                float: 'right',
                                cursor: 'pointer',
                                marginLeft: '20px',
                              }}
                              onClick={() =>
                                deleteComment(comment._id, item._id)
                              }
                            >
                              delete
                            </i>
                          )} */}
                        </h6>
                      </div>
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
        <div style={{ margin: '0 auto' }}>
          <img
            className={loading ? 'show' : 'hidden'}
            src="https://icons-for-free.com/iconfiles/png/512/instagram+icon+instagram+logo+logo+icon-1320184050987950067.png"
            alt="loading"
          ></img>
        </div>
      </div>
    </>
  );
};

export default Home;
