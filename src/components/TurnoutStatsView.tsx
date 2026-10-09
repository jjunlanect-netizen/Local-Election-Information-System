import React from 'react';
import { DISTRICTS_LIST } from '../data/electionData';
import { Users, CheckCircle, BarChart3, TrendingUp, MapPin } from 'lucide-react';

export const TurnoutStatsView: React.FC = () => {
  const totalEligible = DISTRICTS_LIST.reduce((acc, d) => acc + d.totalVoters, 0);
  const avgTurnout = (
    DISTRICTS_LIST.reduce((acc, d) => acc + d.turnoutPercentage, 0) / DISTRICTS_LIST.length
  ).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Top Turnout Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded border border-slate-200 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium">จำนวนผู้มีสิทธิเลือกตั้งทั้งจังหวัด</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {totalEligible.toLocaleString()} <span className="text-xs font-normal text-slate-500">คน</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">ครอบคลุม 9 อำเภอ 103 อปท.</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium">สัดส่วนผู้มาใช้สิทธิเฉลี่ย</div>
          <div className="text-2xl font-bold font-mono text-blue-700 mt-1">
            {avgTurnout}%
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>สูงกว่าเป้าหมายที่ กกต. กำหนด (70%)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium">อำเภอที่มีผู้มาใช้สิทธิสูงสุด</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            อ.วัดโบสถ์ (77.0%)
          </div>
          <div className="text-[11px] text-slate-500 mt-1">ลำดับ 2: อ.บางกระทุ่ม (76.4%)</div>
        </div>
      </div>

      {/* Turnout Table by District */}
      <div className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase flex items-center space-x-1.5">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>สถิติการมาใช้สิทธิเลือกตั้งท้องถิ่น แยกรายอำเภอ (9 อำเภอ)</span>
          </h3>
          <span className="text-[11px] text-slate-500">การคำนวณคะแนนอย่างไม่เป็นทางการ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 text-[11px]">
                <th className="p-2.5">อำเภอ</th>
                <th className="p-2.5 text-center">จำนวน อปท.</th>
                <th className="p-2.5 text-right">ผู้มีสิทธิเลือกตั้ง</th>
                <th className="p-2.5 min-w-[200px]">ร้อยละผู้มาใช้สิทธิ</th>
                <th className="p-2.5 text-right">ร้อยละ (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DISTRICTS_LIST.map((dist) => (
                <tr key={dist.id} className="hover:bg-slate-50">
                  <td className="p-2.5 font-semibold text-slate-800 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dist.name}</span>
                  </td>
                  <td className="p-2.5 text-center font-mono">{dist.orgCount}</td>
                  <td className="p-2.5 text-right font-mono text-slate-700">
                    {dist.totalVoters.toLocaleString()}
                  </td>
                  <td className="p-2.5">
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${dist.turnoutPercentage}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="p-2.5 text-right font-mono font-bold text-blue-700">
                    {dist.turnoutPercentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
