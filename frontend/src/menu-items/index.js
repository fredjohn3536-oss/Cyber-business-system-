import DashboardOutlined from '@ant-design/icons/DashboardOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import ShopOutlined from '@ant-design/icons/ShopOutlined';
import ShoppingCartOutlined from '@ant-design/icons/ShoppingCartOutlined';
import UnorderedListOutlined from '@ant-design/icons/UnorderedListOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';

const menuItems = {
  items: [
    {
      id: 'group-dashboard',
      title: 'Navigation',
      type: 'group',
      roles: ['super_admin', 'admin', 'manager', 'seller'],
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          url: '/seller-dashboard',
          icon: DashboardOutlined,
          roles: ['seller', 'manager'],
          breadcrumbs: true
        },
        {
          id: 'admin-dashboard',
          title: 'Dashboard',
          type: 'item',
          url: '/admin',
          icon: DashboardOutlined,
          roles: ['super_admin', 'admin'],
          breadcrumbs: true
        },
        {
          id: 'admin',
          title: 'Admin Panel',
          type: 'item',
          url: '/admin',
          icon: SettingOutlined,
          roles: ['super_admin', 'admin'],
          breadcrumbs: true
        }
      ]
    },
    {
      id: 'group-management',
      title: 'Management',
      type: 'group',
      roles: ['super_admin', 'admin', 'manager', 'seller'],
      children: [
        {
          id: 'products',
          title: 'Add Product',
          type: 'item',
          url: '/products',
          icon: ShopOutlined,
          roles: ['super_admin', 'admin', 'manager'],
          breadcrumbs: true
        },
        {
          id: 'sales',
          title: 'Point of Sale',
          type: 'item',
          url: '/sales',
          icon: ShoppingCartOutlined,
          roles: ['super_admin', 'admin', 'manager', 'seller'],
          breadcrumbs: true
        },
        {
          id: 'inventory',
          title: 'Inventory',
          type: 'item',
          url: '/products/list',
          icon: UnorderedListOutlined,
          roles: ['super_admin', 'admin', 'manager', 'seller'],
          breadcrumbs: true
        }
      ]
    },
    {
      id: 'group-authentication',
      title: 'Session',
      type: 'group',
      roles: ['super_admin', 'admin', 'manager', 'seller'],
      children: [
        {
          id: 'logout',
          title: 'Logout',
          type: 'item',
          url: '/logout',
          icon: LogoutOutlined,
          roles: ['super_admin', 'admin', 'manager', 'seller'],
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default menuItems;
