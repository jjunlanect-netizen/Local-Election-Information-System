export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  size?: string;
  webViewLink?: string;
}

/**
 * List files created by the application in user's Google Drive
 */
export async function listDriveElectionFiles(token: string): Promise<DriveFileItem[]> {
  try {
    const query = encodeURIComponent("trashed = false and (name contains 'election' or name contains 'เลือกตั้ง' or name contains 'ECT' or name contains 'พษ')");
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,createdTime,size,webViewLink)&orderBy=createdTime desc&pageSize=30`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      throw new Error(errBody?.error?.message || `HTTP error ${res.status}`);
    }

    const data = await res.json();
    return data.files || [];
  } catch (err: any) {
    console.error('Failed to list drive files:', err);
    throw err;
  }
}

/**
 * Upload an election document or report to Google Drive
 */
export async function uploadToDrive(
  token: string,
  name: string,
  content: string,
  mimeType: string = 'text/plain'
): Promise<DriveFileItem> {
  try {
    const metadata = {
      name,
      mimeType,
      description: 'ระบบบริหารจัดการข้อมูลการเลือกตั้งท้องถิ่น จังหวัดพิษณุโลก (ECT Phitsanulok)',
    };

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${mimeType}; charset=UTF-8\r\n\r\n` +
      content +
      closeDelimiter;

    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,createdTime,webViewLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: multipartRequestBody,
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error?.message || `Upload failed with HTTP ${res.status}`);
    }

    const file = await res.json();
    return file;
  } catch (err: any) {
    console.error('Failed to upload to Google Drive:', err);
    throw err;
  }
}

/**
 * Delete a file from Google Drive (Requires explicit confirmation before calling)
 */
export async function deleteDriveFile(token: string, fileId: string): Promise<boolean> {
  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok && res.status !== 204) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error?.message || `Delete failed with HTTP ${res.status}`);
    }

    return true;
  } catch (err: any) {
    console.error('Failed to delete file from Google Drive:', err);
    throw err;
  }
}
