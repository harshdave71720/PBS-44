import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import xlsx from 'xlsx';

const workbookPath = path.resolve(process.cwd(), 'रजत.xlsx');
const outputPath = path.resolve(process.cwd(), 'src', 'data', 'members.json');

const workbook = xlsx.readFile(workbookPath);
const firstSheetName = workbook.SheetNames[0];
const firstSheet = workbook.Sheets[firstSheetName];

const rows = xlsx.utils.sheet_to_json(firstSheet, { header: 1 });

const members = rows
  .slice(6)
  .map((row) => {
    const membershipNo = row[1];
    const fullName = row[2];
    const address = row[3];
    const village = row[4];
    const mobileValue = row[5];

    return {
      membershipNo,
      fullName,
      address,
      village,
      mobile:
        mobileValue == null
          ? ''
          : String(mobileValue)
              .replace(/[-\s]/g, ''),
    };
  })
  .filter(
    (member) =>
      member.membershipNo !== undefined &&
      String(member.membershipNo).trim() !== '' &&
      member.fullName !== undefined &&
      String(member.fullName).trim() !== '',
  );

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(members, null, 2)}\n`, 'utf8');

console.log(`Successfully wrote ${members.length} members to ${outputPath}`);
