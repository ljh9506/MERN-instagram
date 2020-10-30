import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';
import '../App.css';

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems, 'right');
});

const Navbar = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const renderList = () => {
    if (state) {
      return [
        <li>
          <Link to="/profile" className="sidenav-close">
            Profile
          </Link>
        </li>,
        <li>
          <Link to="/create" className="sidenav-close">
            Create Post
          </Link>
        </li>,
        <li>
          <Link to="/followingposts" className="sidenav-close">
            Following Posts
          </Link>
        </li>,
        <li>
          <button
            className="btn waves-effect waves-light #c62828 red darken-1"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: 'CLEAR' });
              history.push('/login');
              M.toast({
                html: 'Logout success',
                classes: '#c62828 red darken-1',
              });
            }}
            style={{
              borderRadius: '30px',
              marginLeft: '100px',
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/login" className="sidenav-close">
            Login
          </Link>
        </li>,
        <li>
          <Link to="/signup" className="sidenav-close">
            Signup
          </Link>
        </li>,
      ];
    }
  };

  {
    /* <nav>
    <div class="nav-wrapper">
      <a href="#!" class="brand-logo">Logo</a>
      <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
      <ul class="right hide-on-med-and-down">
        <li><a href="sass.html">Sass</a></li>
        <li><a href="badges.html">Components</a></li>
        <li><a href="collapsible.html">Javascript</a></li>
        <li><a href="mobile.html">Mobile</a></li>
      </ul>
    </div>
  </nav>

  <ul class="sidenav" id="mobile-demo">
    <li><a href="sass.html">Sass</a></li>
    <li><a href="badges.html">Components</a></li>
    <li><a href="collapsible.html">Javascript</a></li>
    <li><a href="mobile.html">Mobile</a></li>
  </ul> */
  }

  return (
    <>
      <nav style={{ boxShadow: 'none' }}>
        <div className="nav-wrapper white">
          <Link to={state ? '/' : '/login'} className="brand-logo">
            Instagram
          </Link>
          <a
            href="#"
            data-target="mobile-demo"
            className="sidenav-trigger right"
          >
            <i className="material-icons">menu</i>
          </a>
          <ul
            className="right hide-on-med-and-down"
            style={{ marginRight: '20px' }}
          >
            {renderList()}
          </ul>
        </div>
      </nav>

      <ul className="sidenav" id="mobile-demo" style={{ paddingTop: '30px' }}>
        {renderList()}
      </ul>

      {/* <nav>
        <div className="nav-wrapper white">
          <Link to={state ? '/' : '/login'} className="brand-logo left">
            Instagram
          </Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>
      </nav> */}
    </>
  );
};

export default Navbar;
