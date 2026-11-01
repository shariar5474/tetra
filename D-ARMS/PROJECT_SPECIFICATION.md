# D-ARMS – Digital Advanced Result Management System
## Project Specification v1.0

### Build Method
- **Primary**: PowerShell + Excel COM Automation (Excel 16.0 Desktop)
- **VBA Injection**: Direct COM-based VBA module insertion
- **Validation**: COM-based workbook reopening and testing

### Sheet Names (Exact)
01. HOME_DASHBOARD
02. SCHOOL_PROFILE
03. SYSTEM_SETTINGS
04. ACADEMIC_SESSION
05. CLASS_SETUP
06. SECTION_SETUP
07. GROUP_SETUP
08. SUBJECT_SETUP
09. GRADE_CONFIG
10. STUDENT_ADMISSION
11. STUDENT_DATABASE
12. STUDENT_HISTORY
13. STUDENT_SEARCH
14. STUDENT_TRANSFER
15. EXAM_SETUP
16. EXAM_SUBJECT_SETUP
17. MARKS_ENTRY
18. MARKS_DATABASE
19. RESULT_PROCESSING
20. MERIT_LIST
21. INDIVIDUAL_MARKSHEET
22. TABULATION_SHEET
23. PROGRESS_REPORT
24. RESULT_ARCHIVE
25. PROMOTION_CENTER
26. ATTENDANCE
27. REPORT_CENTER
28. AUDIT_LOG
29. BACKUP_CENTER
30. HELP_AND_GUIDE

### Table Names
- tblSchoolProfile
- tblSystemSettings
- tblAcademicSession
- tblClassSetup
- tblSectionSetup
- tblGroupSetup
- tblSubjectSetup
- tblGradeConfig
- tblStudentAdmission (input form area)
- tblStudentDatabase
- tblStudentHistory
- tblStudentTransfer
- tblExamSetup
- tblExamSubjectSetup
- tblMarksEntry (input form area)
- tblMarksDatabase
- tblResultProcessing
- tblMeritList
- tblResultArchive
- tblPromotionCenter
- tblAttendance
- tblAuditLog

### Color Scheme
- Dark Navy: #101C35 (RGB: 16, 28, 53)
- Electric Blue: #2677E8 (RGB: 38, 119, 232)
- Light Blue: #EAF3FF (RGB: 234, 243, 255)
- White: #FFFFFF (RGB: 255, 255, 255)
- Success Green: #16A36A (RGB: 22, 163, 106)
- Warning Orange: #F59E0B (RGB: 245, 158, 11)
- Error Red: #DC3545 (RGB: 220, 53, 69)

### VBA Modules
- modMain, modDashboard, modStudent, modStudentID, modAdmission
- modClass, modSection, modSubject, modSession, modExam
- modMarks, modMarksValidation, modResult, modGrading, modGPA
- modMerit, modMarksheet, modTabulation, modPromotion
- modAttendance, modPDF, modBackup, modSecurity, modAuditLog
- modSearch, modNavigation, modUtilities

### UserForms
- frmMainMenu, frmStudentAdmission, frmStudentSearch
- frmClassSetup, frmSubjectSetup, frmExamSetup
- frmMarksEntry, frmResultProcessing, frmPromotion
- frmSettings, frmBackup

### Student ID Format
- STU-YYYY-NNNNN (e.g., STU-2026-00001)
- Counter stored in SYSTEM_SETTINGS sheet

### Grading Schemes
Primary: 90-100=A+(5), 80-89=A(4), 70-79=A-(3.5), 60-69=B(3), 50-59=C(2), 40-49=D(1), 0-39=F(0)
SSC/HSC: 80-100=A+(5), 70-79=A(4), 60-69=A-(3.5), 50-59=B(3), 40-49=C(2), 33-39=D(1), 0-32=F(0)

### Output Files
- D-ARMS\D-ARMS_Professional.xlsm
- D-ARMS\D-ARMS_Online_Compatible.xlsx
- D-ARMS\D-ARMS_VBA_Source\*.bas, *.frm
- D-ARMS\D-ARMS_Test_Report.xlsx
- D-ARMS\D-ARMS_Backup\
- D-ARMS\PROJECT_SPECIFICATION.md
- D-ARMS\README.md
