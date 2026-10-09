import React, { useState } from 'react';
import {
  X,
  Printer,
  Scale,
  FileText,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Download,
  Save,
  Building,
  Vote,
  Calendar,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import { Candidate } from '../types/election';

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  onClose: () => void;
  onSaveToDrive?: (candidate: Candidate, tabName: string) => void;
  onUpdateStatus?: (candidateId: string, newStatus: string) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  onClose,
  onSaveToDrive,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'results' | 'court' | 'expenses'>('court');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  if (!candidate) return null;

  const handleUpdate = () => {
    setIsUpdatingStatus(true);
    setTimeout(() => {
      setIsUpdatingStatus(false);
      setUpdateMessage('อัปเดตสถานะการรับรองผลและบันทึกประวัติสำเร็จ');
      if (onUpdateStatus) {
        onUpdateStatus(candidate.id, 'รับรองผลแล้ว');
      }
      setTimeout(() => setUpdateMessage(null), 3000);
    }, 600);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#00163d]/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg border border-slate-300 shadow-2xl w-full max-w-5xl my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Navy Bar */}
        <div className="bg-[#00163d] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-amber-400 text-[#00163d] flex items-center justify-center font-bold text-xs">
              ⚖️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold tracking-wide">
                  ตรวจสอบประวัติผู้สมัครและผลการพิจารณาสิทธิสมัครรับเลือกตั้ง
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.2 rounded font-mono">
                  บันทึกคดีเลือกตั้ง
                </span>
              </div>
              <div className="text-[11px] text-blue-200 font-mono mt-0.5">
                ทะเบียนผู้สมัคร: <span className="text-white font-semibold">{candidate.id}</span> • องค์กรปกครองส่วนท้องถิ่น: {candidate.localGovName}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrintDossier}
              className="text-xs bg-[#16356e] hover:bg-[#1e448b] text-white px-2.5 py-1 rounded flex items-center space-x-1 border border-blue-400/30 transition"
              title="พิมพ์สำนวนคดีและการตรวจสอบ"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์สำนวน</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-blue-200 hover:text-white hover:bg-blue-900/50 rounded transition"
              title="ปิดหน้าต่าง (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Card Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            {/* Number Box */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-500 font-medium mb-0.5">ผู้สมัครเบอร์</span>
              <div className="w-10 h-10 rounded bg-[#00163d] text-white font-bold font-mono text-xl flex items-center justify-center shadow">
                {candidate.candidateNumber}
              </div>
            </div>

            {/* Candidate Identity */}
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h1 className="text-base font-bold text-slate-900">{candidate.name}</h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>
                    {candidate.electionResult === 'ELECTED'
                      ? 'ได้รับเลือกตั้ง (อันดับ 1)'
                      : candidate.electionResultLabel}
                  </span>
                </span>
                {candidate.positionBadge && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                    {candidate.positionBadge}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 text-xs text-slate-600 mt-1.5 flex-wrap gap-y-1">
                <span>
                  กลุ่มการเมือง: <strong className="text-slate-800">{candidate.politicalGroup}</strong>
                </span>
                <span>
                  เลขบัตรประชาชน:{' '}
                  <strong className="font-mono text-slate-800">{candidate.citizenIdFull}</strong>
                </span>
                <span>
                  วันรับสมัคร:{' '}
                  <strong className="text-slate-800">{candidate.registrationDate}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Overall Votes Stat Box */}
          <div className="bg-white border border-slate-200 rounded p-2.5 px-4 flex items-center space-x-4 shadow-2xs self-start md:self-auto shrink-0">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                คะแนนที่ได้รับทั้งหมด
              </div>
              <div className="text-lg font-bold font-mono text-slate-900">
                {candidate.votesReceived.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-500">คะแนน</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                สัดส่วนต่อผู้มาใช้สิทธิ
              </div>
              <div className="text-lg font-bold font-mono text-blue-700">
                {candidate.votePercentage > 0 ? `${candidate.votePercentage}%` : '0%'}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 border-b border-slate-200 bg-white flex space-x-2 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2.5 px-3 font-medium border-b-2 flex items-center space-x-1.5 transition ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>ประวัติส่วนตัวและคุณสมบัติผู้สมัคร</span>
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className={`py-2.5 px-3 font-medium border-b-2 flex items-center space-x-1.5 transition ${
              activeTab === 'results'
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Vote className="w-3.5 h-3.5" />
            <span>ผลคะแนนและการเลือกตั้งรายเขต/หน่วย</span>
          </button>

          <button
            onClick={() => setActiveTab('court')}
            className={`py-2.5 px-3 font-medium border-b-2 flex items-center space-x-1.5 transition ${
              activeTab === 'court'
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>บันทึกคดีและคำพิพากษาของศาล (คำสั่งเด็ดขาด) 1 คดี</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`py-2.5 px-3 font-medium border-b-2 flex items-center space-x-1.5 transition ${
              activeTab === 'expenses'
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>เอกสารหลักฐานและบัญชีค่าใช้จ่าย</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 bg-white max-h-[55vh] overflow-y-auto text-xs space-y-4">
          {updateMessage && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded flex items-center space-x-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{updateMessage}</span>
            </div>
          )}

          {activeTab === 'court' && (
            <div className="space-y-3">
              {candidate.courtCase ? (
                <>
                  {/* Gold Supreme Court Banner */}
                  <div className="bg-amber-100/70 border border-amber-300 rounded p-2.5 text-amber-950">
                    <div className="flex items-center space-x-2 font-bold text-amber-900">
                      <Scale className="w-4 h-4 text-amber-700" />
                      <span>
                        คำพิพากษาศาลฎีกา คดีเลือกตั้งหมายเลขดำที่ {candidate.courtCase.caseBlackNo} • หมายเลขแดงที่ {candidate.courtCase.caseRedNo}
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-800 mt-1 flex items-center space-x-3 flex-wrap">
                      <span>{candidate.courtCase.courtName}</span>
                      <span>•</span>
                      <span>วันที่อ่านคำพิพากษา: {candidate.courtCase.judgmentDate}</span>
                    </div>
                  </div>

                  {/* Parties Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500">ผู้ร้อง:</div>
                      <div className="text-slate-800 font-medium mt-0.5">
                        {candidate.courtCase.petitioner}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500">ผู้คัดค้าน:</div>
                      <div className="text-slate-800 font-medium mt-0.5">
                        {candidate.courtCase.respondent}
                      </div>
                    </div>
                  </div>

                  {/* Two Column Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Column 1: Charges & Qualifications */}
                    <div className="border border-slate-200 rounded p-3 bg-white space-y-2">
                      <div className="font-bold text-slate-800 flex items-center space-x-1.5 border-b border-slate-100 pb-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />
                        <span>ข้อกล่าวหา / ประเด็นพิจารณาคุณสมบัติ</span>
                      </div>
                      <div className="space-y-2 text-slate-700 leading-relaxed text-[11px]">
                        <div>
                          <strong className="text-slate-900">ประเด็นแห่งคดี:</strong>{' '}
                          {candidate.courtCase.chargesSummary.issue}
                        </div>
                        <div>
                          {candidate.courtCase.chargesSummary.allegation}
                        </div>
                        <div className="text-slate-500 font-mono text-[10px] pt-1">
                          อ้างอิงบันทึกข้อสอบสวนที่: {candidate.courtCase.chargesSummary.investigationRef}
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Court Judgment & Summary */}
                    <div className="border border-slate-200 rounded p-3 bg-white space-y-2">
                      <div className="font-bold text-slate-800 flex items-center space-x-1.5 border-b border-slate-100 pb-1.5">
                        <Scale className="w-3.5 h-3.5 text-emerald-600" />
                        <span>สรุปคำพิพากษาศาลฎีกา / ผลคำวินิจฉัย</span>
                      </div>

                      {/* Quote Box */}
                      <div className="p-2.5 bg-emerald-50/70 border-l-2 border-emerald-600 rounded text-slate-800 text-[11px] leading-relaxed italic">
                        &ldquo;{candidate.courtCase.judgmentSummary.rulingQuote}&rdquo;
                      </div>

                      <div className="space-y-1.5 pt-1 text-[11px]">
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">สถานะสิทธิการสมัคร:</span>
                          <span className="font-bold text-emerald-700">
                            {candidate.courtCase.judgmentSummary.candidacyStatus}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">ผลต่อคะแนนเลือกตั้ง:</span>
                          <span className="font-bold text-blue-700">
                            {candidate.courtCase.judgmentSummary.electionResultEffect}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-slate-500">การประกาศผล กกต. กลาง:</span>
                          <span className="font-bold text-[#00163d]">
                            {candidate.courtCase.judgmentSummary.ecEndorsement}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Box */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col sm:flex-row sm:items-center justify-end gap-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => alert(`เปิดดูไฟล์คำพิพากษาฉบับเต็ม (${candidate.courtCase?.pdfPageCount} หน้า)\nรหัสอ้างอิง: ${candidate.courtCase?.docRef}`)}
                        className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1.5 rounded text-[11px] font-medium flex items-center space-x-1"
                      >
                        <FileText className="w-3 h-3 text-slate-500" />
                        <span>ดูสำเนาคำพิพากษา (PDF {candidate.courtCase.pdfPageCount} หน้า)</span>
                      </button>

                      {onSaveToDrive && (
                        <button
                          onClick={() => onSaveToDrive(candidate, 'คำพิพากษาศาลฎีกา')}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1.5 rounded text-[11px] font-medium flex items-center space-x-1"
                          title="บันทึกสำเนาคำพิพากษาลง Google Drive"
                        >
                          <HardDrive className="w-3 h-3 text-blue-600" />
                          <span>บันทึกลง Drive</span>
                        </button>
                      )}

                      <button
                        onClick={handleUpdate}
                        disabled={isUpdatingStatus}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-[11px] font-semibold shadow-xs flex items-center space-x-1"
                      >
                        <span>{isUpdatingStatus ? 'กำลังอัปเดต...' : 'อัปเดตสถานะรับรองผล'}</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <div className="font-semibold text-slate-800">ไม่มีคดีความหรือคำสั่งเพิกถอนสิทธิจากศาล</div>
                  <div className="text-slate-500 text-[11px]">
                    ผู้สมัครมีคุณสมบัติครบถ้วนตามพระราชบัญญัติการเลือกตั้งสมาชิกสภาท้องถิ่นหรือผู้บริหารท้องถิ่น พ.ศ. 2562
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border border-slate-200 rounded p-3 space-y-2">
                  <h4 className="font-bold text-slate-800 border-b pb-1">ข้อมูลส่วนตัวและคุณสมบัติ</h4>
                  <div className="space-y-1.5 text-[11px] text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">ชื่อ-นามสกุล:</span>
                      <span className="font-semibold">{candidate.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">หมายเลขประจำตัวประชาชน:</span>
                      <span className="font-mono">{candidate.citizenIdFull}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">องค์กรปกครองส่วนท้องถิ่น:</span>
                      <span>{candidate.localGovName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">เขตเลือกตั้ง:</span>
                      <span>{candidate.constituency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ภูมิลำเนา:</span>
                      <span>{candidate.district} จังหวัดพิษณุโลก</span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded p-3 space-y-2">
                  <h4 className="font-bold text-slate-800 border-b pb-1">ผลการตรวจสอบคุณสมบัติ 18 ประการ</h4>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center text-emerald-700 space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>อายุไม่ต่ำกว่าเกณฑ์ในวันเลือกตั้ง (ผ่าน)</span>
                    </div>
                    <div className="flex items-center text-emerald-700 space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>มีชื่ออยู่ในทะเบียนบ้านติดต่อกันไม่น้อยกว่า 1 ปี (ผ่าน)</span>
                    </div>
                    <div className="flex items-center text-emerald-700 space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ไม่เป็นบุคคลล้มละลาย หรือเคยล้มละลายทุจริต (ผ่าน)</span>
                    </div>
                    <div className="flex items-center text-emerald-700 space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ไม่มีลักษณะต้องห้ามการถือหุ้นสื่อสารมวลชน (ผ่าน)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-3">
              <div className="border border-slate-200 rounded p-3">
                <h4 className="font-bold text-slate-800 mb-2 flex items-center justify-between">
                  <span>สถิติผลคะแนนแยกตามหน่วยเลือกตั้งตัวอย่าง</span>
                  <span className="text-xs text-slate-500 font-normal">
                    รวม {candidate.votesReceived.toLocaleString()} คะแนน
                  </span>
                </h4>

                {candidate.pollingStations && candidate.pollingStations.length > 0 ? (
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 border-b">
                        <th className="p-1.5">หน่วยที่</th>
                        <th className="p-1.5">สถานที่ตั้งหน่วยเลือกตั้ง</th>
                        <th className="p-1.5 text-right">ผู้มีสิทธิ</th>
                        <th className="p-1.5 text-right">มาใช้สิทธิ</th>
                        <th className="p-1.5 text-right">ได้คะแนน</th>
                        <th className="p-1.5 text-right">ไม่ประสงค์ฯ</th>
                        <th className="p-1.5 text-right">บัตรเสีย</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {candidate.pollingStations.map((st) => (
                        <tr key={st.stationNo} className="hover:bg-slate-50">
                          <td className="p-1.5 font-mono font-bold">{st.stationNo}</td>
                          <td className="p-1.5">{st.stationName}</td>
                          <td className="p-1.5 text-right font-mono">{st.eligibleVoters}</td>
                          <td className="p-1.5 text-right font-mono">{st.ballotsCast}</td>
                          <td className="p-1.5 text-right font-mono font-bold text-blue-700">
                            {st.candidateVotes}
                          </td>
                          <td className="p-1.5 text-right font-mono text-slate-500">{st.noVotes}</td>
                          <td className="p-1.5 text-right font-mono text-rose-600">{st.invalidBallots}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-4 text-center text-slate-400">
                    ข้อมูลผลคะแนนรายหน่วยเลือกตั้งอยู่ระหว่างการประมวลผลระบบสถิติ
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="space-y-3">
              <div className="border border-slate-200 rounded p-3 space-y-2">
                <div className="flex items-center justify-between border-b pb-1.5">
                  <h4 className="font-bold text-slate-800">บัญชีรายรับ-รายจ่ายในการเลือกตั้ง</h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                    {candidate.campaignExpenses?.status || 'ยื่นบัญชีถูกต้อง'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] py-1">
                  <div className="bg-slate-50 p-2 rounded">
                    <span className="text-slate-500">วงเงินสูงสุดที่กำหนดตามระเบียบ:</span>
                    <div className="text-sm font-bold font-mono text-slate-800">
                      {(candidate.campaignExpenses?.limit || 1500000).toLocaleString()} บาท
                    </div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <span className="text-slate-500">ยอดใช้จ่ายจริงที่ยื่นต่อ กกต.:</span>
                    <div className="text-sm font-bold font-mono text-blue-700">
                      {(candidate.campaignExpenses?.spent || 1248500).toLocaleString()} บาท
                    </div>
                  </div>
                </div>

                {candidate.campaignExpenses?.breakdown && (
                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">
                      รายการค่าใช้จ่ายหลัก
                    </div>
                    {candidate.campaignExpenses.breakdown.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-1 border-b border-slate-50 text-[11px]">
                        <span className="text-slate-700">{item.item}</span>
                        <span className="font-mono font-medium text-slate-900">
                          {item.cost.toLocaleString()} บาท
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="text-[11px] text-slate-500 font-mono">
            รหัสอ้างอิงเอกสารในระบบ: <strong className="text-slate-700">{candidate.courtCase?.docRef || 'DOC-PLK-68-ELEC-00914'}</strong>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 px-3 py-1.5 rounded text-xs transition"
            >
              ปิดหน้าต่าง (Esc)
            </button>
            <button
              onClick={handleUpdate}
              className="bg-[#00163d] hover:bg-[#0f2b5c] text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition"
            >
              <Save className="w-3.5 h-3.5 text-blue-300" />
              <span>บันทึกการตรวจสอบประวัติ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
