// import React from 'react';
// import Menuitems from './MenuItems';
// import { useLocation } from 'react-router';
// import { Box, List, useMediaQuery } from '@mui/material';
// import { useSelector, useDispatch } from 'react-redux';
// import { toggleMobileSidebar } from 'src/store/customizer/CustomizerSlice';
// import NavItem from './NavItem';
// import NavCollapse from './NavCollapse';
// import NavGroup from './NavGroup/NavGroup';

// const SidebarItems = () => {
//   const { pathname } = useLocation();
//   const pathDirect = pathname;
//   const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
//   const customizer = useSelector((state) => state.customizer);
//   const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
//   const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.loginReducer);

//   const filteredMenuItems = Menuitems.filter(item =>
//     item.alwaysShow || user.isCompanyProfileCompleted
//   );

//   return (
//     <Box sx={{ px: 3 }}>
//       <List sx={{ pt: 0 }} className="sidebarNav">
//         {filteredMenuItems.map((item, index) => {

//           // {/********SubHeader**********/}
//           if (item.subheader) {
//             return <NavGroup item={item} hideMenu={hideMenu} key={item.subheader} />;

//             // {/********If Sub Menu**********/}
//             /* eslint no-else-return: "off" */
//           } else if (item.children) {
//             return (
//               <NavCollapse
//                 menu={item}
//                 pathDirect={pathDirect}
//                 hideMenu={hideMenu}
//                 pathWithoutLastPart={pathWithoutLastPart}
//                 level={1}
//                 key={item.id}
//                 onClick={() => dispatch(toggleMobileSidebar())}
//               />
//             );

//             // {/********If Sub No Menu**********/}
//           } else {
//             return (
//               <NavItem
//                 item={item}
//                 key={item.id}
//                 pathDirect={pathDirect}
//                 hideMenu={hideMenu}
//                 onClick={() => dispatch(toggleMobileSidebar())}
//               />
//             );
//           }
//         })}
//       </List>
//     </Box>
//   );
// };
// export default SidebarItems;

import React from 'react';
import { useLocation } from 'react-router';
import { Box, List, useMediaQuery } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileSidebar } from 'src/store/customizer/CustomizerSlice';
import NavItem from './NavItem';

import {
  IconSettings2,
  IconCalendar,
  IconTicket,
  IconUserCircle,
  IconLayoutDashboard,
} from '@tabler/icons';

const iconMap = {
  IconSettings2,
  IconCalendar,
  IconTicket,
  IconUserCircle,
  IconLayoutDashboard,
};
const SidebarItems = () => {
  const { pathname } = useLocation();
  const customizer = useSelector((state) => state.customizer);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.loginReducer);

  const generateMenuItems = () => {
    if (!user.userFeatures || user.userFeatures.length === 0) {
      // If userFeatures is null, only show Admin module
      return [
        {
          id: 'admin',
          title: 'Dashboard Module',
          icon: IconSettings2,
          href: '/dashboards/modern',
        },
        {
          id: 'admin',
          title: 'Vehicle Insurance',
          icon: IconSettings2,
          href: '/admin',
        },
        {
          id: 'client',
          title: 'Client Details',
          icon: IconSettings2,
          href: '/client',
        },
        {
          id: 'admin',
          title: 'TP',
          icon: IconSettings2,
          href: '/dashboards/modern',
        },
        {
          id: 'admin',
          title: 'Accident',
          icon: IconSettings2,
          href: '/dashboards/modern',
        },
        // {
        //   id: 'admin',
        //   title: 'Hire',
        //   icon: IconSettings2,
        //   href: '/dashboards/modern',
        // },
        {
          id: 'admin',
          title: 'PI',
          icon: IconSettings2,
          href: '/dashboards/modern',
        },
        {
          id: 'admin',
          title: 'Notes',
          icon: IconSettings2,
          href: '/dashboards/modern',
        },
        {
          id: 'admin',
          title: 'Reminders',
          icon: IconSettings2,
          href: '/dashboards/modern',
        },
        {
          id: 'admin',
          title: 'Payments',
          icon: IconSettings2,
          href: '/dashboards/modern',
        },
      ];
    }

    // Get unique modules and sort them based on featureGroupId
    const modules = [...new Set(user.userFeatures.map((feature) => feature.featureGroupLabel))];

    // Create menu items based on modules and sort them
    const sortedMenuItems = modules
      .map((module) => {
        const feature = user.userFeatures.find((f) => f.featureGroupLabel === module);
        return {
          id: module,
          title: module,
          icon: iconMap[feature.featureGroupIcon] || IconSettings2,
          href: feature.featureGroupURL,
          featureGroupId: feature.featureGroupId, // Add this for sorting
        };
      })
      .sort((a, b) => a.featureGroupId - b.featureGroupId);

    // Remove featureGroupId from the final output
    return sortedMenuItems.map(({ featureGroupId, ...item }) => item);
  };

  // {
  //   id: 'Dashboard',
  //   title: 'Dashboard',
  //   icon: TablerIcons['IconLayoutDashboard'],
  //   href: '/dashboards/modern',
  //   alwaysShow: true,
  // },
  const menuItems = [...generateMenuItems()];

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {menuItems.map((item) => (
          <NavItem
            item={item}
            key={item.id}
            pathDirect={pathname}
            hideMenu={hideMenu}
            onClick={() => dispatch(toggleMobileSidebar())}
          />
        ))}
      </List>
    </Box>
  );
};

export default SidebarItems;
