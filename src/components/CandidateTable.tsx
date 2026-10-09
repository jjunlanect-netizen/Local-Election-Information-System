import React from 'react';
import {
  User as UserIcon,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Scale,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Candidate } from '../types/election';

interface CandidateTableProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
  totalCount: number;
}

export const CandidateTable: React.FC<CandidateTableProps> = ({
  candidates,
  onSelectCandidate,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
  totalCount,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));

  const renderResultBadge = (candidate: Candidate) => {
    switch (candidate.electionResult) {
      case 'ELECTED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>ได้รับเลือกตั้ง</span>
          </span>
        );
      case 'NOT_ELECTED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>ไม่ได้รับเลือกตั้ง</span>
          </span>
        );
      case 'PENDING_CERTIFICATION':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>รอการรับรองผล</span>
          </span>
        );
      case 'DISQUALIFIED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>ขาดคุณสมบัติ</span>
          </span>
        );
    }
  };

  const renderLegalStatus = (candidate: Candidate) => {
    const { legalStatus } = candidate;
    switch (legalStatus.tone) {
      case 'gold':
        return (
          <div className="bg-amber-50 border border-amber-200 rounded p-1.5 text-xs text-amber-900 leading-snug">
            <div className="flex items-center space-x-1 font-semibold text-amber-800">
              <Scale className="w-3 h-3 text-amber-700 shrink-0" />
              <span>{legalStatus.badgeText}</span>
            </div>
            {legalStatus.subText && (
              <div className="text-[11px] text-amber-700 font-mono mt-0.5">
                {legalStatus.subText}
              </div>
            )}
          </div>
        );
      case 'amber':
        return (
          <div className="bg-amber-50/80 border border-amber-200 rounded p-1.5 text-xs text-amber-900 leading-snug">
            <div className="flex items-center space-x-1 font-semibold text-amber-800">
              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
              <span>{legalStatus.badgeText}</span>
            </div>
            {legalStatus.subText && (
              <div className="text-[11px] text-amber-700 font-mono mt-0.5">
                {legalStatus.subText}
              </div>
            )}
          </div>
        );
      case 'red':
        return (
          <div className="bg-rose-50 border border-rose-200 rounded p-1.5 text-xs text-rose-900 leading-snug">
            <div className="flex items-center space-x-1 font-semibold text-rose-800">
              <Scale className="w-3 h-3 text-rose-700 shrink-0" />
              <span>{legalStatus.badgeText}</span>
            </div>
            {legalStatus.subText && (
              <div className="text-[11px] text-rose-700 font-mono mt-0.5">
                {legalStatus.subText}
              </div>
            )}
          </div>
        );
      case 'green':
      default:
        return (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded px-2 py-1 text-xs text-emerald-800 inline-block font-medium">
            <span>{legalStatus.badgeText}</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Bar */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
            📋
          </div>
          <h2 className="text-xs font-bold text-slate-800 tracking-wide uppercase">
            บัญชีรายชื่อผู้สมัครรับเลือกตั้งและผลคะแนน
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-500">
          <span>
            แสดง 1 - {candidates.length} จาก{' '}
            <strong className="text-slate-700 font-mono">{totalCount.toLocaleString()}</strong> รายการ
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 py-0.5 rounded font-mono font-medium bg-slate-200 text-slate-800 text-[11px]">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 text-[11px] font-semibold">
              <th className="py-2.5 px-3 text-center w-14">เบอร์</th>
              <th className="py-2.5 px-3 min-w-[240px]">ผู้สมัครรับเลือกตั้ง / สังกัดกลุ่ม</th>
              <th className="py-2.5 px-3 min-w-[190px]">อปท. ที่ลงสมัคร & เขต</th>
              <th className="py-2.5 px-3 w-32">อำเภอ</th>
              <th className="py-2.5 px-3 text-right w-36">คะแนนที่ได้รับ (%)</th>
              <th className="py-2.5 px-3 text-center w-36">ผลการเลือกตั้ง</th>
              <th className="py-2.5 px-3 min-w-[230px]">สถานะทางกฎหมาย / คำพิพากษา</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  ไม่พบข้อมูลผู้สมัครที่ตรงกับเงื่อนไขการค้นหา
                </td>
              </tr>
            ) : (
              candidates.map((cand) => {
                return (
                  <tr
                    key={cand.id}
                    onClick={() => onSelectCandidate(cand)}
                    className="hover:bg-blue-50/50 cursor-pointer transition group"
                  >
                    {/* Ballot Number */}
                    <td className="py-3 px-3 text-center align-top">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold font-mono text-white shadow-xs ${
                          cand.candidateNumber === 1
                            ? 'bg-[#00163d]'
                            : cand.candidateNumber === 2
                            ? 'bg-[#1e3a6d]'
                            : 'bg-rose-700'
                        }`}
                      >
                        {cand.candidateNumber}
                      </span>
                    </td>

                    {/* Candidate Info */}
                    <td className="py-3 px-3 align-top">
                      <div className="flex items-start space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span className="font-bold text-slate-900 group-hover:text-blue-700 transition">
                              {cand.name}
                            </span>
                            {cand.positionBadge && (
                              <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.2 rounded">
                                {cand.positionBadge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {cand.politicalGroup}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            ปชช: {cand.citizenIdMasked}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Local Government & Constituency */}
                    <td className="py-3 px-3 align-top">
                      <div className="font-semibold text-slate-800">{cand.localGovName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {cand.constituency}
                      </div>
                    </td>

                    {/* District */}
                    <td className="py-3 px-3 align-top text-slate-700">
                      <div className="flex items-center space-x-1 text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{cand.district}</span>
                      </div>
                    </td>

                    {/* Votes & Percentage */}
                    <td className="py-3 px-3 align-top text-right">
                      <div className="font-bold font-mono text-slate-900 text-sm">
                        {cand.votesReceived.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {cand.votePercentage > 0 ? (
                          <>
                            <strong className="text-blue-700 font-medium">
                              {cand.votePercentage}%
                            </strong>{' '}
                            {cand.rankNote}
                          </>
                        ) : (
                          <span className="text-rose-600 text-[10px]">{cand.rankNote}</span>
                        )}
                      </div>
                    </td>

                    {/* Election Result */}
                    <td className="py-3 px-3 align-top text-center">
                      {renderResultBadge(cand)}
                    </td>

                    {/* Legal Status & Court Judgment */}
                    <td className="py-3 px-3 align-top">
                      {renderLegalStatus(cand)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer & Detailed Pagination */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <span>แสดงผลต่อหน้า:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 font-medium cursor-pointer"
          >
            <option value={8}>8 แถว</option>
            <option value={15}>15 แถว</option>
            <option value={25}>25 แถว</option>
            <option value={50}>50 แถว</option>
          </select>
          <span className="text-slate-400">|</span>
          <span>รวมทั้งหมด <strong className="font-mono text-slate-800">2,418</strong> คน ใน 103 อปท.</span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 text-xs"
          >
            ก่อนหน้า
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 rounded text-xs font-mono font-medium transition ${
                currentPage === page
                  ? 'bg-[#00163d] text-white shadow-xs'
                  : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              {page}
            </button>
          ))}
          <span className="px-1 text-slate-400">...</span>
          <button
            onClick={() => setCurrentPage(97)}
            className={`w-7 h-7 rounded text-xs font-mono font-medium transition ${
              currentPage === 97
                ? 'bg-[#00163d] text-white shadow-xs'
                : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            97
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 text-xs"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
};
