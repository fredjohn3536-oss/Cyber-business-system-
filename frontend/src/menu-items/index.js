import DashboardOutlined from '@ant-design/icons/DashboardOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import ShopOutlined from '@ant-design/icons/ShopOutlined';
import ShoppingCartOutlined from '@ant-design/icons/ShoppingCartOutlined';
import LoginOutlined from '@ant-design/icons/LoginOutlined';
import UserAddOutlined from '@ant-design/icons/UserAddOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';

const menuItems = {
  items: [
    {
      id: 'group-dashboard',
      title: 'Navigation',
      type: 'group',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          url: '/dashboard',
          icon: DashboardOutlined,
          breadcrumbs: true
        },
        {
          id: 'admin',
          title: 'Admin',
          type: 'item',
          url: '/admin',
          icon: SettingOutlined,
          breadcrumbs: true
        }
      ]
    },
    {
      id: 'group-management',
      title: 'Management',
      type: 'group',
      children: [
        {
          id: 'products',
          title: 'Products',
          type: 'item',
          url: '/products',
          icon: ShopOutlined,
          breadcrumbs: true
        },
        {
          id: 'sales',
          title: 'Sales',
          type: 'item',
          url: '/sales',
          icon: ShoppingCartOutlined,
          breadcrumbs: true
        }
      ]
    },
    {
      id: 'group-authentication',
      title: 'Authentication',
      type: 'group',
      children: [
        {
          id: 'login',
          title: 'Login',
          type: 'item',
          url: '/login',
          icon: LoginOutlined,
          breadcrumbs: false
        },
        {
          id: 'register',
          title: 'Register',
          type: 'item',
          url: '/register',
          icon: UserAddOutlined,
          breadcrumbs: false
        },
        {
          id: 'logout',
          title: 'Logout',
          type: 'item',
          url: '/logout',
          icon: LogoutOutlined,
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default menuItems;
