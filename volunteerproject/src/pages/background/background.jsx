
import './background.css';
import Video1 from '../../assets/video1.mp4'; 
import Vol5 from '../../assets/vol5.jpg'; // Adjusted path
import vol13 from '../../assets/vol13.jpeg'; 
import Vol12 from '../../assets/vol12.jpg';
import Vol11 from '../../assets/vol11.jpg'; // Adjusted path

const Background = ({ playStatus, heroCount }) => {
  
  if (playStatus) {
    return (
      <video className='background fade in' autoPlay loop muted>
        <source src={Video1} type='video/mp4' />
      </video>
    );
  } else if (heroCount === 0) {
    return (<img src={Vol5} className='background fade in' alt='' />);
  } else if (heroCount === 1) {
    return (<img src={vol13} className='background fade in' alt='' />);
  } else if (heroCount === 2) {
    return (<img src={Vol12} className='background fade in' alt='' />);
  } else if (heroCount === 3) {
    return (<img src={Vol11} className='background fade in' alt='' />);
  } 
  
};

export default Background;