import React from 'react';
import { MapPin, Users, CheckCircle2, AlertTriangle, Building2 } from 'lucide-react';
import { ElectionSummaryKPI } from '../types/election';

interface StatsCardsProps {
  kpi: ElectionSummaryKPI;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ kpi }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
      {/* Card 1: Local Governments */}
      <div className="bg-white rounded border border-slate-200 p-3 shadow-xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium">อปท. ในจังหวัด</span>
          <Building2 className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
            {kpi.totalOrganizations}
          </span>
          <span className="text-xs text-slate-600 font-medium">แห่ง (ครบ {kpi.completedDistricts} อ.)</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1 truncate" title={kpi.orgBreakdown}>
          {kpi.orgBreakdown}
        </div>
      </div>

      {/* Card 2: Constituencies & Polling Units */}
      <div className="bg-white rounded border border-slate-200 p-3 shadow-xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium">เขตเลือกตั้งทั้งหมด</span>
          <MapPin className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
            {kpi.totalConstituencies.toLocaleString()}
          </span>
          <span className="text-xs text-slate-600 font-medium">เขตเลือกตั้ง</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          หน่วยเลือกตั้งรวม <span className="font-mono font-medium">{kpi.totalPollingUnits.toLocaleString()}</span> หน่วย
        </div>
      </div>

      {/* Card 3: Registered Candidates */}
      <div className="bg-white rounded border border-slate-200 p-3 shadow-xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium">ผู้สมัครลงทะเบียน</span>
          <Users className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
            {kpi.totalCandidates.toLocaleString()}
          </span>
          <span className="text-xs text-slate-600 font-medium">ราย</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          นายกฯ: <span className="font-mono">{kpi.mayorCandidates}</span> คน / ส.ถ./ส.อบจ.:{' '}
          <span className="font-mono">{kpi.councilCandidates.toLocaleString()}</span> คน
        </div>
      </div>

      {/* Card 4: Endorsed Winners */}
      <div className="bg-white rounded border border-slate-200 p-3 shadow-xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium">ผู้ได้รับเลือกตั้ง</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold text-emerald-700 font-mono tracking-tight">
            {kpi.endorsedWinners}
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
            รับรองผลแล้ว
          </span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
          <span>อยู่ระหว่างพิจารณา</span>
          <span className="font-mono text-amber-600 font-medium">
            {kpi.pendingCertification} คน ({kpi.pendingPercentage}%)
          </span>
        </div>
      </div>

      {/* Card 5: Complaints & Supreme Court Cases */}
      <div className="bg-white rounded border border-slate-200 p-3 shadow-xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium">เรื่องร้องเรียน / คดีศาล</span>
          <AlertTriangle className="w-4 h-4 text-rose-500" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold text-rose-600 font-mono tracking-tight">
            {kpi.complaintsAndCases}
          </span>
          <span className="text-xs text-rose-600 font-medium">สำนวนคดี</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1 truncate">
          ศาลฎีกาสั่งเพิกถอน <span className="font-mono text-rose-600 font-bold">{kpi.supremeCourtRevocations}</span> ราย (คดีเด็ดขาด)
        </div>
      </div>
    </div>
  );
};
