import React from 'react';
import homeIcon from '../../assets/video-call.png';
import { APP_NAME, repoName } from '../../constants';
import './Navbar.css';
import StarIcon from '@material-ui/icons/Star';

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className='title-div'>
        <img src={homeIcon} alt='' />
        <h3>{APP_NAME}</h3>
      </div>
      <a className='repo' href={repoName} target='_blank'>
        <StarIcon className='rotate' />
        <div className='repo-text'>
          <p className='github-name'>Github</p>
          <p className='repo-name'>Give repo a star</p>
        </div>
      </a>
    </div>
  );
};

export default Navbar;
