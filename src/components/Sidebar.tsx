import React from 'react';
import {
  Building2,
  Building,
  Home,
  MapPin,
  FileText,
  Scale,
  BookOpen,
  Plus,
  Users,
  Settings,
  Landmark,
} from 'lucide-react';
import { LocalGovCategory } from '../types/election';
import { DISTRICTS_LIST } from '../data/electionData';

interface SidebarProps {
  selectedCategory: LocalGovCategory;
  setSelectedCategory: (cat: LocalGovCategory) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  onOpenRegisterModal: () => void;
  onAddConstituency: () => void;
  onAddCandidate: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedDistrict,
  setSelectedDistrict,
  onOpenRegisterModal,
  onAddConstituency,
  onAddCandidate,
}) => {
  const orgTypes = [
    {
      id: 'PAO' as LocalGovCategory,
      title: 'อบจ. พิษณุโลก (จังหวัด)',
      count: '1 แห่ง',
      icon: Landmark,
    },
    {
      id: 'CITY_MUNICIPALITY' as LocalGovCategory,
      title: 'เทศบาลนครพิษณุโลก',
      count: '4 เขต',
      icon: Building2,
    },
    {
      id: 'TOWN_MUNICIPALITY' as LocalGovCategory,
      title: 'เทศบาลเมือง (อรัญญิก)',
      count: '3 เขต',
      icon: Building,
    },
    {
      id: 'SUBDISTRICT_MUNICIPALITY' as LocalGovCategory,
      title: 'เทศบาลตำบล',
      count: '23 แห่ง',
      icon: Home,
    },
    {
      id: 'TAO' as LocalGovCategory,
      title: 'อบต. (องค์การบริหารส่วนตำบล)',
      count: '77 แห่ง',
      icon: Building,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-screen select-none">
      <div className="p-3 space-y-2 border-b border-slate-100">
        {/* Main Action Button */}
        <button
          onClick={onOpenRegisterModal}
          className="w-full bg-[#00163d] hover:bg-[#0f2b5c] text-white text-xs font-semibold py-2 px-3 rounded flex items-center justify-center space-x-1.5 shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5 text-blue-300" />
          <span>ลงทะเบียน อปท. / ผู้สมัครใหม่</span>
        </button>

        {/* Secondary Action Buttons */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={onAddConstituency}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium py-1.5 px-2 rounded border border-slate-200 flex items-center justify-center space-x-1 truncate transition"
            title="เพิ่มเขตเลือกตั้ง"
          >
            <Plus className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="truncate">+ เพิ่มเขตเลือกตั้ง</span>
          </button>
          <button
            onClick={onAddCandidate}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium py-1.5 px-2 rounded border border-slate-200 flex items-center justify-center space-x-1 truncate transition"
            title="เพิ่มชื่อผู้สมัคร"
          >
            <Users className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="truncate">+ เพิ่มชื่อผู้สมัคร</span>
          </button>
        </div>
      </div>

      {/* Local Government Types */}
      <div className="p-3">
        <h3 className="text-[11px] font-bold text-slate-500 tracking-wider mb-2">
          ประเภทองค์กรปกครองส่วนท้องถิ่น
        </h3>

        <div className="space-y-0.5">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded transition text-left ${
              selectedCategory === 'ALL'
                ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center space-x-2">
              <Landmark className="w-3.5 h-3.5 text-slate-400" />
              <span>ทุกประเภท อปท.</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">103 แห่ง</span>
          </button>

          {orgTypes.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedCategory(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded transition text-left ${
                  isSelected
                    ? 'bg-[#1d4ed8] text-white font-semibold shadow-sm'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center space-x-2 truncate">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.title}</span>
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-blue-800 text-white' : 'text-slate-500 bg-slate-100'
                  }`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => alert('ระบบตั้งค่าเขตเลือกตั้งและหน่วยเลือกตั้ง (ทั้งหมด 684 เขต 1,248 หน่วย)')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded text-slate-600 hover:bg-slate-50 text-left mt-1"
          >
            <span className="flex items-center space-x-2 truncate">
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate text-[11px]">ตั้งค่าเขตเลือกตั้งและหน่วยเลือก</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1 rounded">684 เขต</span>
          </button>
        </div>
      </div>

      {/* 9 Districts Grid */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[11px] font-bold text-slate-500 tracking-wider">
            อำเภอที่ควบคุมงาน (9 อำเภอ)
          </h3>
          <button
            onClick={() => setSelectedDistrict('ทั้งหมด')}
            className="text-[10px] text-blue-600 hover:underline"
          >
            ทั้งหมด
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1">
          {DISTRICTS_LIST.map((dist) => {
            const isDistActive = selectedDistrict === dist.id || selectedDistrict === dist.name;
            return (
              <button
                key={dist.id}
                onClick={() => setSelectedDistrict(dist.id === selectedDistrict ? 'ทั้งหมด' : dist.id)}
                className={`text-[11px] p-1.5 rounded border text-left truncate transition ${
                  isDistActive
                    ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                }`}
                title={dist.name}
              >
                <div className="truncate">{dist.shortName}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Legal & Regulation Resources */}
      <div className="mt-auto p-3 border-t border-slate-100 space-y-1 text-slate-600 text-xs">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          ฐานข้อมูลข้อกฎหมาย
        </div>
        <a
          href="#regulations"
          onClick={(e) => {
            e.preventDefault();
            alert('ระเบียบ กกต. ว่าด้วยการเลือกตั้งสมาชิกสภาท้องถิ่นหรือผู้บริหารท้องถิ่น พ.ศ. 2562 และแก้ไขเพิ่มเติม');
          }}
          className="flex items-center space-x-2 text-[11px] text-slate-600 hover:text-blue-700 py-1"
        >
          <Scale className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">ระเบียบและคำวินิจฉัยศาล</span>
        </a>
        <a
          href="#manual"
          onClick={(e) => {
            e.preventDefault();
            alert('คู่มือการปฏิบัติงาน กกต. ท้องถิ่น สำหรับเจ้าหน้าที่ฝ่ายสืบสวนและไต่สวนการเลือกตั้ง');
          }}
          className="flex items-center space-x-2 text-[11px] text-slate-600 hover:text-blue-700 py-1"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">คู่มือการปฏิบัติงาน กกต. ท้องถิ่น</span>
        </a>

        <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100 flex items-center justify-between font-mono">
          <span>เวอร์ชันระบบ: v4.8.2-TH</span>
          <span className="text-slate-500 font-semibold">SEC-ID 6500</span>
        </div>
      </div>
    </aside>
  );
};
