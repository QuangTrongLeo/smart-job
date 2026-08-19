
import config from '../config';
import { SidebarLayout } from '~/layouts';

// Import tất cả các Pages từ src/pages/index.js
import { 
  Home, 
  Jobs,
  JobDetail,
  Login,
    Register,
    Profile,
    Verify,
    ForgotPassword,
    Freelancers,
    FreelancerDetail,
    Messages,
    FavoriteJobs,
    FavoriteFreelancers,
    ClientJobManagement,
    FreelancerProfileManager
} from '~/pages';

const publishRoutes = [
  { path: config.routes.home, component: Home },
  { path: config.routes.jobs, component: Jobs },
  { path: '/job/:id', component: JobDetail }, // Định nghĩa đường dẫn nhận parameter id
  { path: config.routes.login, component: Login },
  { path: config.routes.register, component: Register },
  { path: config.routes.profile, component: Profile },
  { path: config.routes.verify, component: Verify },
  { path: config.routes.forgot_password, component: ForgotPassword },
  { path: config.routes.freelancers, component: Freelancers },
  { path: '/freelancer/:id', component: FreelancerDetail },
  { path: config.routes.messages, component: Messages },
];

const freelancerRoutes = [
//   { path: '/freelancer/dashboard', component: FreelancerDashboard },
//   { path: '/freelancer/my-jobs', component: MyJobs },
  { path: config.routes.favorite_jobs, component: FavoriteJobs },
  { path: config.routes.manage_freelancer, component: FreelancerProfileManager },
];

const clientRoutes = [
  { path: config.routes.manage_jobs, component: ClientJobManagement },
  
];

// 4. Routes dành cho Admin (Mặc định dùng DefaultLayout có Sidebar)
const adminRoutes = [
//   { path: '/admin/dashboard', component: AdminDashboard },
//   { path: '/admin/users', component: UserManage },
];

export { publishRoutes, freelancerRoutes, clientRoutes, adminRoutes };