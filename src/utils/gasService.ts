import { LeaderboardEntry, UserProfile } from '../types';

export interface GasSyncResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export const GAS_CODE_GS = `/**
 * =========================================================================
 * WebQuest HTML Learning & Quiz - Google Apps Script (Backend)
 * วิชาการสร้างเว็บไซต์ ปวช.1 + Google Sheets Database + LINE Messaging API
 * =========================================================================
 */

// 1. ตั้งค่าพื้นฐานระบบ (CONFIG)
const CONFIG = {
  SPREADSHEET_ID: "126WPtbRHXFcl1b5hSqrtWU8UXTJsV-roDdgRE1lnueU",
  LINE_CHANNEL_ACCESS_TOKEN: "v7/PyBOvoxVV7u4Mc5gmsLvR9iECKenO0ZgwRyPt/j0e0kT4JuyJtYRnjyhi+C4ahmK/SbSjRJdgTeiqAAnoZftItoYhvG2Qqktv5VT/VE9+0Gqu7jBlKW4Nwn1e2qvE3ekbQoTQB2mbWyv97ExmMwdB04t89/1O/w1cDnyilFU=",
  LIFF_ID: "2011321555-jl54Ygfm",
  ADMIN_EMAIL: Session.getActiveUser().getEmail()
};

// 2. ชื่อแท็บของตารางฐานข้อมูลใน Google Sheet
const TABS = {
  USERS: "Users",
  CHECKIN_LOGS: "CheckIn_Logs",
  QUIZ_RESULTS: "Quiz_Results",
  BADGES: "Badges",
  QUESTIONS_STRUCTURE: "Questions_HTML_Structure",
  QUESTIONS_TAGS: "Questions_HTML_Tags",
  CONFIG: "Config"
};

/**
 * ฟังก์ชันสร้างและตั้งค่าตารางฐานข้อมูลทั้งหมดใน Google Sheets อัตโนมัติ
 * (รันฟังก์ชันนี้ครั้งแรกเพียง 1 ครั้งเพื่อสร้างหัวตารางและข้อมูลเริ่มต้น)
 */
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. ตาราง Users (ข้อมูลผู้เรียน)
  let userSheet = ss.getSheetByName(TABS.USERS) || ss.insertSheet(TABS.USERS);
  if (userSheet.getLastRow() === 0) {
    userSheet.appendRow([
      "LineUID", "StudentID", "FullName", "Classroom", "PictureURL",
      "TotalScore", "Level", "StreakDays", "LastCheckInDate", "BadgesJSON", "RegisteredAt"
    ]);
    userSheet.getRange(1, 1, 1, 11).setBackground("#4338ca").setFontColor("#ffffff").setFontWeight("bold");
    userSheet.setFrozenRows(1);
    
    // ข้อมูลจำลองเริ่มต้น
    userSheet.appendRow([
      "U6802041510228", "6802041510228", "สมชาย พัฒนาเว็บ (ปวช.1)", "ปวช.1 เทคโนโลยีสารสนเทศ",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200", 180, 2, 3,
      new Date().toISOString().split("T")[0], JSON.stringify(["badge_welcome", "badge_first_checkin"]), new Date()
    ]);
  }

  // 2. ตาราง CheckIn_Logs (บันทึกการเช็คอินประจำวัน)
  let checkinSheet = ss.getSheetByName(TABS.CHECKIN_LOGS) || ss.insertSheet(TABS.CHECKIN_LOGS);
  if (checkinSheet.getLastRow() === 0) {
    checkinSheet.appendRow(["LogID", "LineUID", "StudentID", "FullName", "CheckInDate", "ExpEarned", "StreakDays", "Timestamp"]);
    checkinSheet.getRange(1, 1, 1, 8).setBackground("#0891b2").setFontColor("#ffffff").setFontWeight("bold");
    checkinSheet.setFrozenRows(1);
  }

  // 3. ตาราง Quiz_Results (บันทึกผลการทำแบบทดสอบ)
  let quizSheet = ss.getSheetByName(TABS.QUIZ_RESULTS) || ss.insertSheet(TABS.QUIZ_RESULTS);
  if (quizSheet.getLastRow() === 0) {
    quizSheet.appendRow([
      "ResultID", "LineUID", "StudentID", "FullName", "TopicID", "TopicName",
      "Score", "TotalQuestions", "Percentage", "Passed", "Timestamp"
    ]);
    quizSheet.getRange(1, 1, 1, 11).setBackground("#7c3aed").setFontColor("#ffffff").setFontWeight("bold");
    quizSheet.setFrozenRows(1);
  }

  // 4. ตาราง Badges (บันทึกการปลดล็อกเหรียญตรา)
  let badgeSheet = ss.getSheetByName(TABS.BADGES) || ss.insertSheet(TABS.BADGES);
  if (badgeSheet.getLastRow() === 0) {
    badgeSheet.appendRow(["BadgeRecordID", "LineUID", "StudentID", "BadgeID", "BadgeName", "Rarity", "ExpBonus", "UnlockedAt"]);
    badgeSheet.getRange(1, 1, 1, 8).setBackground("#d97706").setFontColor("#ffffff").setFontWeight("bold");
    badgeSheet.setFrozenRows(1);
  }

  // 5. ตารางข้อสอบหมวด 1: โครงสร้างพื้นฐาน HTML
  let q1Sheet = ss.getSheetByName(TABS.QUESTIONS_STRUCTURE) || ss.insertSheet(TABS.QUESTIONS_STRUCTURE);
  if (q1Sheet.getLastRow() === 0) {
    q1Sheet.appendRow(["QuestionID", "QuestionText", "CodeSnippet", "Choice1", "Choice2", "Choice3", "Choice4", "CorrectChoice", "Explanation", "Tip"]);
    q1Sheet.getRange(1, 1, 1, 10).setBackground("#2563eb").setFontColor("#ffffff").setFontWeight("bold");
    q1Sheet.setFrozenRows(1);
  }

  // 6. ตารางข้อสอบหมวด 2: การใช้งาน Tag พื้นฐาน
  let q2Sheet = ss.getSheetByName(TABS.QUESTIONS_TAGS) || ss.insertSheet(TABS.QUESTIONS_TAGS);
  if (q2Sheet.getLastRow() === 0) {
    q2Sheet.appendRow(["QuestionID", "QuestionText", "CodeSnippet", "Choice1", "Choice2", "Choice3", "Choice4", "CorrectChoice", "Explanation", "Tip"]);
    q2Sheet.getRange(1, 1, 1, 10).setBackground("#9333ea").setFontColor("#ffffff").setFontWeight("bold");
    q2Sheet.setFrozenRows(1);
  }

  SpreadsheetApp.flush();
  Logger.log("✅ ฐานข้อมูล Google Sheets ถูกสร้างและกำหนดรูปแบบเรียบร้อยแล้ว!");
}

/**
 * doGet: ให้บริการทั้ง Web App HTML และ API ดึงข้อมูล
 */
function doGet(e) {
  const action = e.parameter && e.parameter.action;
  
  if (action === "getUser") {
    return jsonResponse(getUserProfile(e.parameter.userId));
  } else if (action === "getLeaderboard") {
    return jsonResponse(getLeaderboard());
  } else if (action === "getQuestions") {
    return jsonResponse(getQuestionsData(e.parameter.topicId));
  }
  
  // ให้บริการหน้า Web Application แบบ HTML5 / LIFF
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("WebQuest HTML Learning & Quiz")
    .addMetaTag("viewport", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * doPost: รับข้อมูลจากเว็บแอพ (เช็คอิน, ส่งผลควิซ, ปลดล็อกเหรียญ)
 */
function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action;
    
    let result = { success: false, message: "Invalid action" };

    if (action === "checkIn") {
      result = recordCheckIn(contents.data);
    } else if (action === "submitQuiz") {
      result = recordQuizResult(contents.data);
    } else if (action === "unlockBadge") {
      result = recordBadgeUnlock(contents.data);
    } else if (action === "syncUser") {
      result = syncUserProfile(contents.data);
    }

    return jsonResponse(result);
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}

/**
 * บันทึกการเช็คอินประจำวัน
 */
function recordCheckIn(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const checkinSheet = ss.getSheetByName(TABS.CHECKIN_LOGS);
  const userSheet = ss.getSheetByName(TABS.USERS);
  
  const logId = "CHK_" + Utilities.getUuid().slice(0, 8);
  const now = new Date();
  const dateStr = Utilities.formatDate(now, "GMT+7", "yyyy-MM-dd");

  checkinSheet.appendRow([
    logId, data.userId, data.studentId, data.displayName,
    dateStr, data.expEarned || 30, data.streakDays || 1, now
  ]);

  // อัปเดตข้อมูลผู้ใช้
  updateUserScoreAndStreak(data.userId, data.expEarned || 30, data.streakDays || 1, dateStr);

  // ส่งแจ้งเตือน Flex Message ไปยัง LINE OA
  if (CONFIG.LINE_CHANNEL_ACCESS_TOKEN && CONFIG.LINE_CHANNEL_ACCESS_TOKEN !== "ใส่_LINE_CHANNEL_ACCESS_TOKEN_ที่นี่") {
    sendLineCheckinFlex(data.userId, data.displayName, data.streakDays, data.expEarned);
  }

  return { success: true, message: "บันทึกการเช็คอินสำเร็จ!", logId: logId };
}

/**
 * บันทึกผลการทำแบบทดสอบ
 */
function recordQuizResult(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const quizSheet = ss.getSheetByName(TABS.QUIZ_RESULTS);
  
  const resultId = "QZ_" + Utilities.getUuid().slice(0, 8);
  const now = new Date();
  const percentage = Math.round((data.score / data.totalQuestions) * 100);
  const passed = data.score >= 6;

  quizSheet.appendRow([
    resultId, data.userId, data.studentId, data.displayName,
    data.topicId, data.topicName, data.score, data.totalQuestions,
    percentage + "%", passed ? "ผ่าน" : "ไม่ผ่าน", now
  ]);

  // เพิ่มคะแนน EXP ให้ผู้ใช้
  const expReward = data.score * 15; // 15 EXP ต่อ 1 ข้อที่ถูก
  updateUserScore(data.userId, expReward);

  // ส่ง LINE Flex Message สรุปผลสอบ
  if (CONFIG.LINE_CHANNEL_ACCESS_TOKEN && CONFIG.LINE_CHANNEL_ACCESS_TOKEN !== "ใส่_LINE_CHANNEL_ACCESS_TOKEN_ที่นี่") {
    sendLineQuizFlex(data.userId, data.displayName, data.topicName, data.score, data.totalQuestions, expReward);
  }

  return {
    success: true,
    message: "บันทึกผลการทำควิซเรียบร้อย!",
    resultId: resultId,
    expReward: expReward,
    percentage: percentage
  };
}

/**
 * ส่ง LINE Flex Message เมื่อเช็คอินสำเร็จ
 */
function sendLineCheckinFlex(userId, userName, streak, exp) {
  const flexPayload = {
    type: "bubble",
    size: "mega",
    header: {
      type: "box",
      layout: "vertical",
      backgroundColor: "#4f46e5",
      contents: [
        { type: "text", text: "📅 เช็คอินสำเร็จแล้ว!", weight: "bold", color: "#ffffff", size: "lg" }
      ]
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        { type: "text", text: "ยินดีด้วยคุณ " + userName, weight: "bold", size: "md" },
        { type: "text", text: "🔥 สตรีคสะสมต่อเนื่อง: " + streak + " วัน", color: "#f97316", margin: "md", weight: "bold" },
        { type: "text", text: "✨ ได้รับคะแนนสะสม: +" + exp + " EXP", color: "#10b981", margin: "sm", weight: "bold" }
      ]
    }
  };

  pushLineMessage(userId, [
    { type: "flex", altText: "📅 บันทึกการเช็คอินประจำวันสำเร็จแล้ว!", contents: flexPayload }
  ]);
}

/**
 * ส่ง LINE Flex Message เมื่อทำแบบทดสอบเสร็จสิ้น
 */
function sendLineQuizFlex(userId, userName, topicName, score, total, exp) {
  const isPerfect = score === total;
  const flexPayload = {
    type: "bubble",
    size: "mega",
    header: {
      type: "box",
      layout: "vertical",
      backgroundColor: isPerfect ? "#7c3aed" : "#2563eb",
      contents: [
        { type: "text", text: isPerfect ? "🏆 ยอดเยี่ยม! คะแนนเต็ม 100%" : "🎯 สรุปผลการทำแบบทดสอบ", weight: "bold", color: "#ffffff", size: "lg" }
      ]
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        { type: "text", text: "ผู้เรียน: " + userName, weight: "bold", size: "md" },
        { type: "text", text: "วิชา: " + topicName, color: "#64748b", size: "sm", margin: "xs" },
        { type: "separator", margin: "md" },
        {
          type: "box",
          layout: "horizontal",
          margin: "md",
          contents: [
            { type: "text", text: "คะแนนที่ได้:", color: "#475569" },
            { type: "text", text: score + " / " + total + " ข้อ", align: "end", weight: "bold", color: score >= 6 ? "#16a34a" : "#dc2626" }
          ]
        },
        {
          type: "box",
          layout: "horizontal",
          margin: "sm",
          contents: [
            { type: "text", text: "EXP ที่ได้รับ:", color: "#475569" },
            { type: "text", text: "+" + exp + " EXP", align: "end", weight: "bold", color: "#7c3aed" }
          ]
        }
      ]
    }
  };

  pushLineMessage(userId, [
    { type: "flex", altText: "🎯 ผลการทำแบบทดสอบ " + topicName, contents: flexPayload }
  ]);
}

/**
 * ฟังก์ชันยิง LINE Push Message ไปยังผู้เรียน
 */
function pushLineMessage(userId, messages) {
  if (!CONFIG.LINE_CHANNEL_ACCESS_TOKEN || CONFIG.LINE_CHANNEL_ACCESS_TOKEN.startsWith("ใส่_")) return;
  
  const url = "https://api.line.me/v2/bot/message/push";
  const payload = {
    to: userId,
    messages: messages
  };
  
  try {
    UrlFetchApp.fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + CONFIG.LINE_CHANNEL_ACCESS_TOKEN
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  } catch (err) {
    Logger.log("Error sending LINE push: " + err);
  }
}

/**
 * ฟังก์ชันช่วยแปลงข้อมูลเป็น JSON Response
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function updateUserScore(userId, addExp) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TABS.USERS);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == userId) {
      let currentScore = Number(data[i][5]) || 0;
      let newScore = currentScore + addExp;
      let newLevel = calculateLevel(newScore);
      sheet.getRange(i + 1, 6).setValue(newScore);
      sheet.getRange(i + 1, 7).setValue(newLevel);
      break;
    }
  }
}

function updateUserScoreAndStreak(userId, addExp, streak, dateStr) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TABS.USERS);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == userId) {
      let currentScore = Number(data[i][5]) || 0;
      let newScore = currentScore + addExp;
      let newLevel = calculateLevel(newScore);
      sheet.getRange(i + 1, 6).setValue(newScore);
      sheet.getRange(i + 1, 7).setValue(newLevel);
      sheet.getRange(i + 1, 8).setValue(streak);
      sheet.getRange(i + 1, 9).setValue(dateStr);
      break;
    }
  }
}

function calculateLevel(exp) {
  if (exp >= 1300) return 6;
  if (exp >= 850) return 5;
  if (exp >= 500) return 4;
  if (exp >= 250) return 3;
  if (exp >= 100) return 2;
  return 1;
}
`;

export const GAS_HTML_INDEX = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>WebQuest HTML Learning & Quiz</title>
  <!-- Bootstrap 5 CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Font Awesome 6 -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
  <!-- SweetAlert2 -->
  <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
  <!-- Google Fonts: Prompt -->
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- LINE LIFF SDK -->
  <script charset="utf-8" src="https://static.line-scdn.net/liff/edge/2/sdk.js"></script>
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- SweetAlert2 JS -->
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body style="font-family: 'Prompt', sans-serif; background-color: #090d16; color: #f1f5f9;">
  <!-- Main Web App is injected by Google Apps Script -->
  <div id="app" class="container py-4">
    <div class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <h4 class="mt-3">กำลังโหลดระบบ WebQuest HTML...</h4>
    </div>
  </div>
</body>
</html>
`;

export async function sendToGasBackend(gasUrl: string, action: string, data: unknown): Promise<GasSyncResponse> {
  if (!gasUrl || !gasUrl.startsWith('https://script.google.com/')) {
    // Return simulated success
    return {
      success: true,
      message: 'บันทึกข้อมูลในระบบเครื่องสำเร็จ (Local Simulator)',
      data: data,
    };
  }

  try {
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action, data }),
    });

    const resJson = await response.json();
    return resJson;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `ไม่สามารถเชื่อมต่อ Google Apps Script ได้: ${errorMsg}`,
    };
  }
}

export async function fetchLeaderboardFromGas(gasUrl: string): Promise<LeaderboardEntry[] | null> {
  if (!gasUrl || !gasUrl.startsWith('https://script.google.com/')) return null;
  try {
    const url = `${gasUrl}?action=getLeaderboard`;
    const response = await fetch(url);
    const result = await response.json();
    if (Array.isArray(result) && result.length > 0) {
      return result;
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch leaderboard from GAS:', err);
    return null;
  }
}
