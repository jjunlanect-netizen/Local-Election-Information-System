import React, { useState } from 'react';
import { X, UserPlus, Building2, CheckCircle2 } from 'lucide-react';
import { Candidate, LocalGovCategory } from '../types/election';

interface RegisterCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (candidate: Candidate) => void;
}

export const RegisterCandidateModal: React.FC<RegisterCandidateModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [candidateNumber, setCandidateNumber] = useState('1');
  const [positionBadge, setPositionBadge] = useState('นายกเทศมนตรี');
  const [politicalGroup, setPoliticalGroup] = useState('');
  const [citizenId, setCitizenId] = useState('');
  const [localGovName, setLocalGovName] = useState('เทศบาลนครพิษณุโลก');
  const [localGovType, setLocalGovType] = useState<LocalGovCategory>('CITY_MUNICIPALITY');
  const [district, setDistrict] = useState('อ.เมืองพิษณุโลก');
  const [constituency, setConstituency] = useState('เขตเลือกตั้งรวม (นายก ทน.)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const maskedId = citizenId.length > 5
      ? `${citizenId.slice(0, 1)}-${citizenId.slice(1, 5)}-${citizenId.slice(5, 10)}-xx-x`
      : '3-6599-xxxxx-xx-x';

    const newCand: Candidate = {
      id: `REG-68-01-${Math.floor(1000 + Math.random() * 9000)}`,
      candidateNumber: parseInt(candidateNumber) || 1,
      name,
      positionBadge,
      politicalGroup: politicalGroup || 'ผู้สมัครอิสระ',
      citizenIdMasked: maskedId,
      citizenIdFull: citizenId || '3-6599-00889-12-3',
      registrationDate: '24 ตุลาคม 2568',
      localGovName,
      localGovType,
      localGovTypeLabel: localGovName,
      constituency,
      district,
      votesReceived: 0,
      votePercentage: 0,
      rankNote: 'ผู้สมัครใหม่',
      electionResult: 'PENDING_CERTIFICATION',
      electionResultLabel: 'รอการรับรองผล',
      legalStatus: {
        type: 'QUALIFIED',
        badgeText: 'คุณสมบัติครบถ้วน (ตรวจสอบแล้ว)',
        tone: 'green',
      },
    };

    onSave(newCand);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#00163d]/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-lg border border-slate-300 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
        <div className="bg-[#00163d] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-4 h-4 text-amber-300" />
            <h3 className="text-sm font-bold">ลงทะเบียนผู้สมัครรับเลือกตั้งท้องถิ่นใหม่</h3>
          </div>
          <button onClick={onClose} className="p-1 text-blue-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">หมายเลขประจำตัวผู้สมัคร (เบอร์)</label>
              <input
                type="number"
                value={candidateNumber}
                onChange={(e) => setCandidateNumber(e.target.value)}
                min="1"
                max="99"
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">ตำแหน่งที่สมัคร</label>
              <input
                type="text"
                value={positionBadge}
                onChange={(e) => setPositionBadge(e.target.value)}
                placeholder="เช่น นายกเทศมนตรี, สมาชิก อบต."
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">ชื่อ-นามสกุลผู้สมัคร *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ระบุคำนำหน้าและชื่อ-นามสกุล"
              className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">สังกัดกลุ่มการเมือง / พรรค</label>
              <input
                type="text"
                value={politicalGroup}
                onChange={(e) => setPoliticalGroup(e.target.value)}
                placeholder="เช่น กลุ่มรักษ์เมืองสองแคว"
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">เลขประจำตัวประชาชน (13 หลัก)</label>
              <input
                type="text"
                value={citizenId}
                onChange={(e) => setCitizenId(e.target.value)}
                placeholder="3-65xx-xxxxx-xx-x"
                maxLength={17}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">อำเภอ</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                <option value="อ.เมืองพิษณุโลก">อ.เมืองพิษณุโลก</option>
                <option value="อ.นครไทย">อ.นครไทย</option>
                <option value="อ.ชาติตระการ">อ.ชาติตระการ</option>
                <option value="อ.บางระกำ">อ.บางระกำ</option>
                <option value="อ.บางกระทุ่ม">อ.บางกระทุ่ม</option>
                <option value="อ.พรหมพิราม">อ.พรหมพิราม</option>
                <option value="อ.วัดโบสถ์">อ.วัดโบสถ์</option>
                <option value="อ.วังทอง">อ.วังทอง</option>
                <option value="อ.เนินมะปราง">อ.เนินมะปราง</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">ประเภท อปท.</label>
              <select
                value={localGovType}
                onChange={(e) => setLocalGovType(e.target.value as LocalGovCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                <option value="CITY_MUNICIPALITY">เทศบาลนคร</option>
                <option value="PAO">อบจ. พิษณุโลก</option>
                <option value="TOWN_MUNICIPALITY">เทศบาลเมือง</option>
                <option value="SUBDISTRICT_MUNICIPALITY">เทศบาลตำบล</option>
                <option value="TAO">อบต.</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">ชื่อองค์กรปกครองส่วนท้องถิ่น</label>
              <input
                type="text"
                value={localGovName}
                onChange={(e) => setLocalGovName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">เขตเลือกตั้ง</label>
              <input
                type="text"
                value={constituency}
                onChange={(e) => setConstituency(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#00163d] hover:bg-[#0f2b5c] text-white font-semibold shadow-xs"
            >
              บันทึกข้อมูลผู้สมัคร
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
