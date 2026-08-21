
import config from '../config';

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
    ClientInvitations,
    FreelancerProfileManager,
    FreelancerRoadmaps,
    FreelancerInvitations
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
];

const freelancerRoutes = [
//   { path: '/freelancer/dashboard', component: FreelancerDashboard },
//   { path: '/freelancer/my-jobs', component: MyJobs },
  { path: config.routes.favorite_jobs, component: FavoriteJobs },
  { path: config.routes.manage_freelancer, component: FreelancerProfileManager },
  { path: config.routes.freelancer_roadmaps, component: FreelancerRoadmaps },
  { path: config.routes.freelancer_invitations, component: FreelancerInvitations },
];

const clientRoutes = [
  { path: config.routes.manage_jobs, component: ClientJobManagement },
  { path: config.routes.favorite_freelancers, component: FavoriteFreelancers },
  { path: config.routes.client_invitations, component: ClientInvitations },
];

const messageRoutes = [
  { path: config.routes.messages, component: Messages },
];

// 4. Routes dành cho Admin (Mặc định dùng DefaultLayout có Sidebar)
const adminRoutes = [
//   { path: '/admin/dashboard', component: AdminDashboard },
//   { path: '/admin/users', component: UserManage },
];

export { publishRoutes, messageRoutes, freelancerRoutes, clientRoutes, adminRoutes };