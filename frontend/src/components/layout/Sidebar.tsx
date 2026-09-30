'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ReadOutlined,
  BulbOutlined,
  GlobalOutlined,
  SettingOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const pathname = usePathname();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link href="/">Visão Geral</Link>,
    },
    {
      key: '/descritores',
      icon: <ReadOutlined />,
      label: <Link href="/descritores">Descritores</Link>,
    },
    {
      key: '/habilidades',
      icon: <BulbOutlined />,
      label: <Link href="/habilidades">Habilidades</Link>,
    },
    {
      key: '/territorial',
      icon: <GlobalOutlined />,
      label: <Link href="/territorial">Análise Territorial</Link>,
    },
    {
      key: '/metodologia',
      icon: <SettingOutlined />,
      label: <Link href="/metodologia">Metodologia e Dados</Link>,
    },
    {
      key: '/sobre',
      icon: <InfoCircleOutlined />,
      label: <Link href="/sobre">Sobre</Link>,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme="dark"
      width={250}
      className="border-r border-[#2A2B2E] shadow-md z-30 shrink-0"
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        backgroundColor: '#202124',
        overflowY: 'auto'
      }}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          {/* Brand Header */}
          <div className="p-4 flex items-center gap-3 border-b border-[#2A2B2E] min-h-[64px]">
            <div className="w-8 h-8 rounded-lg bg-[#FFCC00] flex items-center justify-center font-black text-black text-base shadow-xs shrink-0">
              S
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h2 className="text-white font-extrabold text-sm leading-tight m-0 tracking-wide uppercase">
                  Plataforma SAEB
                </h2>
                <p className="text-[#FFCC00] font-bold text-[10px] m-0 tracking-wider">
                  INTELIGÊNCIA EDUCACIONAL
                </p>
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[pathname || '/']}
            items={menuItems}
            className="mt-3 font-medium border-0"
            style={{ backgroundColor: '#202124' }}
          />
        </div>

        {/* Institutional Logo (UTFPR / PPGFCET) */}
        <div className="px-4 py-3 my-auto flex justify-center items-center">
          <img
            src="/logo-ppgfcet.png"
            alt="UTFPR - PPGFCET"
            className={`${collapsed ? 'w-10' : 'w-44'} h-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-200`}
          />
        </div>

        {/* Scope Footer Box */}
        {!collapsed && (
          <div className="p-4 m-3 rounded-lg bg-[#2A2B2E] border border-[#3A3B3E] text-xs text-gray-300 space-y-1 mb-6">
            <p className="font-bold text-[#FFCC00] m-0">Escopo da Base</p>
            <p className="m-0 text-[11px] text-gray-400">Microdados SAEB 2023</p>
            <p className="m-0 text-[10px] text-gray-500">9º Ano EF • Diagnóstico por Habilidade</p>
          </div>
        )}
      </div>
    </Sider>
  );
};
