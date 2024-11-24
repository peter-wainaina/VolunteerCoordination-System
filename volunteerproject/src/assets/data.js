import homeIcon from '../assets/icons/home.svg';
import BudgetIcon from '../assets/icons/budget.svg';
import reportIcon from '../assets/icons/report.svg';
import PlusIcon from '../assets/icons/plus.svg'
import Logout from '../assets/icons/logout.png'
import Check from '../assets/icons/check.svg'

export const navigationLinks = [
    { id: 1, title: 'Dashboard', href: '/home/Organization', image: homeIcon },
    { id: 2, title: 'Post Opportunity', href: '/home/Organization/post-opportunity', image: PlusIcon },
    { id: 3, title: 'View opportunities', href: '/home/Organization/view-opportunities', image: reportIcon },
    { id: 4, title: 'recent Applications', href: '/home/Organization/view-applications', image: BudgetIcon },
    { id: 5, title: 'Feedback', href: '/home/Organization-feedback', image: BudgetIcon },
    { id: 6, title: 'view volunteers', href: '/home/volunteerview', image: Check },
    { id: 7, title: 'logout', href: '/', image: Logout }
];
