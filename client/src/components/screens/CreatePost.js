import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Spinner } from '../spinner';
import axios from 'axios';
import M from 'materialize-css';

const CreatePost = () => {
  const history = useHistory();
  const [form, setForm] = useState({
    title: '',
    body: '',
  });
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const { title, body } = form;
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((form) => ({ ...form, [name]: value }));
    console.log(form);
  };

  useEffect(() => {
    if (url) {
      fetch('/createpost', {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('jwt'),
        },
        body: JSON.stringify({
          ...form,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.message) {
            setLoading(true);
            M.toast({ html: data.message, classes: '#43a047 green darken-1' });
            history.push('/');
          } else {
            M.toast({
              html: 'error is occured',
              classes: '#c62828 red darken-3',
            });
          }
        });
    }
  }, [url]);

  const postDetails = () => {
    setLoading(false);
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'insta-clone');
    data.append('cloud_name', 'ljhcloud1949');
    axios
      .post('https://api.cloudinary.com/v1_1/ljhcloud1949/image/upload', data)
      .then((res) => setUrl(res.data.url))
      .catch((err) => console.log(err));
  };

  return (
    <div
      className="card input-filed"
      style={{
        margin: '40px auto',
        maxWidth: '700px',
        padding: '40px',
        textAlign: 'center',
      }}
    >
      <input
        name="title"
        type="text"
        value={title}
        placeholder="title"
        onChange={onChange}
      />
      <input
        name="body"
        type="text"
        value={body}
        placeholder="body"
        onChange={onChange}
      />

      <div className="file-field input-field">
        <div className="btn #64b5f6 blue darken-1">
          <span>Upload Image</span>
          <input
            type="file"
            name="image"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #64b5f6 blue darken-1"
        onClick={() => postDetails()}
      >
        Submit Post
      </button>
      {loading ? '' : <Spinner />}
    </div>
  );
};

export default CreatePost;
