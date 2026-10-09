/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StatsCards } from './components/StatsCards';
import { FilterToolbar } from './components/FilterToolbar';
import { CandidateTable } from './components/CandidateTable';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { RegisterCandidateModal } from './components/RegisterCandidateModal';
import { PrintAnnouncementModal } from './components/PrintAnnouncementModal';
import { TurnoutStatsView } from './components/TurnoutStatsView';
import {
  ELECTION_KPI_DATA,
  INITIAL_CANDIDATES,
  DISTRICTS_LIST,
} from './data/electionData';
import {
  Candidate,
  LocalGovCategory,
  ElectionResultType,
  LegalFilterType,
} from './types/election';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
} from './services/firebaseAuth';
import { User } from 'firebase/auth';
import { RefreshCw, RotateCcw } from 'lucide-react';

export default function App() {
  // Navigation & Filtering State
  const [activeTab, setActiveTab] = useState<'overview' | 'qualification' | 'turnout' | 'drive'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<LocalGovCategory>('PAO');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('อ.เมืองพิษณุโลก');
  const [selectedOrgType, setSelectedOrgType] = useState<LocalGovCategory>('CITY_MUNICIPALITY');
  const [selectedResultFilter, setSelectedResultFilter] = useState<ElectionResultType>('ALL');
  const [selectedLegalFilter, setSelectedLegalFilter] = useState<LegalFilterType>('COURT_HEARING');
  const [searchQuery, setSearchQuery] = useState<string>('ชาลี พัฒนไพศาล');

  // Candidate Data & Selection
  const [candidatesList, setCandidatesList] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(INITIAL_CANDIDATES[0]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);

  // Dialogs State
  const [isDriveModalOpen, setIsDriveModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Auth & Drive Token State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [driveAccessToken, setDriveAccessToken] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Initialize Firebase Auth listener on load
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setDriveAccessToken(token);
      },
      () => {
        setGoogleUser(null);
        setDriveAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setDriveAccessToken(res.accessToken);
        setIsDriveModalOpen(true);
      }
    } catch (err: any) {
      console.error('Google Sign in failed:', err);
      alert(`การเชื่อมต่อ Google Drive ล้มเหลว: ${err?.message || 'โปรดลองอีกครั้ง'}`);
    }
  };

  // Handle Google Sign Out
  const handleGoogleSignOut = async () => {
    await logout();
    setGoogleUser(null);
    setDriveAccessToken(null);
  };

  // Filter candidates based on current criteria
  const filteredCandidates = useMemo(() => {
    return candidatesList.filter((cand) => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = cand.name.toLowerCase().includes(q);
        const matchesGroup = cand.politicalGroup.toLowerCase().includes(q);
        const matchesOrg = cand.localGovName.toLowerCase().includes(q);
        const matchesDistrict = cand.district.toLowerCase().includes(q);
        if (!matchesName && !matchesGroup && !matchesOrg && !matchesDistrict) {
          return false;
        }
      }

      // District Filter
      if (selectedDistrict !== 'ทั้งหมด') {
        const cleanSelected = selectedDistrict.replace('อ.', '').trim();
        const cleanCandDist = cand.district.replace('อ.', '').trim();
        if (!cleanCandDist.includes(cleanSelected)) {
          return false;
        }
      }

      // Local Gov Type
      if (selectedOrgType !== 'ALL' && cand.localGovType !== selectedOrgType) {
        return false;
      }

      // Result Filter
      if (selectedResultFilter !== 'ALL' && cand.electionResult !== selectedResultFilter) {
        return false;
      }

      // Legal Status Filter
      if (selectedLegalFilter !== 'ALL') {
        if (selectedLegalFilter === 'COURT_HEARING' && !cand.courtCase && cand.legalStatus.type !== 'SUPREME_COURT_DISMISSED' && cand.legalStatus.type !== 'SUPREME_COURT_REVOKED') {
          return false;
        }
        if (selectedLegalFilter === 'QUALIFIED' && cand.legalStatus.type !== 'QUALIFIED' && cand.legalStatus.type !== 'QUALIFIED_CERTIFIED') {
          return false;
        }
        if (selectedLegalFilter === 'PENDING_INQUIRY' && cand.legalStatus.type !== 'UNDER_INVESTIGATION') {
          return false;
        }
        if (selectedLegalFilter === 'REVOKED' && cand.legalStatus.type !== 'SUPREME_COURT_REVOKED') {
          return false;
        }
      }

      return true;
    });
  }, [
    candidatesList,
    searchQuery,
    selectedDistrict,
    selectedOrgType,
    selectedResultFilter,
    selectedLegalFilter,
  ]);

  // Reset Filters to initial default view
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDistrict('ทั้งหมด');
    setSelectedOrgType('ALL');
    setSelectedResultFilter('ALL');
    setSelectedLegalFilter('ALL');
    setSelectedCategory('ALL');
  };

  // Export to Excel / CSV
  const handleExportExcel = () => {
    const headers = [
      'หมายเลข',
      'รหัสผู้สมัคร',
      'ชื่อ-นามสกุล',
      'สังกัดกลุ่ม',
      'อปท.',
      'เขตเลือกตั้ง',
      'อำเภอ',
      'คะแนนที่ได้รับ',
      'ร้อยละ',
      'ผลการเลือกตั้ง',
      'สถานะทางกฎหมาย',
    ];
    const rows = filteredCandidates.map((c) => [
      c.candidateNumber,
      c.id,
      `"${c.name}"`,
      `"${c.politicalGroup}"`,
      `"${c.localGovName}"`,
      `"${c.constituency}"`,
      `"${c.district}"`,
      c.votesReceived,
      c.votePercentage,
      `"${c.electionResultLabel}"`,
      `"${c.legalStatus.badgeText}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ECT_Phitsanulok_Election_2568_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Drive Export
  const handleExportDrive = () => {
    if (!driveAccessToken) {
      handleGoogleSignIn();
    } else {
      setIsDriveModalOpen(true);
    }
  };

  // Live Refresh simulator
  const handleRefreshLive = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Add Candidate
  const handleAddCandidate = (newCand: Candidate) => {
    setCandidatesList([newCand, ...candidatesList]);
    setSelectedCandidate(newCand);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0b1c30] flex flex-col font-sans">
      {/* Top Government Appbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        googleUser={googleUser}
        hasDriveToken={!!driveAccessToken}
        onLoginClick={handleGoogleSignIn}
        onLogoutClick={handleGoogleSignOut}
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
      />

      <div className="flex flex-1 w-full overflow-hidden">
        {/* Left Administrative Sidebar */}
        <Sidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={(cat) => {
            setSelectedCategory(cat);
            if (cat !== 'ALL') {
              setSelectedOrgType(cat);
            }
          }}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
          onAddConstituency={() => alert('เปิดระบบเพิ่มเขตเลือกตั้งประจำองค์กรปกครองส่วนท้องถิ่น')}
          onAddCandidate={() => setIsRegisterModalOpen(true)}
        />

        {/* Main Work Area */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-4 bg-[#f8fafc]">
          {/* Breadcrumbs & Live Sync Row */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 mb-3 gap-2">
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="hover:text-blue-700 cursor-pointer">หน้าหลัก</span>
              <span>&gt;</span>
              <span className="hover:text-blue-700 cursor-pointer">ข้อมูลการเลือกตั้งท้องถิ่น</span>
              <span>&gt;</span>
              <span className="text-slate-800 font-semibold">
                ภาพรวมผลการนับคะแนนและประวัติคุณสมบัติผู้สมัคร (ปี 2568)
              </span>
            </div>

            <div className="flex items-center space-x-3 text-[11px]">
              <span className="font-mono">
                ข้อมูลล่าสุด ณ วันที่: <strong>24 ตุลาคม 2568 เวลา 16:30 น.</strong>
              </span>
              <button
                onClick={handleRefreshLive}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded transition"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>รีเฟรชข้อมูลแบบสด</span>
              </button>
            </div>
          </div>

          {/* Tab Views */}
          {activeTab === 'turnout' ? (
            <TurnoutStatsView />
          ) : (
            <>
              {/* 5 KPI Stat Cards */}
              <StatsCards kpi={ELECTION_KPI_DATA} />

              {/* Filter Toolbar */}
              <FilterToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
                selectedOrgType={selectedOrgType}
                setSelectedOrgType={setSelectedOrgType}
                selectedResultFilter={selectedResultFilter}
                setSelectedResultFilter={setSelectedResultFilter}
                selectedLegalFilter={selectedLegalFilter}
                setSelectedLegalFilter={setSelectedLegalFilter}
                onResetFilters={handleResetFilters}
                onExportExcel={handleExportExcel}
                onExportDrive={handleExportDrive}
                onPrintAnnouncement={() => setIsPrintModalOpen(true)}
                totalFilteredCount={filteredCandidates.length}
              />

              {/* Candidates Data Table */}
              <CandidateTable
                candidates={filteredCandidates}
                onSelectCandidate={(cand) => {
                  setSelectedCandidate(cand);
                  setIsDetailModalOpen(true);
                }}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                totalCount={filteredCandidates.length}
              />

              {/* Persistent Docket Section below the table matching screenshot */}
              {selectedCandidate && (
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        แฟ้มสำนวนการตรวจสอบและคำพิพากษาศาล (ผู้สมัครที่เลือก)
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsDetailModalOpen(!isDetailModalOpen)}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      {isDetailModalOpen ? 'เปิดในโหมดเต็มจอ / ขยาย' : 'เปิดดูสำนวน'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Official Provincial Election Commission Footer */}
          <footer className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-500 pb-4">
            <p className="font-medium text-slate-600">
              สำนักงานคณะกรรมการการเลือกตั้งประจำจังหวัดพิษณุโลก
            </p>
            <p className="text-[11px] mt-0.5">
              เลขที่ 2 หมู่ 8 ตำบลท่าทอง อำเภอเมืองพิษณุโลก จังหวัดพิษณุโลก 65000 • โทรศัพท์ 0-5533-4235-8
            </p>
          </footer>
        </main>
      </div>

      {/* Candidate Dossier & Court Judgment Modal */}
      {isDetailModalOpen && selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={() => setIsDetailModalOpen(false)}
          onSaveToDrive={(cand) => {
            if (!driveAccessToken) {
              handleGoogleSignIn();
            } else {
              setIsDriveModalOpen(true);
            }
          }}
          onUpdateStatus={(candId, status) => {
            setCandidatesList((prev) =>
              prev.map((c) =>
                c.id === candId
                  ? {
                      ...c,
                      electionResultLabel: status,
                      legalStatus: {
                        ...c.legalStatus,
                        badgeText: 'คุณสมบัติครบถ้วน (ประกาศรับรองแล้ว)',
                        tone: 'green',
                      },
                    }
                  : c
              )
            );
          }}
        />
      )}

      {/* Google Drive Integration Modal */}
      <GoogleDriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        accessToken={driveAccessToken}
        candidates={filteredCandidates}
        onConnectDrive={handleGoogleSignIn}
        preSelectedCandidate={selectedCandidate}
      />

      {/* Register Candidate Modal */}
      <RegisterCandidateModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSave={handleAddCandidate}
      />

      {/* Official Announcement Print Modal */}
      <PrintAnnouncementModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        candidates={filteredCandidates}
      />
    </div>
  );
}
