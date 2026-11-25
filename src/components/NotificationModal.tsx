import React, { useState } from 'react';
import { X, Bell, AlertTriangle, Clock, CheckCircle2, ShieldCheck } from './MenuIcon';
import { getUnclosedCrisisItems } from '../data/crisisManagementData';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'danger' | 'warning' | 'info';
}

/** 消息中心：未闭环危急值通报由危急值管理数据生成，其余两条为固定提醒 */
const buildNotifications = (): NotificationItem[] => [
  ...getUnclosedCrisisItems().map((item) => ({
    id: item.id,
    title: `危急值通报：${item.department} ${item.testItem}`,
    desc: `患者${item.patient.name}（${item.patient.dept}${item.patient.bedNo}）${item.testResult}，当前状态：${item.status}。`,
    time: item.createdAt,
    type: 'danger' as const,
  })),
  {
    id: 'reagent-expiry',
    title: '试剂临期预警：高敏肌钙蛋白I试剂盒',
    desc: '当前批次 20260215 效期剩余 28 天，请及时协调领用或调配。',
    time: '35分钟前',
    type: 'warning' as const,
  },
  {
    id: 'specimen-intercept',
    title: '标本前处理拦截：门诊送检溶血标本',
    desc: '标本条码 202610150014 严重脂血，已触发自动退回重抽申请。',
    time: '1小时前',
    type: 'info' as const,
  },
];

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const [readIds, setReadIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const notifications = buildNotifications();
  const visibleNotifications = notifications.filter((n) => !readIds.includes(n.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-slate-900 text-sm">系统待办与消息提醒 ({visibleNotifications.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {visibleNotifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              全部消息已处理，暂无未读提醒
            </div>
          ) : (
            visibleNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-xl border text-xs space-y-1 transition-all ${
                n.type === 'danger'
                  ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                  : n.type === 'warning'
                  ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                  : 'bg-sky-50/60 border-sky-200 text-sky-950'
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1.5">
                  {n.type === 'danger' && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                  {n.type === 'warning' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                  {n.type === 'info' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />}
                  {n.title}
                </span>
                <span className="text-[10px] opacity-60 font-mono">{n.time}</span>
              </div>
              <p className="text-[11px] opacity-80 leading-relaxed">{n.desc}</p>
            </div>
            ))
          )}
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs">
          <button
            onClick={() => setReadIds(notifications.map((n) => n.id))}
            className="text-slate-500 hover:text-slate-800"
          >
            全部标记为已读
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800"
          >
            知道了
          </button>
        </div>
      </div>
    </div>
  );
};
