import homeIcon from '../../assets/icons/home.svg';

import reportIcon from '../../assets/icons/report.svg';
import userIcon from '../../assets/icons/user.svg';
import PlusIcon from '../../assets/icons/plus.svg'
import Logout from '../../assets/icons/logout.png'

export const navigationLinks = [
    { id: 1, title: 'Dashboard', href: '/home/volunteer', image: homeIcon },
    { id: 2, title: 'Saved Opportunities', href: '/home/saved-opportunities', image: PlusIcon },
    { id: 3, title: 'Volunteer Stats', href: '/home/stats', image: reportIcon },
    { id: 5, title: 'Feedback', href: '/home/feedback', image: userIcon },
    { id: 7, title: 'logout', href: '/login/volunteer', image: Logout }
];
