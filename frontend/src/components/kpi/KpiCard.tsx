'use client';

import React from 'react';
import { Card, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  tooltipText: string;
  accentColor?: string;
  statusBorderColor?: string;
  icon?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  tooltipText,
  accentColor = '#202124',
  statusBorderColor = '#E4E4E4',
  icon,
}) => {
  return (
    <Card
      className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs hover:shadow-xs transition-shadow duration-200"
      style={{ borderTop: `4px solid ${statusBorderColor}` }}
      bodyStyle={{ padding: '16px 18px' }}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[11px] font-bold text-[#5F6368] uppercase tracking-wider truncate">
          {title}
        </span>
        <Tooltip
          title={
            <div className="text-xs space-y-1 p-1">
              <p className="font-bold border-b border-gray-600 pb-1 m-0">Detalhamento Técnico</p>
              <p className="m-0">{tooltipText}</p>
            </div>
          }
          placement="top"
        >
          <InfoCircleOutlined className="text-gray-400 hover:text-black cursor-pointer text-xs shrink-0" />
        </Tooltip>
      </div>

      <div className="flex items-center justify-between mt-1">
        <span
          className="text-2xl font-black tracking-tight font-mono"
          style={{ color: accentColor }}
        >
          {value}
        </span>
        {icon && <div className="text-xl text-gray-400">{icon}</div>}
      </div>

      {subtitle && (
        <p className="text-xs text-[#5F6368] font-medium mt-1 m-0 truncate">
          {subtitle}
        </p>
      )}
    </Card>
  );
};
