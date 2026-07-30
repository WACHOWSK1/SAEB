import { ThemeConfig } from 'antd';

export const institutionalTheme: ThemeConfig = {
  token: {
    colorPrimary: '#FFCC00',
    colorLink: '#D9AD00',
    colorLinkHover: '#B38F00',
    colorSuccess: '#388E3C',
    colorWarning: '#F57C00',
    colorError: '#D32F2F',
    colorInfo: '#1976D2',
    colorBgBase: '#FFFFFF',
    colorBgLayout: '#F5F5F5',
    colorTextBase: '#202124',
    colorTextSecondary: '#5F6368',
    colorBorder: '#E4E4E4',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Layout: {
      siderBg: '#202124',
      headerBg: '#202124',
      bodyBg: '#F5F5F5',
    },
    Menu: {
      darkItemBg: '#202124',
      darkItemSelectedBg: '#FFCC00',
      darkItemSelectedColor: '#000000',
      darkItemHoverBg: '#2A2B2E',
      darkItemColor: '#E4E4E4',
      fontSize: 14,
    },
    Button: {
      colorPrimary: '#FFCC00',
      colorPrimaryHover: '#D9AD00',
      colorPrimaryActive: '#B38F00',
      primaryColor: '#000000',
      fontWeight: 600,
    },
    Card: {
      colorBorderSecondary: '#E4E4E4',
      boxShadowSecondary: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    },
    Table: {
      headerBg: '#FAFAFA',
      headerColor: '#202124',
      rowHoverBg: '#F0F9FF',
    },
    Tag: {
      borderRadius: 4,
    }
  },
};
