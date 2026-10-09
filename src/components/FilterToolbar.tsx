import React from 'react';
import {
  Search,
  RotateCcw,
  Download,
  Printer,
  HardDrive,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { LocalGovCategory, ElectionResultType, LegalFilterType } from '../types/election';

interface FilterToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (val: string) => void;
  selectedOrgType: LocalGovCategory;
  setSelectedOrgType: (val: LocalGovCategory) => void;
  selectedResultFilter: ElectionResultType;
  setSelectedResultFilter: (val: ElectionResultType) => void;
  selectedLegalFilter: LegalFilterType;
  setSelectedLegalFilter: (val: LegalFilterType) => void;
  onResetFilters: () => void;
  onExportExcel: () => void;
  onExportDrive: () => void;
  onPrintAnnouncement: () => void;
  totalFilteredCount: number;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedDistrict,
  setSelectedDistrict,
  selectedOrgType,
  setSelectedOrgType,
  selectedResultFilter,
  setSelectedResultFilter,
  selectedLegalFilter,
  setSelectedLegalFilter,
  onResetFilters,
  onExportExcel,
  onExportDrive,
  onPrintAnnouncement,
  totalFilteredCount,
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedDistrict !== 'ทั้งหมด' ||
    selectedOrgType !== 'ALL' ||
    selectedResultFilter !== 'ALL' ||
    selectedLegalFilter !== 'ALL';

  return (
    <div className="bg-white rounded border border-slate-200 p-3 shadow-xs mb-3 space-y-3">
      {/* Top Action Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อผู้สมัคร, สังกัดกลุ่ม, หรือ อปท...."
            className="w-full text-xs pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Buttons Group */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={onResetFilters}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded border border-slate-200 flex items-center space-x-1 transition"
            title="ล้างค่าตัวกรองทั้งหมด"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>ล้างตัวกรอง</span>
          </button>

          <button
            onClick={onExportExcel}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded border border-slate-200 flex items-center space-x-1 transition"
            title="ส่งออกผลคะแนนและรายชื่อเป็นไฟล์ Excel (.xlsx / .csv)"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>ส่งออก Excel (.xlsx)</span>
          </button>

          <button
            onClick={onExportDrive}
            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1.5 rounded border border-blue-200 flex items-center space-x-1.5 transition font-medium"
            title="ส่งออกและสำรองข้อมูลไปยัง Google Drive ของคุณ"
          >
            <HardDrive className="w-3.5 h-3.5 text-blue-600" />
            <span>สำรองข้อมูลลง Drive</span>
          </button>

          <button
            onClick={onPrintAnnouncement}
            className="text-xs bg-[#00163d] hover:bg-[#0f2b5c] text-white px-3 py-1.5 rounded flex items-center space-x-1.5 shadow-sm transition font-medium"
            title="พิมพ์ประกาศบัญชีรายชื่อทางการ (PDF)"
          >
            <Printer className="w-3.5 h-3.5 text-blue-300" />
            <span>พิมพ์ประกาศบัญชีรายชื่อ (PDF)</span>
          </button>
        </div>
      </div>

      {/* Dropdown Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 border-t border-slate-100 text-xs">
        {/* District Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            อำเภอ (9 อำเภอ):
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
          >
            <option value="ทั้งหมด">อำเภอทั้งหมด (9 อำเภอ)</option>
            <option value="อ.เมืองพิษณุโลก">อำเภอเมืองพิษณุโลก</option>
            <option value="อ.นครไทย">อำเภอนครไทย</option>
            <option value="อ.ชาติตระการ">อำเภอชาติตระการ</option>
            <option value="อ.บางระกำ">อำเภอบางระกำ</option>
            <option value="อ.บางกระทุ่ม">อำเภอบางกระทุ่ม</option>
            <option value="อ.พรหมพิราม">อำเภอพรหมพิราม</option>
            <option value="อ.วัดโบสถ์">อำเภอวัดโบสถ์</option>
            <option value="อ.วังทอง">อำเภอวังทอง</option>
            <option value="อ.เนินมะปราง">อำเภอเนินมะปราง</option>
          </select>
        </div>

        {/* Local Gov Type Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            ประเภท อปท.:
          </label>
          <select
            value={selectedOrgType}
            onChange={(e) => setSelectedOrgType(e.target.value as LocalGovCategory)}
            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
          >
            <option value="ALL">ประเภท อปท. ทั้งหมด</option>
            <option value="PAO">อบจ. พิษณุโลก</option>
            <option value="CITY_MUNICIPALITY">เทศบาลนครพิษณุโลก</option>
            <option value="TOWN_MUNICIPALITY">เทศบาลเมือง (อรัญญิก)</option>
            <option value="SUBDISTRICT_MUNICIPALITY">เทศบาลตำบล</option>
            <option value="TAO">อบต. (องค์การบริหารส่วนตำบล)</option>
          </select>
        </div>

        {/* Election Result Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            ผลการเลือกตั้ง:
          </label>
          <select
            value={selectedResultFilter}
            onChange={(e) => setSelectedResultFilter(e.target.value as ElectionResultType)}
            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
          >
            <option value="ALL">ผลการเลือกตั้งทั้งหมด</option>
            <option value="ELECTED">ได้รับเลือกตั้ง</option>
            <option value="NOT_ELECTED">ไม่ได้รับเลือกตั้ง</option>
            <option value="PENDING_CERTIFICATION">รอการรับรองผล</option>
            <option value="DISQUALIFIED">ขาดคุณสมบัติ / เพิกถอน</option>
          </select>
        </div>

        {/* Legal Status Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            สถานะทางกฎหมาย / คำพิพากษา:
          </label>
          <select
            value={selectedLegalFilter}
            onChange={(e) => setSelectedLegalFilter(e.target.value as LegalFilterType)}
            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
          >
            <option value="ALL">สถานะทางกฎหมายทั้งหมด</option>
            <option value="COURT_HEARING">มีคดีไต่สวน / คำพิพากษาศาลฎีกา</option>
            <option value="QUALIFIED">คุณสมบัติครบถ้วน</option>
            <option value="PENDING_INQUIRY">อยู่ระหว่างไต่สวน ม.120</option>
            <option value="REVOKED">ศาลฎีกาสั่งเพิกถอนสิทธิ</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-500 font-medium">ตัวกรองที่ใช้งานอยู่:</span>

          {selectedDistrict !== 'ทั้งหมด' && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] bg-blue-50 text-blue-800 border border-blue-200">
              <span>อำเภอ: {selectedDistrict.replace('อ.', '')}</span>
              <button
                onClick={() => setSelectedDistrict('ทั้งหมด')}
                className="hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedOrgType !== 'ALL' && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] bg-blue-50 text-blue-800 border border-blue-200">
              <span>
                อปท.:{' '}
                {selectedOrgType === 'CITY_MUNICIPALITY'
                  ? 'เทศบาลนครพิษณุโลก'
                  : selectedOrgType === 'PAO'
                  ? 'อบจ. พิษณุโลก'
                  : selectedOrgType === 'TOWN_MUNICIPALITY'
                  ? 'เทศบาลเมือง'
                  : selectedOrgType === 'SUBDISTRICT_MUNICIPALITY'
                  ? 'เทศบาลตำบล'
                  : 'อบต.'}
              </span>
              <button
                onClick={() => setSelectedOrgType('ALL')}
                className="hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedLegalFilter !== 'ALL' && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] bg-red-50 text-red-800 border border-red-200">
              <span>
                สถานะ:{' '}
                {selectedLegalFilter === 'COURT_HEARING'
                  ? 'มีคดีไต่สวน / คำพิพากษาศาล'
                  : selectedLegalFilter === 'QUALIFIED'
                  ? 'คุณสมบัติครบถ้วน'
                  : selectedLegalFilter === 'PENDING_INQUIRY'
                  ? 'อยู่ระหว่างไต่สวน'
                  : 'เพิกถอนสิทธิ'}
              </span>
              <button
                onClick={() => setSelectedLegalFilter('ALL')}
                className="hover:text-red-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedResultFilter !== 'ALL' && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span>ผล: {selectedResultFilter}</span>
              <button
                onClick={() => setSelectedResultFilter('ALL')}
                className="hover:text-emerald-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {!hasActiveFilters && (
            <span className="text-[11px] text-slate-400 italic">แสดงข้อมูลทุกเงื่อนไข</span>
          )}
        </div>

        <div className="text-[11px] text-slate-600 font-medium">
          พบข้อมูลที่ตรงเงื่อนไข:{' '}
          <span className="font-mono font-bold text-slate-900">{totalFilteredCount}</span> รายการ
        </div>
      </div>
    </div>
  );
};
