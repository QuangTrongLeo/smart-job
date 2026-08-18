
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
    Messages
} from '~/pages';

const publishRoutes = [
  { path: config.routes.home, component: Home },
  { path: config.routes.jobs, component: Jobs },
  { path: config.routes.job, component: JobDetail },
    { path: config.routes.login, component: Login },
    { path: config.routes.register, component: Register },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.verify, component: Verify },
    { path: config.routes.forgot_password, component: ForgotPassword },
    { path: config.routes.freelancers, component: Freelancers },
    { path: config.routes.freelancer, component: FreelancerDetail },
    { path: config.routes.messages, component: Messages }
//   { path: '/jobs/:id', component: JobDetail }, // JobDetail dùng DefaultLayout
  
//   // Login & Register chỉ muốn có Header/Footer (không Sidebar) -> Dùng SecondLayout
//   { path: '/login', component: Login, layout: SecondLayout },
//   { path: '/register', component: Register, layout: SecondLayout },
];

const freelancerRoutes = [
//   { path: '/freelancer/dashboard', component: FreelancerDashboard },
//   { path: '/freelancer/my-jobs', component: MyJobs },
];

const clientRoutes = [
//   { path: '/client/dashboard', component: ClientDashboard },
//   { path: '/client/post-job', component: PostJob },
];

// 4. Routes dành cho Admin (Mặc định dùng DefaultLayout có Sidebar)
const adminRoutes = [
//   { path: '/admin/dashboard', component: AdminDashboard },
//   { path: '/admin/users', component: UserManage },
];

export { publishRoutes, freelancerRoutes, clientRoutes, adminRoutes };