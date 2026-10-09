import React, { useState } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  HardDrive,
  CheckCircle2,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  activeTab: 'overview' | 'qualification' | 'turnout' | 'drive';
  setActiveTab: (tab: 'overview' | 'qualification' | 'turnout' | 'drive') => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  googleUser: User | null;
  hasDriveToken: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onOpenDriveModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedDistrict,
  setSelectedDistrict,
  searchQuery,
  setSearchQuery,
  googleUser,
  hasDriveToken,
  onLoginClick,
  onLogoutClick,
  onOpenDriveModal,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-[#0f2b5c] text-white shadow-md select-none border-b border-[#1e3a6d]">
      <div className="w-full px-4 lg:px-6 flex items-center justify-between h-16">
        {/* Left: Provincial & System Emblem & Title */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-11 h-11 flex items-center justify-center shrink-0">
            <img
              src="/logo-ect.svg"
              alt="ตราสัญลักษณ์สำนักงานคณะกรรมการการเลือกตั้ง"
              className="w-11 h-11 object-contain drop-shadow-md select-none"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://upload.wikimedia.org/wikipedia/commons/c/c7/Office_of_the_Election_Commission_of_Thailand_Emblem.svg';
              }}
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-wide text-white leading-tight">
                ระบบบริหารจัดการข้อมูลการเลือกตั้งท้องถิ่น จังหวัดพิษณุโลก
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-blue-200">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ออนไลน์: ระบบฐานข้อมูลกลาง พ.ศ. 2568</span>
              <span className="text-blue-300/70">|</span>
              <span className="font-mono text-emerald-300">SEC-ID 6500</span>
            </div>
          </div>
        </div>

        {/* Center: Main Navigation Tabs */}
        <nav className="hidden xl:flex items-center space-x-1 h-full mx-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 h-full text-xs font-medium border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'overview'
                ? 'border-white text-white font-semibold'
                : 'border-transparent text-blue-200 hover:text-white hover:border-blue-400'
            }`}
          >
            <span>ภาพรวมการเลือกตั้ง</span>
          </button>
          <button
            onClick={() => setActiveTab('qualification')}
            className={`px-3 py-1.5 h-full text-xs font-medium border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'qualification'
                ? 'border-white text-white font-semibold'
                : 'border-transparent text-blue-200 hover:text-white hover:border-blue-400'
            }`}
          >
            <span>ตรวจสอบคุณสมบัติ</span>
          </button>
          <button
            onClick={() => setActiveTab('turnout')}
            className={`px-3 py-1.5 h-full text-xs font-medium border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'turnout'
                ? 'border-white text-white font-semibold'
                : 'border-transparent text-blue-200 hover:text-white hover:border-blue-400'
            }`}
          >
            <span>สถิติผู้มาใช้สิทธิ</span>
          </button>
          <button
            onClick={onOpenDriveModal}
            className={`px-3 py-1.5 h-full text-xs font-medium border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'drive'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-blue-200 hover:text-amber-300'
            }`}
            title="Google Drive คลังเอกสารเลือกตั้ง"
          >
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            <span>คลังเอกสาร Drive</span>
          </button>
        </nav>

        {/* Center-Right: Global Search & District Picker */}
        <div className="flex items-center space-x-3">
          {/* Quick Search */}
          <div className="relative hidden md:block w-56 lg:w-64">
            <Search className="w-4 h-4 text-blue-300 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาเขตเลือกตั้ง, ผู้สมัคร... (⌘K)"
              className="w-full bg-[#16356e] text-xs text-white placeholder-blue-300/80 rounded pl-8 pr-12 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400 border border-[#234b8e]"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] bg-[#0c244d] text-blue-200 px-1.5 py-0.5 rounded border border-blue-400/20 font-mono">
              Ctrl+K
            </kbd>
          </div>

          {/* District Quick Switcher */}
          <div className="relative hidden lg:block">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              aria-label="เลือกอำเภอเพื่อกรองข้อมูล"
              className="bg-[#16356e] text-xs text-white rounded pl-2.5 pr-7 py-1.5 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-400 border border-[#234b8e] cursor-pointer"
            >
              <option value="ทั้งหมด">อำเภอเมืองพิษณุโลก (ทั้งหมด 9 อ.)</option>
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
            <ChevronDown className="w-3.5 h-3.5 text-blue-300 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => alert('ศูนย์ช่วยเหลือ: ระเบียบ กกต. ว่าด้วยการเลือกตั้งท้องถิ่น พ.ศ. 2562 ติดต่อสายด่วน กกต. 1444')}
              className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-800/40 rounded transition"
              title="คู่มือและศูนย์ช่วยเหลือ"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-800/40 rounded transition relative"
                title="การแจ้งเตือนคดีและข้อร้องเรียนใหม่"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-[10px] font-bold text-white rounded-full w-4 h-4 flex items-center justify-center">
                  7
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-md shadow-xl border border-slate-200 z-50 p-3 text-xs">
                  <div className="font-semibold text-slate-900 border-b pb-2 mb-2 flex justify-between items-center">
                    <span>การแจ้งเตือนสำนวนคดีล่าสุด</span>
                    <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded">7 รายการ</span>
                  </div>
                  <ul className="space-y-2 text-slate-600 text-[11px]">
                    <li className="p-1.5 bg-amber-50 rounded border-l-2 border-amber-500">
                      <strong>พ.ต.ท. เกรียงไกร วัฒนพงศ์</strong>: กกต. นัดไต่สวนข้อร้องเรียนสัญญาว่าจะให้ ม.120 วันที่ 15 พ.ย. 68
                    </li>
                    <li className="p-1.5 bg-emerald-50 rounded border-l-2 border-emerald-500">
                      <strong>นายชาลี พัฒนไพศาล</strong>: คำพิพากษาศาลฎีกายกคำร้อง คืนสิทธิสมัครรับเลือกตั้งเรียบร้อย
                    </li>
                    <li className="p-1.5 bg-red-50 rounded border-l-2 border-red-500">
                      <strong>นายอนุสรณ์ มีทรัพย์สิน</strong>: คำพิพากษาศาลฎีกาเพิกถอนสิทธิรับสมัครคดีถือหุ้นสื่อสิ่งพิมพ์
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* User Profile & Google Drive Auth */}
          <div className="relative">
            {googleUser && hasDriveToken ? (
              <div
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 pl-2 cursor-pointer hover:opacity-90"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs ring-2 ring-emerald-400">
                  {googleUser.photoURL ? (
                    <img src={googleUser.photoURL} alt="Avatar" className="w-8 h-8 rounded-full" />
                  ) : (
                    googleUser.email?.charAt(0).toUpperCase() || 'G'
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-medium text-white truncate max-w-[120px]">
                    {googleUser.email?.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-emerald-300 flex items-center space-x-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Drive เชื่อมต่อแล้ว</span>
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-blue-300 hidden sm:block" />
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center space-x-2 bg-white text-slate-800 hover:bg-slate-100 text-xs font-semibold px-2.5 py-1.5 rounded shadow transition border border-slate-200"
                title="เชื่อมต่อ Google Drive เพื่อส่งออกและสำรองข้อมูล"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span className="hidden sm:inline">เชื่อมต่อ Google Drive</span>
              </button>
            )}

            {showUserMenu && googleUser && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-md shadow-2xl border border-slate-200 z-50 p-2 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-semibold text-slate-900 truncate">{googleUser.displayName || 'เจ้าหน้าที่ กกต.'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{googleUser.email}</p>
                  <span className="inline-block mt-1 text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-medium">
                    เจ้าหน้าที่ทะเบียนและสืบสวนสอบสวน
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenDriveModal();
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 rounded flex items-center space-x-2 text-slate-700"
                  >
                    <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                    <span>จัดการไฟล์บน Google Drive</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogoutClick();
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 rounded flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ออกจากระบบ Google</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
