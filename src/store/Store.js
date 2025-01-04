import { configureStore } from '@reduxjs/toolkit';
import CustomizerReducer from './customizer/CustomizerSlice';
import ChatsReducer from './apps/chat/ChatSlice';
import NotesReducer from './apps/notes/NotesSlice';
import EmailReducer from './apps/email/EmailSlice';
import TicketReducer from './apps/tickets/TicketSlice';
import ContactsReducer from './apps/contacts/ContactSlice';
import EcommerceReducer from './apps/eCommerce/EcommerceSlice';
import UserProfileReducer from './apps/userProfile/UserProfileSlice';
import BlogReducer from './apps/blog/BlogSlice';
import LoginReducer from './auth/login/LoginSlice';
import SignupReducer from './auth/signup/SignupSlice';
import FirmReducer from './admin/FirmSlice';
import AdminReducer from './admin/AdminSlice';
import HRReducer from './hr/HRSlice';
import EmployeeReducer from './hr/EmployeeSlice';
import DepartmentReducer from './hr/DepartmentSlice';
import DesignationReducer from './hr/DesignationSlice';
import HolidayReducer from './hr/HolidaySlice';
import UserRightsReducer from './hr/UserRightsSlice';
import AttendanceReducer from './attendance/AttendanceSlice';
import ReportReducer from './report/ReportSlice';
import LeaveReducer from './leave/LeaveSlice';
import ProfileReducer from './auth/userProfile/ProfileSlice';
import CandidatesReducer from './candidates/CandidatesSlice';
import RotaReducer from './rota/RotaSlice.js';
import DashboardReducer from './auth/dashboard/dashboardSlice.js';

export const store = configureStore({
  reducer: {
    customizer: CustomizerReducer,
    chatReducer: ChatsReducer,
    emailReducer: EmailReducer,
    notesReducer: NotesReducer,
    contactsReducer: ContactsReducer,
    ticketReducer: TicketReducer,
    ecommerceReducer: EcommerceReducer,
    userpostsReducer: UserProfileReducer,
    blogReducer: BlogReducer,
    loginReducer: LoginReducer,
    signupReducer: SignupReducer,
    adminReducer: AdminReducer,
    firmReducer: FirmReducer,
    hrReducer: HRReducer,
    employeeReducer: EmployeeReducer,
    departmentReducer: DepartmentReducer,
    designationReducer: DesignationReducer,
    holidayReducer: HolidayReducer,
    userRightsReducer: UserRightsReducer,
    attendanceReducer: AttendanceReducer,
    reportReducer: ReportReducer,
    leaveReducer: LeaveReducer,
    profileReducer: ProfileReducer,
    candidatesReducer: CandidatesReducer,
    rotaReducer: RotaReducer,
    dashboardReducer: DashboardReducer
  },
});

export default store;
