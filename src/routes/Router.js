import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import Loadable from '../layouts/full/shared/loadable/Loadable';
import { element } from 'prop-types';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const ModernDash = Loadable(lazy(() => import('../views/dashboard/Modern')));
const EcommerceDash = Loadable(lazy(() => import('../views/dashboard/Ecommerce')));

/* ****Apps***** */
// const Chats = Loadable(lazy(() => import('../views/apps/chat/Chat')));
// const Notes = Loadable(lazy(() => import('../views/apps/notes/Notes')));
const Calendar = Loadable(lazy(() => import('../views/pages/hr-module/calendar/HolidayCalendar')));
// const Email = Loadable(lazy(() => import('../views/apps/email/Email')));
// const Blog = Loadable(lazy(() => import('../views/apps/blog/Blog')));
// const BlogDetail = Loadable(lazy(() => import('../views/apps/blog/BlogPost')));
// const Tickets = Loadable(lazy(() => import('../views/apps/tickets/Tickets')));
// const Contacts = Loadable(lazy(() => import('../views/apps/contacts/Contacts')));
// const Ecommerce = Loadable(lazy(() => import('../views/apps/eCommerce/Ecommerce')));
// const EcommerceDetail = Loadable(lazy(() => import('../views/apps/eCommerce/EcommerceDetail')));
// const EcomProductList = Loadable(lazy(() => import('../views/apps/eCommerce/EcomProductList')));
// const EcomProductCheckout = Loadable(
//   lazy(() => import('../views/apps/eCommerce/EcommerceCheckout')),
// );
const UserProfile = Loadable(lazy(() => import('../views/apps/user-profile/UserProfile')));
// const Followers = Loadable(lazy(() => import('../views/apps/user-profile/Followers')));
// const Friends = Loadable(lazy(() => import('../views/apps/user-profile/Friends')));
// const Gallery = Loadable(lazy(() => import('../views/apps/user-profile/Gallery')));

// // Pages
// const RollbaseCASL = Loadable(lazy(() => import('../views/pages/rollbaseCASL/RollbaseCASL')));
// const Treeview = Loadable(lazy(() => import('../views/pages/treeview/Treeview')));
// const Pricing = Loadable(lazy(() => import('../views/pages/pricing/Pricing')));
// const AccountSetting = Loadable(
//   lazy(() => import('../views/pages/account-setting/AccountSetting')),
// );
const Faq = Loadable(lazy(() => import('../views/pages/faq/Faq')));

/* ****Custom Components**** */
const ModuleFeatures = Loadable(lazy(() => import('./ModuleFeatures')));
const ProtectedRoute = Loadable(lazy(() => import('./ProtectedRoute')));
const Unauthorized = Loadable(lazy(() => import('./Unauthorized')));

// widget
// const WidgetCards = Loadable(lazy(() => import('../views/widgets/cards/WidgetCards')));
// const WidgetBanners = Loadable(lazy(() => import('../views/widgets/banners/WidgetBanners')));
// const WidgetCharts = Loadable(lazy(() => import('../views/widgets/charts/WidgetCharts')));

// // form elements
// const MuiAutoComplete = Loadable(
//   lazy(() => import('../views/forms/form-elements/MuiAutoComplete')),
// );
// const MuiButton = Loadable(lazy(() => import('../views/forms/form-elements/MuiButton')));
// const MuiCheckbox = Loadable(lazy(() => import('../views/forms/form-elements/MuiCheckbox')));
// const MuiRadio = Loadable(lazy(() => import('../views/forms/form-elements/MuiRadio')));
// const MuiSlider = Loadable(lazy(() => import('../views/forms/form-elements/MuiSlider')));
// const MuiDateTime = Loadable(lazy(() => import('../views/forms/form-elements/MuiDateTime')));
// const MuiSwitch = Loadable(lazy(() => import('../views/forms/form-elements/MuiSwitch')));

// // form layout
// const FormLayouts = Loadable(lazy(() => import('../views/forms/FormLayouts')));
// const FormCustom = Loadable(lazy(() => import('../views/forms/FormCustom')));
// const FormWizard = Loadable(lazy(() => import('../views/forms/FormWizard')));
// const FormValidation = Loadable(lazy(() => import('../views/forms/FormValidation')));
// const QuillEditor = Loadable(lazy(() => import('../views/forms/quill-editor/QuillEditor')));
// const FormHorizontal = Loadable(lazy(() => import('../views/forms/FormHorizontal')));
// const FormVertical = Loadable(lazy(() => import('../views/forms/FormVertical')));

// // tables
// const BasicTable = Loadable(lazy(() => import('../views/tables/BasicTable')));
// const CollapsibleTable = Loadable(lazy(() => import('../views/tables/CollapsibleTable')));
// const EnhancedTable = Loadable(lazy(() => import('../views/tables/EnhancedTable')));
// const FixedHeaderTable = Loadable(lazy(() => import('../views/tables/FixedHeaderTable')));
// const PaginationTable = Loadable(lazy(() => import('../views/tables/PaginationTable')));
// const SearchTable = Loadable(lazy(() => import('../views/tables/SearchTable')));

// // chart
// const LineChart = Loadable(lazy(() => import('../views/charts/LineChart')));
// const GredientChart = Loadable(lazy(() => import('../views/charts/GredientChart')));
// const DoughnutChart = Loadable(lazy(() => import('../views/charts/DoughnutChart')));
// const AreaChart = Loadable(lazy(() => import('../views/charts/AreaChart')));
// const ColumnChart = Loadable(lazy(() => import('../views/charts/ColumnChart')));
// const CandlestickChart = Loadable(lazy(() => import('../views/charts/CandlestickChart')));
// const RadialbarChart = Loadable(lazy(() => import('../views/charts/RadialbarChart')));

// // ui
// const MuiAlert = Loadable(lazy(() => import('../views/ui-components/MuiAlert')));
// const MuiAccordion = Loadable(lazy(() => import('../views/ui-components/MuiAccordion')));
// const MuiAvatar = Loadable(lazy(() => import('../views/ui-components/MuiAvatar')));
// const MuiChip = Loadable(lazy(() => import('../views/ui-components/MuiChip')));
// const MuiDialog = Loadable(lazy(() => import('../views/ui-components/MuiDialog')));
// const MuiList = Loadable(lazy(() => import('../views/ui-components/MuiList')));
// const MuiPopover = Loadable(lazy(() => import('../views/ui-components/MuiPopover')));
// const MuiRating = Loadable(lazy(() => import('../views/ui-components/MuiRating')));
// const MuiTabs = Loadable(lazy(() => import('../views/ui-components/MuiTabs')));
// const MuiTooltip = Loadable(lazy(() => import('../views/ui-components/MuiTooltip')));
// const MuiTransferList = Loadable(lazy(() => import('../views/ui-components/MuiTransferList')));
// const MuiTypography = Loadable(lazy(() => import('../views/ui-components/MuiTypography')));

// authentication
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Login2 = Loadable(lazy(() => import('../views/authentication/auth2/Login2')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const Register2 = Loadable(lazy(() => import('../views/authentication/auth2/Register2')));
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/auth1/ForgotPassword')));
const ForgotPassword2 = Loadable(
  lazy(() => import('../views/authentication/auth2/ForgotPassword2')),
);
const TwoSteps = Loadable(lazy(() => import('../views/authentication/auth1/TwoSteps')));
const TwoSteps2 = Loadable(lazy(() => import('../views/authentication/auth2/TwoSteps2')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Maintenance = Loadable(lazy(() => import('../views/authentication/Maintenance')));

// landingpage
const Landingpage = Loadable(lazy(() => import('../views/pages/landingpage/Landingpage')));
const ResetPassword = Loadable(lazy(() => import('../views/authentication/auth1/ResetPassword')));
//Admin module
const AdminModule = Loadable(lazy(() => import('../views/pages/admin-module/AdminModule')));
const FirmManagement = Loadable(
  lazy(() => import('../views/pages/admin-module/firmManagement/FirmManagement')),
);

const Insurance = Loadable(
  lazy(() => import('../views/pages/admin-module/firmManagement/Insurance')),
);

const Driver = Loadable(
  lazy(() => import('../views/pages/admin-module/firmManagement/DriverDetail')),
);

const VehicleDamageDetail = Loadable(
  lazy(() => import('../views/pages/admin-module/firmManagement/VehicleDamage')),
);

const Recovery = Loadable(
  lazy(() => import('../views/pages/admin-module/firmManagement/Recovery')),
);

const Storage = Loadable(lazy(() => import('../views/pages/admin-module/firmManagement/Storage')));
const Repairs = Loadable(lazy(() => import('../views/pages/admin-module/firmManagement/Repairs')));
const Inspection = Loadable(
  lazy(() => import('../views/pages/admin-module/firmManagement/Inspection')),
);

const ClientModule = Loadable(lazy(() => import('../views/pages/client/AdminModule')));
const FirmManagement2 = Loadable(
  lazy(() => import('../views/pages/client/firmManagement/FirmManagement')),
);

const Insurance2 = Loadable(lazy(() => import('../views/pages/client/firmManagement/Insurance')));

const Driver2 = Loadable(lazy(() => import('../views/pages/client/firmManagement/DriverDetail')));

const VehicleDamageDetail2 = Loadable(
  lazy(() => import('../views/pages/client/firmManagement/VehicleDamage')),
);

const Recovery2 = Loadable(lazy(() => import('../views/pages/client/firmManagement/Recovery')));

const Storage2 = Loadable(lazy(() => import('../views/pages/client/firmManagement/Storage')));
const Repairs2 = Loadable(lazy(() => import('../views/pages/client/firmManagement/Repairs')));
const Inspection2 = Loadable(lazy(() => import('../views/pages/client/firmManagement/Inspection')));

const FirmDetails = Loadable(
  lazy(() => import('../views/pages/admin-module/firmManagement/FirmDetails')),
);
const FirmSchedulePicker = Loadable(
  lazy(() => import('../views/pages/admin-module/firmManagement/FirmSchedulePicker')),
);
const FeatureAssignmentTable = Loadable(
  lazy(() => import('../views/pages/admin-module/firmManagement/FeatureAssignmenttable')),
);

const HRModule = Loadable(lazy(() => import('../views/pages/hr-module/HRModule')));
const EnrollEmployee = Loadable(
  lazy(() => import('../views/pages/hr-module/userManagement/EnrollEmployee')),
);
const EmployeesList = Loadable(
  lazy(() => import('../views/pages/hr-module/userManagement/EmployeeManagementTabs')),
);

const DeptManagement = Loadable(
  lazy(() => import('../views/pages/hr-module/deptManagement/DeptManagement')),
);
const DeptList = Loadable(lazy(() => import('../views/pages/hr-module/deptManagement/DeptList')));
const DesignationManagement = Loadable(
  lazy(() => import('../views/pages/hr-module/designationManagement/DesignationManagement')),
);
const DesignationList = Loadable(
  lazy(() => import('../views/pages/hr-module/designationManagement/DesignationsList')),
);
const HolidayManagement = Loadable(
  lazy(() => import('../views/pages/hr-module/holidayManagement/HolidayManagement')),
);
const HolidayList = Loadable(
  lazy(() => import('../views/pages/hr-module/holidayManagement/HolidayList')),
);
const UserRightsManagement = Loadable(
  lazy(() => import('../views/pages/hr-module/userRightsManagement/UserRightsManagement')),
);
const RightsDetails = Loadable(
  lazy(() => import('../views/pages/hr-module/userRightsManagement/RightsDetails')),
);

//Attendance module

const AttendanceModule = Loadable(
  lazy(() => import('../views/pages/attendance-module/AttendanceModule')),
);
const ManualAttendance = Loadable(
  lazy(() => import('../views/pages/attendance-module/manualAttendance/ManualAttendance')),
);
const ManualAttendanceList = Loadable(
  lazy(() => import('../views/pages/attendance-module/manualAttendance/ManualAttendanceList')),
);
const MonthlyAttendanceCalendar = Loadable(
  lazy(() =>
    import('../views/pages/attendance-module/manualAttendance/MonthyAttendance/MonthlyAttendance'),
  ),
);
const StandaloneAttendance = Loadable(
  lazy(() => import('../views/pages/attendance-module/manualAttendance/StandaloneAttendance')),
);

const ReportModule = Loadable(lazy(() => import('../views/pages/report-module/ReportModule')));
const EmployeeReportModule = Loadable(
  lazy(() => import('../views/pages/report-module/EmployeeReport')),
);
const AttendanceReportModule = Loadable(
  lazy(() => import('../views/pages/report-module/AttendanceReport')),
);
const LeaveReportModule = Loadable(lazy(() => import('../views/pages/report-module/LeaveReport')));

const LeaveModule = Loadable(lazy(() => import('../views/pages/leave-module/LeaveModule')));
const LeaveList = Loadable(
  lazy(() => import('../views/pages/leave-module/leaveManagement/LeaveEntitlementTable')),
);
const LeaveCalendar = Loadable(
  lazy(() => import('../views/pages/leave-module/leaveManagement/LeaveCalendar')),
);
const LeaveEntitlementManager = Loadable(
  lazy(() => import('../views/pages/leave-module/leaveManagement/LeaveEntitlementManager')),
);

const OrganizationModule = Loadable(
  lazy(() => import('../views/pages/organization-module//OrganizationModule')),
);

const RotaModule = Loadable(lazy(() => import('../views/pages/rota-module/RotaModule')));
const RotaSchedule = Loadable(lazy(() => import('../views/pages/rota-module/Schedule')));
// import Schedule from '../views/pages/rota-module/Hello/Schedule';
// import Schedule from '../views/pages/rota-module/Schedule';
const TeamManagement = Loadable(lazy(() => import('../views/pages/rota-module/TeamManagement')));
const ShiftManager = Loadable(lazy(() => import('../views/pages/rota-module/ShiftManager')));
const ShiftCloner = Loadable(lazy(() => import('../views/pages/rota-module/ShiftCloner')));

const AddEmployees = Loadable(lazy(() => import('../views/pages/addEmployees/AddEmployees')));
const MultistepForm = Loadable(lazy(() => import('../views/pages/multistep-form/MultistepForm')));

const Router = (isAuthenticated) => [
  {
    path: '/',
    element: isAuthenticated ? <FullLayout /> : <Navigate to="/auth/login" />,
    children: isAuthenticated && [
      { path: '/', element: <Navigate to="/dashboards/modern" /> },
      { path: '/dashboards/modern', exact: true, element: <ModernDash /> },
      { path: '/dashboards/ecommerce', exact: true, element: <EcommerceDash /> },
      // Protected Admin routes
      // { path: '/admin', element: <ProtectedRoute requiredFeature="Admin Module"><ModuleFeatures moduleName='Admin Module' /></ProtectedRoute> },
      {
        path: '/admin',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <AdminModule />
          </ProtectedRoute>
        ),
      },

      {
        path: '/client',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <ClientModule />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: '/admin/addEmployees/:id',
      //   element: (
      //     <ProtectedRoute requiredFeature="Admin Module">
      //       <AddEmployees />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/admin/addSchedule/:id',
      //   element: (
      //     <ProtectedRoute requiredFeature="Admin Module">
      //       <FirmSchedulePicker />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/admin/add-employee-wizard/:id',
      //   element: (
      //     <ProtectedRoute requiredFeature="Admin Module">
      //       <MultistepForm />
      //     </ProtectedRoute>
      //   ),
      // },
      {
        path: '/admin/add-companies',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <FirmManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/insurance',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <Insurance />
          </ProtectedRoute>
        ),
      },

      {
        path: '/admin/driver-detail',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <Driver />
          </ProtectedRoute>
        ),
      },

      {
        path: '/admin/vehicle-damage-detail',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <VehicleDamageDetail />
          </ProtectedRoute>
        ),
      },

      {
        path: '/admin/recovery',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <Recovery />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/storage',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <Storage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/repairs',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <Repairs />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/inspection',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <Inspection />
          </ProtectedRoute>
        ),
      },

      {
        path: '/client/add-companies',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <FirmManagement2 />
          </ProtectedRoute>
        ),
      },
      {
        path: '/client/insurance',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <Insurance2 />
          </ProtectedRoute>
        ),
      },

      {
        path: '/client/driver-detail',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <Driver2 />
          </ProtectedRoute>
        ),
      },

      {
        path: '/client/vehicle-damage-detail',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <VehicleDamageDetail2 />
          </ProtectedRoute>
        ),
      },

      {
        path: '/client/recovery',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <Recovery2 />
          </ProtectedRoute>
        ),
      },
      {
        path: '/client/storage',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <Storage2 />
          </ProtectedRoute>
        ),
      },
      {
        path: '/client/repairs',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <Repairs2 />
          </ProtectedRoute>
        ),
      },
      {
        path: '/client/inspection',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <Inspection2 />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: '/admin/firmDetails',
      //   element: (
      //     <ProtectedRoute requiredFeature="Admin Module">
      //       <FirmDetails />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/admin/featureAssignment',
      //   element: (
      //     <ProtectedRoute requiredFeature="Admin Module">
      //       <FeatureAssignmentTable />
      //     </ProtectedRoute>
      //   ),
      // },
      // //hr module
      // {
      //   path: '/hr',
      //   element: (
      //     <ProtectedRoute requiredFeature="HR Module">
      //       <ModuleFeatures moduleName="HR Module" />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/hr/view-employees',
      //   element: (
      //     <ProtectedRoute requiredFeature="HR Module">
      //       <EmployeesList />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/hr/add-department',
      //   element: (
      //     <ProtectedRoute requiredFeature="HR Module">
      //       <DeptManagement />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/hr/add-designation',
      //   element: (
      //     <ProtectedRoute requiredFeature="HR Module">
      //       <DesignationManagement />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/hr/add-holiday',
      //   element: (
      //     <ProtectedRoute requiredFeature="HR Module">
      //       <HolidayManagement />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/hr/holiday-calendar',
      //   element: (
      //     <ProtectedRoute requiredFeature="HR Module">
      //       <Calendar />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/hr/add-rights',
      //   element: (
      //     <ProtectedRoute requiredFeature="HR Module">
      //       <UserRightsManagement />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/hr/departmentList',
      //   element: (
      //     <ProtectedRoute requiredFeature="HR Module">
      //       <DeptList />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/hr/designationList',
      //   element: (
      //     <ProtectedRoute requiredFeature="HR Module">
      //       <DesignationList />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/hr/holidayList',
      //   element: (
      //     <ProtectedRoute requiredFeature="HR Module">
      //       <HolidayList />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/hr/user-rights',
      //   element: (
      //     <ProtectedRoute requiredFeature="HR Module">
      //       <RightsDetails />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/hr/enrollEmployee',
      //   element: (
      //     <ProtectedRoute requiredFeature="HR Module">
      //       <EnrollEmployee />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/hr/leaveCalendar',
      //   element: (
      //     <ProtectedRoute requiredFeature="HR Module">
      //       <LeaveCalendar />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/hr/leaveManager',
      //   element: (
      //     <ProtectedRoute requiredFeature="HR Module">
      //       <LeaveEntitlementManager />{' '}
      //     </ProtectedRoute>
      //   ),
      // },

      //Attendance module
      // {
      //   path: '/attendance',
      //   element: (
      //     <ProtectedRoute requiredFeature="Attendance Module">
      //       <ModuleFeatures moduleName="Attendance Module" />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/attendance/add-manualAttendance',
      //   element: (
      //     <ProtectedRoute requiredFeature="Attendance Module">
      //       <ManualAttendance />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/attendance/attendanceList',
      //   element: (
      //     <ProtectedRoute requiredFeature="Attendance Module">
      //       <ManualAttendanceList />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/attendance/monthlyAttendance',
      //   element: (
      //     <ProtectedRoute requiredFeature="Attendance Module">
      //       <MonthlyAttendanceCalendar />
      //     </ProtectedRoute>
      //   ),
      // },

      //Rota module
      // {
      //   path: '/rota',
      //   element: (
      //     <ProtectedRoute requiredFeature="Rota Module">
      //       <ModuleFeatures moduleName="Rota Module" />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/rota/schedule',
      //   element: (
      //     <ProtectedRoute requiredFeature="Rota Module">
      //       <RotaSchedule />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/rota/manage',
      //   element: (
      //     <ProtectedRoute requiredFeature="Rota Module">
      //       <TeamManagement />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/rota/manageShift',
      //   element: (
      //     <ProtectedRoute requiredFeature="Rota Module">
      //       <ShiftManager />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/rota/cloneShift',
      //   element: (
      //     <ProtectedRoute requiredFeature="Rota Module">
      //       <ShiftCloner />
      //     </ProtectedRoute>
      //   ),
      // },
      // { path: '/user-profile', element: <UserProfile /> },

      // { path: '/report', element: <ReportModule /> },
      // { path: '/report/employee', element: <EmployeeReportModule /> },
      // { path: '/report/attendance', element: <AttendanceReportModule /> },

      // { path: '/report/leave', element: <LeaveReportModule /> },
      // { path: '/leave', element: <LeaveModule /> },
      // { path: 'leave/leaveManager', element: <LeaveEntitlementManager /> },
      // { path: '/organization', element: <OrganizationModule /> },

      // { path: '/apps/chats', element: <Chats /> },
      // { path: '/apps/notes', element: <Notes /> },
      // { path: '/apps/email', element: <Email /> },
      // { path: '/apps/tickets', element: <Tickets /> },
      // { path: '/apps/contacts', element: <Contacts /> },
      // { path: '/apps/ecommerce/shop', element: <Ecommerce /> },
      // { path: '/apps/blog/posts', element: <Blog /> },
      // { path: '/apps/blog/detail/:id', element: <BlogDetail /> },
      // { path: '/apps/ecommerce/eco-product-list', element: <EcomProductList /> },
      // { path: '/apps/ecommerce/eco-checkout', element: <EcomProductCheckout /> },
      // { path: '/apps/ecommerce/detail/:id', element: <EcommerceDetail /> },
      // { path: '/apps/followers', element: <Followers /> },
      // { path: '/apps/friends', element: <Friends /> },
      // { path: '/apps/gallery', element: <Gallery /> },
      // { path: '/pages/casl', element: <RollbaseCASL /> },
      // { path: '/pages/treeview', element: <Treeview /> },
      // { path: '/pages/pricing', element: <Pricing /> },
      // { path: '/pages/account-settings', element: <AccountSetting /> },
      // { path: '/pages/faq', element: <Faq /> },
      // { path: '/forms/form-elements/autocomplete', element: <MuiAutoComplete /> },
      // { path: '/forms/form-elements/button', element: <MuiButton /> },
      // { path: '/forms/form-elements/checkbox', element: <MuiCheckbox /> },
      // { path: '/forms/form-elements/radio', element: <MuiRadio /> },
      // { path: '/forms/form-elements/slider', element: <MuiSlider /> },
      // { path: '/forms/form-elements/date-time', element: <MuiDateTime /> },
      // { path: '/forms/form-elements/switch', element: <MuiSwitch /> },
      // { path: '/forms/form-elements/switch', element: <MuiSwitch /> },
      // { path: '/forms/quill-editor', element: <QuillEditor /> },
      // { path: '/forms/form-layouts', element: <FormLayouts /> },
      // { path: '/forms/form-horizontal', element: <FormHorizontal /> },
      // { path: '/forms/form-vertical', element: <FormVertical /> },
      // { path: '/forms/form-custom', element: <FormCustom /> },
      // { path: '/forms/form-wizard', element: <FormWizard /> },
      // { path: '/forms/form-validation', element: <FormValidation /> },
      // { path: '/tables/basic', element: <BasicTable /> },
      // { path: '/tables/collapsible', element: <CollapsibleTable /> },
      // { path: '/tables/enhanced', element: <EnhancedTable /> },
      // { path: '/tables/fixed-header', element: <FixedHeaderTable /> },
      // { path: '/tables/pagination', element: <PaginationTable /> },
      // { path: '/tables/search', element: <SearchTable /> },
      // { path: '/charts/line-chart', element: <LineChart /> },
      // { path: '/charts/gredient-chart', element: <GredientChart /> },
      // { path: '/charts/doughnut-pie-chart', element: <DoughnutChart /> },
      // { path: '/charts/area-chart', element: <AreaChart /> },
      // { path: '/charts/column-chart', element: <ColumnChart /> },
      // { path: '/charts/candlestick-chart', element: <CandlestickChart /> },
      // { path: '/charts/radialbar-chart', element: <RadialbarChart /> },
      // { path: '/ui-components/alert', element: <MuiAlert /> },
      // { path: '/ui-components/accordion', element: <MuiAccordion /> },
      // { path: '/ui-components/avatar', element: <MuiAvatar /> },
      // { path: '/ui-components/chip', element: <MuiChip /> },
      // { path: '/ui-components/dialog', element: <MuiDialog /> },
      // { path: '/ui-components/list', element: <MuiList /> },
      // { path: '/ui-components/popover', element: <MuiPopover /> },
      // { path: '/ui-components/rating', element: <MuiRating /> },
      // { path: '/ui-components/tabs', element: <MuiTabs /> },
      // { path: '/ui-components/tooltip', element: <MuiTooltip /> },
      // { path: '/ui-components/transfer-list', element: <MuiTransferList /> },
      // { path: '/ui-components/typography', element: <MuiTypography /> },
      // { path: '/widgets/cards', element: <WidgetCards /> },
      // { path: '/widgets/banners', element: <WidgetBanners /> },
      // { path: '/widgets/charts', element: <WidgetCharts /> },

      { path: '*', element: <Navigate to="/" /> },
    ],
  },
  {
    path: '/',
    element: !isAuthenticated ? <BlankLayout /> : <Navigate to="dashboards/modern" />,
    children: !isAuthenticated && [
      { path: '/attendance/standalone/:id', element: <StandaloneAttendance /> },
      { path: '/auth/404', element: <Error /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/login2', element: <Login2 /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/register2', element: <Register2 /> },
      { path: '/auth/forgot-password', element: <ForgotPassword /> },
      { path: '/auth/forgot-password2', element: <ForgotPassword2 /> },
      { path: '/auth/reset-password/:u/:o', element: <ResetPassword /> },
      { path: '/auth/two-steps', element: <TwoSteps /> },
      { path: '/auth/two-steps2', element: <TwoSteps2 /> },
      { path: '/auth/maintenance', element: <Maintenance /> },
      { path: '/landingpage', element: <Landingpage /> },
      { path: '*', element: <Navigate to="/auth/login" /> },
    ],
  },
];

export default Router;
