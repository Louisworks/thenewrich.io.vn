const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'Louis Nguyễn <onboarding@resend.dev>';

function isTest(email) {
  return email.includes('+test');
}

function stripTest(email) {
  return email.replace(/\+test[^@]*/i, '');
}

async function sendEmail({ to, subject, html, scheduledAt }) {
  const payload = { from: FROM, to, subject, html };
  if (scheduledAt) payload.scheduledAt = scheduledAt;
  return resend.emails.send(payload);
}

function scheduleTime(baseDate, days) {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

// Email 1 — Chào mừng (gửi ngay)
function email1Html(name) {
  return `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;line-height:1.7">
<p>${name},</p>
<p>Cảm ơn bạn đã để lại thông tin.</p>
<p>Mình không biết bạn tìm đến thenewrich qua đâu — nhưng mình đoán bạn đang ở một điểm mà nhiều người mình biết cũng từng ở:</p>
<p>Có năng lực. Có tham vọng. Nhưng chưa biết bắt đầu từ đâu để thoát ra khỏi cái vòng lặp 9-5 đó.</p>
<p>Mình cũng vậy — 8 năm làm brand marketing cho BMW, Masan, mấy công ty lớn. Giỏi xây thương hiệu cho người khác. Còn thương hiệu của chính mình? Bằng không.</p>
<p>Cho đến khi mình dừng lại và bắt đầu build theo cách của mình.</p>
<p>Trong vài ngày tới mình sẽ gửi cho bạn một vài thứ — không phải quảng cáo. Là những gì mình thật sự học được trên đường đi.</p>
<p>Nếu bạn thấy có ích thì đọc. Không thì bỏ qua cũng được — không giận đâu.</p>
<p>— Louis</p>
<p style="color:#888;font-size:13px">P.S. Nếu có gì muốn hỏi thẳng, reply email này. Mình đọc hết.</p>
</div>`;
}

// Email 2 — Nurture (2 ngày sau)
function email2Html(name) {
  return `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;line-height:1.7">
<p>${name},</p>
<p>Có một điều mình nhận ra sau khi làm brand marketing gần 10 năm:</p>
<p>Hầu hết mọi người xây kênh nhân hiệu theo cách ngược.</p>
<p>Họ bắt đầu bằng câu hỏi: <em>"Mình nên đăng gì?"</em></p>
<p>Đó là câu hỏi sai.</p>
<p>Câu hỏi đúng là: <em>"Mình muốn người ta nhớ mình là ai — sau khi đọc xong?"</em></p>
<p>Khi bạn biết câu trả lời đó, mọi thứ thay đổi. Bạn không còn mò mẫm mỗi sáng không biết đăng gì. Bạn không còn copy trend rồi cảm thấy mình đang giả vờ là người khác.</p>
<p>Mình gọi đó là <strong>hệ thống nhân hiệu</strong> — không phải công thức viral, không phải lịch đăng bài cứng nhắc.</p>
<p>Là hiểu rõ mình là ai, mình phục vụ ai, và mình nói chuyện với họ như thế nào.</p>
<p>Khi có cái đó rồi — content tự ra. Follower tự đến. Khách hàng tự tin vào bạn trước khi mua.</p>
<p>Ngày mai mình sẽ kể cụ thể hơn — và bạn có thể làm được điều tương tự.</p>
<p>— Louis</p>
</div>`;
}

// Email 3 — Chốt sale (1 ngày sau Email 2)
function email3Html(name) {
  return `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;line-height:1.7">
<p>${name},</p>
<p>Mình đã kể cho bạn nghe về hành trình của mình. Và về lý do tại sao hầu hết mọi người xây kênh nhân hiệu theo cách ngược.</p>
<p>Hôm nay mình muốn nói thẳng:</p>
<p>Mình có một khoá học. Tên là <strong>Khoá học Xây Kênh Nhân Hiệu</strong>.</p>
<p>Không phải dạng khoá học bảo bạn đăng bài theo công thức. Không phải 50 bài lý thuyết rồi để bạn tự xử.</p>
<p>Đây là hệ thống 60 ngày thực chiến — mình dẫn bạn xây kênh nhân hiệu từ đầu.</p>
<p><strong>Bạn sẽ có sau khoá học:</strong></p>
<ul>
<li>Định vị rõ mình là ai và phục vụ ai</li>
<li>Hệ thống content không cần ngồi mò mẫm mỗi ngày</li>
<li>Giọng nói thương hiệu thật — không phải giọng copy từ người khác</li>
<li>100+ templates và công cụ để làm nhanh hơn</li>
</ul>
<p><strong>Có 2 lựa chọn:</strong></p>
<p>👉 <strong>Tự học — 1.990.000₫</strong><br/>Trọn bộ 60+ bài giảng, 100+ templates, truy cập trọn đời.</p>
<p>👉 <strong>VIP + Mentor — 3.990.000₫</strong><br/>Trọn bộ + 4 buổi feedback 1-1, review kênh cá nhân, nhóm VIP, workshop live.</p>
<p>Nếu bạn đã đọc đến đây — bạn biết mình có muốn bắt đầu không rồi.</p>
<p><a href="https://thenewrich.io.vn/checkout" style="background:#22c55e;color:#000;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;margin-top:8px">→ Đăng ký ngay</a></p>
<p style="color:#888;font-size:13px">Có câu hỏi? Reply email này. Mình trả lời thật, không phải sales script.</p>
<p>— Louis</p>
</div>`;
}

// Email 4 — Xác nhận đơn hàng
function email4Html(name, productName, amount, orderCode) {
  const amountFmt = new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  return `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;line-height:1.7">
<p>${name},</p>
<p>Mình xác nhận đã nhận được thanh toán từ bạn.</p>
<div style="background:#f6fef9;border:1px solid #22c55e44;border-radius:8px;padding:16px;margin:16px 0">
  <p style="margin:4px 0"><strong>Sản phẩm:</strong> ${productName}</p>
  <p style="margin:4px 0"><strong>Số tiền:</strong> ${amountFmt}</p>
  <p style="margin:4px 0"><strong>Mã đơn:</strong> ${orderCode}</p>
</div>
<p><strong>Bước tiếp theo:</strong></p>
<p>Mình sẽ nhắn Zalo cho bạn trong vòng 30 phút để cấp quyền truy cập khoá học.</p>
<p>Nếu sau 30 phút chưa thấy mình nhắn — reply email này hoặc nhắn thẳng vào Zalo: <strong>0938 481 507</strong></p>
<p>Cảm ơn bạn đã dám bước.<br/>Mình sẽ đồng hành cùng bạn từ đây.</p>
<p>— Louis<br/><a href="https://thenewrich.io.vn" style="color:#22c55e">thenewrich.io.vn</a></p>
</div>`;
}

async function sendWelcomeSequence({ email, name, now }) {
  const test = isTest(email);
  const sendTo = test ? stripTest(email) : email;
  const base = now || new Date().toISOString();

  // Email 1 — ngay lập tức
  await sendEmail({ to: sendTo, subject: 'Mình là Louis — và đây là lý do bạn ở đây', html: email1Html(name) });

  // Email 2 — 2 ngày sau (test: 1 phút)
  await sendEmail({
    to: sendTo,
    subject: 'Tại sao personal brand thất bại — không phải vì thiếu content',
    html: email2Html(name),
    scheduledAt: test ? new Date(Date.now() + 60000).toISOString() : scheduleTime(base, 2)
  });

  // Email 3 — 3 ngày sau (test: 2 phút)
  await sendEmail({
    to: sendTo,
    subject: 'Nếu bạn muốn bắt đầu — đây là bước tiếp theo',
    html: email3Html(name),
    scheduledAt: test ? new Date(Date.now() + 120000).toISOString() : scheduleTime(base, 3)
  });
}

async function sendOrderConfirmation({ email, name, productName, amount, orderCode }) {
  await sendEmail({
    to: stripTest(email),
    subject: 'Mình nhận được rồi — cảm ơn bạn đã tin tưởng',
    html: email4Html(name, productName, amount, orderCode)
  });
}

module.exports = { sendWelcomeSequence, sendOrderConfirmation };
