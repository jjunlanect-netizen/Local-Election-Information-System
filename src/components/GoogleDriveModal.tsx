import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  X,
  Upload,
  FileSpreadsheet,
  FileText,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import {
  DriveFileItem,
  listDriveElectionFiles,
  uploadToDrive,
  deleteDriveFile,
} from '../services/googleDrive';
import { Candidate } from '../types/election';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string | null;
  candidates: Candidate[];
  onConnectDrive: () => void;
  preSelectedCandidate?: Candidate | null;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  accessToken,
  candidates,
  onConnectDrive,
  preSelectedCandidate,
}) => {
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Confirmation dialog state for destructive/mutating operations (Mandatory per Workspace skill)
  const [pendingConfirmAction, setPendingConfirmAction] = useState<{
    type: 'UPLOAD' | 'DELETE';
    title: string;
    description: string;
    payload?: any;
  } | null>(null);

  // Load files from Drive when modal opens with a valid token
  useEffect(() => {
    if (isOpen && accessToken) {
      loadFiles();
    }
  }, [isOpen, accessToken]);

  const loadFiles = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const items = await listDriveElectionFiles(accessToken);
      setFiles(items);
    } catch (err: any) {
      setErrorMessage(err.message || 'ไม่สามารถโหลดรายการไฟล์จาก Google Drive');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Save Full Roster CSV to Drive
  const requestUploadFullRoster = () => {
    setPendingConfirmAction({
      type: 'UPLOAD',
      title: 'ยืนยันการบันทึกรายงานผลการเลือกตั้งลง Google Drive',
      description: `ระบบจะสร้างไฟล์เอกสาร "ECT_Phitsanulok_Election_Results_2568.csv" ขนาดประมาณ ${Math.round(
        candidates.length * 150 / 1024
      )} KB ลงในบัญชี Google Drive ของคุณ บรรจุข้อมูลผู้สมัครทั้งหมด ${candidates.length} รายการ`,
      payload: { mode: 'FULL_ROSTER' },
    });
  };

  // Trigger Save Candidate Dossier to Drive
  const requestUploadCandidateDossier = (cand: Candidate) => {
    setPendingConfirmAction({
      type: 'UPLOAD',
      title: `ยืนยันการบันทึกสำนวนผู้สมัคร "${cand.name}" ลง Google Drive`,
      description: `ระบบจะสร้างไฟล์สรุปประวัติ คดีศาลฎีกา และผลคะแนน "${cand.id}_${cand.name}.txt" ลงใน Google Drive ของคุณ`,
      payload: { mode: 'CANDIDATE', candidate: cand },
    });
  };

  // Trigger Delete confirmation
  const requestDeleteFile = (file: DriveFileItem) => {
    setPendingConfirmAction({
      type: 'DELETE',
      title: `ยืนยันการลบไฟล์ "${file.name}" จาก Google Drive`,
      description: `คุณต้องการลบไฟล์นี้ออกจาก Google Drive หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`,
      payload: { fileId: file.id },
    });
  };

  // Execute confirmed action
  const executeConfirmedAction = async () => {
    if (!pendingConfirmAction || !accessToken) return;
    const action = pendingConfirmAction;
    setPendingConfirmAction(null);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (action.type === 'UPLOAD') {
        if (action.payload.mode === 'FULL_ROSTER') {
          // Generate CSV
          const headers = [
            'หมายเลข',
            'รหัสผู้สมัคร',
            'ชื่อ-นามสกุล',
            'สังกัดกลุ่ม',
            'อปท.',
            'เขตเลือกตั้ง',
            'อำเภอ',
            'คะแนนที่ได้รับ',
            'สัดส่วนร้อยละ',
            'ผลการเลือกตั้ง',
            'สถานะทางกฎหมาย',
          ];
          const rows = candidates.map((c) => [
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
            '\uFEFF' +
            [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

          const fileName = `รายงานผลการเลือกตั้งท้องถิ่น_พิษณุโลก_2568_${Date.now()}.csv`;
          await uploadToDrive(accessToken, fileName, csvContent, 'text/csv');
          setSuccessMessage(`บันทึกไฟล์ "${fileName}" ลงใน Google Drive สำเร็จ!`);
        } else if (action.payload.mode === 'CANDIDATE') {
          const cand: Candidate = action.payload.candidate;
          const dossierText = `
สำนักงานคณะกรรมการการเลือกตั้งประจำจังหวัดพิษณุโลก
บันทึกประวัติและผลการพิจารณาสิทธิสมัครรับเลือกตั้ง
===================================================
รหัสผู้สมัคร: ${cand.id}
ชื่อ-นามสกุล: ${cand.name} (หมายเลข ${cand.candidateNumber})
ตำแหน่งที่สมัคร: ${cand.positionBadge || 'สมาชิกสภาท้องถิ่น'}
องค์กรปกครองส่วนท้องถิ่น: ${cand.localGovName} (${cand.constituency})
อำเภอ: ${cand.district} จังหวัดพิษณุโลก
เลขประจำตัวประชาชน: ${cand.citizenIdFull}
วันรับสมัคร: ${cand.registrationDate}
สังกัด: ${cand.politicalGroup}

ผลคะแนนการเลือกตั้ง:
- คะแนนที่ได้รับ: ${cand.votesReceived.toLocaleString()} คะแนน (${cand.votePercentage}%)
- ผลการเลือกตั้ง: ${cand.electionResultLabel}

สถานะทางกฎหมายและคำพิพากษา:
- สถานะ: ${cand.legalStatus.badgeText} ${cand.legalStatus.subText || ''}
${
  cand.courtCase
    ? `
คดีศาลฎีกา: ${cand.courtCase.caseBlackNo} / ${cand.courtCase.caseRedNo}
ศาล: ${cand.courtCase.courtName}
วันที่อ่านคำพิพากษา: ${cand.courtCase.judgmentDate}
ผู้ร้อง: ${cand.courtCase.petitioner}
ผู้คัดค้าน: ${cand.courtCase.respondent}

สรุปคำวินิจฉัย:
"${cand.courtCase.judgmentSummary.rulingQuote}"
ผลสิทธิ: ${cand.courtCase.judgmentSummary.candidacyStatus}
ผลต่อคะแนน: ${cand.courtCase.judgmentSummary.electionResultEffect}
`
    : 'ไม่มีคดีความในศาลฎีกา คุณสมบัติครบถ้วน'
}

ลงนามรับรองความถูกต้อง
นายสมชาย ปานเจริญ • นิติกรชำนาญการพิเศษ
สำนักงาน กกต. จังหวัดพิษณุโลก
DOC-REF: ${cand.courtCase?.docRef || 'DOC-PLK-68-ELEC-00914'}
`.trim();

          const fileName = `สำนวนคดีและประวัติ_${cand.id}_${cand.name}.txt`;
          await uploadToDrive(accessToken, fileName, dossierText, 'text/plain');
          setSuccessMessage(`บันทึกสำนวนของ ${cand.name} ลงใน Google Drive สำเร็จ!`);
        }
        await loadFiles();
      } else if (action.type === 'DELETE') {
        await deleteDriveFile(accessToken, action.payload.fileId);
        setSuccessMessage('ลบไฟล์ออกจาก Google Drive สำเร็จ');
        await loadFiles();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'การดำเนินการกับ Google Drive ล้มเหลว');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#00163d]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg border border-slate-300 shadow-2xl w-full max-w-2xl my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#0f2b5c] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
              <HardDrive className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold">คลังเอกสารและสำรองข้อมูล Google Drive</h3>
              <p className="text-[11px] text-blue-200">
                ระบบเชื่อมต่อเอกสารการเลือกตั้งท้องถิ่น จังหวัดพิษณุโลก พ.ศ. 2568
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-blue-200 hover:text-white rounded"
            title="ปิดหน้าต่าง"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 text-xs">
          {/* Notifications */}
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 text-rose-800 border border-rose-200 rounded flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {!accessToken ? (
            /* Connection Prompt */
            <div className="p-6 text-center bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <HardDrive className="w-10 h-10 text-blue-600 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  เชื่อมต่อ Google Drive เพื่อสำรองข้อมูล
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  เมื่อเชื่อมต่อแล้ว ระบบสามารถส่งออกตารางผลคะแนน, สำนวนคดีเลือกตั้ง, และบันทึกคำพิพากษาศาลฎีกาไปยังบัญชี Google Drive ของคุณโดยตรง
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onConnectDrive}
                  className="inline-flex items-center space-x-2 bg-white text-slate-800 hover:bg-slate-50 px-4 py-2 rounded-md shadow border border-slate-300 font-semibold text-xs transition"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>ลงชื่อเข้าใช้ด้วย Google เพื่อเปิดใช้ Drive</span>
                </button>
              </div>
            </div>
          ) : (
            /* Active Drive Dashboard */
            <>
              {/* Export Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-1.5 font-bold text-blue-900">
                      <FileSpreadsheet className="w-4 h-4 text-blue-700" />
                      <span>ส่งออกตารางผลคะแนนทั้งจังหวัด</span>
                    </div>
                    <p className="text-[11px] text-blue-800/80 mt-1">
                      สำรองข้อมูลผู้สมัคร {candidates.length} คน พร้อมคะแนนและสถานะทางกฎหมายเป็นไฟล์ CSV
                    </p>
                  </div>
                  <button
                    onClick={requestUploadFullRoster}
                    disabled={isLoading}
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded text-xs flex items-center justify-center space-x-1 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>บันทึกตารางผลคะแนนลง Drive</span>
                  </button>
                </div>

                {preSelectedCandidate ? (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-md flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5 font-bold text-amber-900">
                        <FileText className="w-4 h-4 text-amber-700" />
                        <span>สำรองสำนวนคดี: {preSelectedCandidate.name}</span>
                      </div>
                      <p className="text-[11px] text-amber-800/80 mt-1">
                        บันทึกคำสั่งศาลฎีกาและรายงานการตรวจสอบคุณสมบัติของผู้สมัครเบอร์ {preSelectedCandidate.candidateNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => requestUploadCandidateDossier(preSelectedCandidate)}
                      disabled={isLoading}
                      className="mt-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-1.5 px-3 rounded text-xs flex items-center justify-center space-x-1 shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>บันทึกสำนวนผู้สมัครลง Drive</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                        <FileText className="w-4 h-4 text-slate-600" />
                        <span>บันทึกสำนวนคดีเด่น</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        บันทึกสำนวนคำพิพากษาศาลฎีกา คดีนายชาลี พัฒนไพศาล (ยกคำร้อง)
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const charlie = candidates.find((c) => c.name.includes('ชาลี')) || candidates[0];
                        requestUploadCandidateDossier(charlie);
                      }}
                      disabled={isLoading}
                      className="mt-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-1.5 px-3 rounded text-xs flex items-center justify-center space-x-1 shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>บันทึกสำนวนศาลฎีกาลง Drive</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Files in Drive List */}
              <div className="border border-slate-200 rounded-md overflow-hidden">
                <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-700 flex items-center space-x-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                    <span>ไฟล์การเลือกตั้งที่จัดเก็บบน Google Drive ({files.length})</span>
                  </span>
                  <button
                    onClick={loadFiles}
                    disabled={isLoading}
                    className="p-1 text-slate-500 hover:text-slate-800 rounded"
                    title="รีเฟรชรายการไฟล์"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                  {files.length === 0 ? (
                    <div className="p-6 text-center text-slate-400">
                      ยังไม่มีไฟล์รายงานหรือสำนวนถูกบันทึกบน Google Drive
                    </div>
                  ) : (
                    files.map((file) => (
                      <div
                        key={file.id}
                        className="p-2.5 flex items-center justify-between hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          {file.mimeType.includes('csv') ? (
                            <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-800 truncate" title={file.name}>
                              {file.name}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                              <span>
                                {file.createdTime
                                  ? new Date(file.createdTime).toLocaleDateString('th-TH', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : '-'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0 ml-2">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="เปิดดูใน Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => requestDeleteFile(file)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                            title="ลบไฟล์นี้ออกจาก Google Drive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-semibold transition"
          >
            ปิด
          </button>
        </div>
      </div>

      {/* Mandatory User Confirmation Dialog (Google Workspace Skill Requirement) */}
      {pendingConfirmAction && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-md w-full p-4 space-y-3 animate-in zoom-in-95">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>{pendingConfirmAction.title}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {pendingConfirmAction.description}
            </p>
            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setPendingConfirmAction(null)}
                className="px-3 py-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 text-xs text-slate-700"
              >
                ยกเลิก
              </button>
              <button
                onClick={executeConfirmedAction}
                className={`px-3.5 py-1.5 rounded text-xs font-semibold text-white shadow-xs ${
                  pendingConfirmAction.type === 'DELETE'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-[#00163d] hover:bg-[#0f2b5c]'
                }`}
              >
                {pendingConfirmAction.type === 'DELETE' ? 'ยืนยันการลบไฟล์' : 'ยืนยันและดำเนินการ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
