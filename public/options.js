const baseUrl = 'http://127.0.0.1:8000'


// Basic config
const saveOptions = () => {
  const tgSession = document.getElementById('tgSession').value;
  const mentorUuid = document.getElementById('mentorUuid').value;

  chrome.storage.sync.set(
    { tgSession: tgSession, mentorUuid: mentorUuid },
    () => {
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 1000);
    }
  );
};

const restoreOptions = () => {
  basicTemplate = '#Еженедельный план\nПривет, держи план: {gist}\n{comment}'

  chrome.storage.sync.get(
    { tgSession: '', mentorUuid: '', template: '' },
    (items) => {
      document.getElementById('tgSession').value = items.tgSession;
      document.getElementById('mentorUuid').value = items.mentorUuid;
      document.getElementById('planTemplate').value = items.template
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveSettings').addEventListener('click', saveOptions);

// Login in Telethon
async function sendVerificationCode() {
  const phoneNumber = document.getElementById('phoneNumber').value

  const bodyParams = {
    'phone_number': phoneNumber
  }

  console.log(JSON.stringify(bodyParams))

  const response = await fetch(`${baseUrl}/auth/verification_code`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyParams)
  })

  if (!response.ok) {
    const status = document.getElementById('loginStatus');
    status.textContent = 'Can not send verification code. Check Network tab.';
    setTimeout(() => {
      status.textContent = '';
    }, 5000);
  }

  const result = await response.json()
  const phoneCodeHash = result.phone_code_hash
  localStorage.setItem('phoneCodeHash', phoneCodeHash)
  localStorage.setItem('phoneNumber', phoneNumber)
}

async function loginInTelegram() {
  const phoneNumber = localStorage.getItem('phoneNumber')
  const verificationCode = document.getElementById('verificationCode').value
  const phoneCodeHash = localStorage.getItem('phoneCodeHash')
  const password = document.getElementById('password').value

  let bodyParams = {
    'phone_number': phoneNumber,
    'verification_code': verificationCode,
    'phone_code_hash': phoneCodeHash
  }
  if (password != '') {
    bodyParams['password'] = password
  }

  const response = await fetch(`${baseUrl}/auth/session`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyParams)
  })

  if (!response.ok) {
    const status = document.getElementById('loginStatus');
    status.textContent = 'Can not login. Check Network tab.';
    setTimeout(() => {
      status.textContent = '';
    }, 5000);
  }

  const result = await response.json()

  document.getElementById('tgSession').value = result.tg_session;
  saveOptions()
}

document.getElementById('sendVerificationCode').addEventListener('click', sendVerificationCode)
document.getElementById('loginInTelegram').addEventListener('click', loginInTelegram)

// Template save
const saveTemplate = () => {
  const template = document.getElementById('planTemplate').value;

  chrome.storage.sync.set(
    { template: template },
    () => {
      const status = document.getElementById('templateStatus');
      status.textContent = 'Template saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 1000);
    }
  );
};

document.getElementById('savePlanTemplate').addEventListener('click', saveTemplate)