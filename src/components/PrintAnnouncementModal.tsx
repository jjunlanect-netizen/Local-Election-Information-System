import React from 'react';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';
import { Candidate } from '../types/election';

interface PrintAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
}

export const PrintAnnouncementModal: React.FC<PrintAnnouncementModalProps> = ({
  isOpen,
  onClose,
  candidates,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#00163d]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Modal Toolbar */}
        <div className="bg-[#0f2b5c] text-white px-4 py-2.5 flex items-center justify-between no-print">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold">ประกาศผลการเลือกตั้งสมาชิกสภาท้องถิ่นและผู้บริหารท้องถิ่น (แบบพิมพ์ ส.ถ./ผ.ถ. 5/8)</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold flex items-center space-x-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์เอกสาร (Print / PDF)</span>
            </button>
            <button onClick={onClose} className="p-1 text-blue-200 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto text-slate-900 font-sans space-y-4 print:p-0">
          <div className="text-center space-y-1">
            <div className="flex justify-center mb-2">
              <img
                src="/logo-ect.svg"
                alt="ตราสัญลักษณ์ กกต."
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://upload.wikimedia.org/wikipedia/commons/c/c7/Office_of_the_Election_Commission_of_Thailand_Emblem.svg';
                }}
              />
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              สำนักงานคณะกรรมการการเลือกตั้งประจำจังหวัดพิษณุโลก
            </div>
            <h1 className="text-lg font-bold text-slate-900">
              ประกาศคณะกรรมการการเลือกตั้งประจำองค์กรปกครองส่วนท้องถิ่น
            </h1>
            <p className="text-xs text-slate-600">
              เรื่อง บัญชีรายชื่อผู้ได้รับการเลือกตั้งเป็นผู้บริหารท้องถิ่นและสมาชิกสภาท้องถิ่น ในจังหวัดพิษณุโลก
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              ประจำปีการเลือกตั้ง พ.ศ. 2568 • ข้อมูล ณ วันที่ 24 ตุลาคม 2568
            </p>
          </div>

          <div className="border-t-2 border-b-2 border-slate-800 py-2 text-xs">
            <p className="leading-relaxed indent-6">
              ตามที่ได้มีการเลือกตั้งผู้บริหารท้องถิ่นและสมาชิกสภาท้องถิ่นในเขตจังหวัดพิษณุโลก คณะกรรมการการเลือกตั้งประจำจังหวัดพิษณุโลก ได้ตรวจสอบคุณสมบัติ ผลคะแนนการเลือกตั้ง และคำวินิจฉัยของศาลฎีกาแผนกคดีเลือกตั้งแล้ว จึงขอประกาศรายชื่อผู้สมัครและผลคะแนนดังต่อไปนี้:
            </p>
          </div>

          <table className="w-full text-left text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold text-[11px]">
                <th className="p-2 border-r border-slate-300 text-center w-12">หมายเลข</th>
                <th className="p-2 border-r border-slate-300">ชื่อ-สกุล ผู้สมัคร</th>
                <th className="p-2 border-r border-slate-300">องค์กรปกครองส่วนท้องถิ่น / เขต</th>
                <th className="p-2 border-r border-slate-300">อำเภอ</th>
                <th className="p-2 border-r border-slate-300 text-right">คะแนนรวม</th>
                <th className="p-2 border-r border-slate-300 text-center">ผลการเลือกตั้ง</th>
                <th className="p-2">สถานะทางกฎหมาย / คำพิพากษาศาล</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[11px]">
              {candidates.map((cand) => (
                <tr key={cand.id}>
                  <td className="p-2 border-r border-slate-300 text-center font-mono font-bold">
                    {cand.candidateNumber}
                  </td>
                  <td className="p-2 border-r border-slate-300 font-semibold">
                    {cand.name}
                    <div className="text-[10px] text-slate-500 font-normal">{cand.politicalGroup}</div>
                  </td>
                  <td className="p-2 border-r border-slate-300">
                    {cand.localGovName}
                    <div className="text-[10px] text-slate-500">{cand.constituency}</div>
                  </td>
                  <td className="p-2 border-r border-slate-300">{cand.district}</td>
                  <td className="p-2 border-r border-slate-300 text-right font-mono font-semibold">
                    {cand.votesReceived.toLocaleString()}
                  </td>
                  <td className="p-2 border-r border-slate-300 text-center">
                    {cand.electionResultLabel}
                  </td>
                  <td className="p-2">
                    {cand.legalStatus.badgeText}
                    {cand.legalStatus.subText && (
                      <div className="text-[10px] text-slate-500">{cand.legalStatus.subText}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 text-center text-xs">
            <div>
              <div className="space-y-1">
                <div>(ลงชื่อ).................................................................</div>
                <div className="font-semibold">(นายสมชาย ปานเจริญ)</div>
                <div className="text-slate-600 text-[11px]">นิติกรชำนาญการพิเศษ หัวหน้ากลุ่มงานสืบสวนสอบสวน</div>
              </div>
            </div>
            <div>
              <div className="space-y-1">
                <div>(ลงชื่อ).................................................................</div>
                <div className="font-semibold">(ผู้อำนวยการการเลือกตั้งประจำจังหวัดพิษณุโลก)</div>
                <div className="text-slate-600 text-[11px]">ประธานคณะกรรมการการเลือกตั้งประจำจังหวัดพิษณุโลก</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
