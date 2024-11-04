// ChatNotification.js
import React from 'react';
import './ChatNotification.css';

function ChatNotification({ onClick }) {
  return (
    <div className="chat-notification" onClick={onClick}>
      <span role="img" aria-label="wave"></span>👋 مرحباً ، أنا مساعد أكسبرو الذكي الافتراضي! تم تصميمي لأكون مرشدك الشخصي في تقديم الدعم الفوري والرد على جميع استفساراتك المتعلقة بأنظمتنا وخدماتنا المقدمة. أستطيع فهم احتياجاتك وتقديم الحلول بسرعة وفعالية لضمان تجربة سلسة وشاملة
    </div>
  );
}

export default ChatNotification;
