import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
  ListItemIcon,
  ListItem,
  List,
  styled,
  ListItemText,
  Chip,
  useTheme,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const NavItem = ({ item, level, onClick, hideMenu }) => {
  const customizer = useSelector((state) => state.customizer);
  const Icon = item.icon;
  const theme = useTheme();
  const { t } = useTranslation();
  const itemIcon =
    level > 1 ? <Icon stroke={1.5} size="1rem" /> : <Icon stroke={1.5} size="1.3rem" />;

  const ListItemStyled = styled(ListItem)(({ theme, active }) => ({
    whiteSpace: 'nowrap',
    marginBottom: '2px',
    padding: '8px 10px',
    borderRadius: `${customizer.borderRadius}px`,
    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
    color: theme.palette.text.secondary,
    paddingLeft: hideMenu ? '10px' : level > 2 ? `${level * 15}px` : '10px',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
    '&.active': {
      color: 'white',
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
      },
    },
  }));

  return (
    <List component="li" disablePadding key={item.id}>
      <ListItemStyled
        button
        component={item.external ? 'a' : NavLink}
        to={!item.external ? item.href : undefined}
        href={item.external ? item.href : undefined}
        disabled={item.disabled}
        target={item.external ? '_blank' : undefined}
        onClick={onClick}
        activeClassName="active" // using activeClassName for styling
      >
        <ListItemIcon
          sx={{
            minWidth: '36px',
            p: '3px 0',
            color: 'inherit',
          }}
        >
          {itemIcon}
        </ListItemIcon>
        <ListItemText>
          {hideMenu ? '' : <>{t(`${item.title}`)}</>}
          <br />
          {item.subtitle ? (
            <Typography variant="caption">{hideMenu ? '' : item.subtitle}</Typography>
          ) : (
            ''
          )}
        </ListItemText>
        {!item.chip || hideMenu ? null : (
          <Chip
            color={item.chipColor}
            variant={item.variant ? item.variant : 'filled'}
            size="small"
            label={item.chip}
          />
        )}
      </ListItemStyled>
    </List>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  hideMenu: PropTypes.any,
  onClick: PropTypes.func,
};

export default NavItem;
