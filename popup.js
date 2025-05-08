window.addEventListener('load', () => {
  const id_field = document.getElementById('userId');
  const pw_field = document.getElementById('password');
  const toggle = document.getElementById('toggle');
  toggle.addEventListener('click', toggleAutoLogin);

  chrome.storage.sync.get(['userId', 'password', 'autoLogin'], (result) => {
    if (result.userId) {
      id_field.value = result.userId;
    }
    if (result.password) {
      pw_field.value = result.password;
    }
    if (result.autoLogin === 'true') {
      toggle.checked = true;
    } else {
      toggle.checked = false;
    }
  });
});

document.getElementById('saveBtn').addEventListener('click', async () => {
  const userId = document.getElementById('userId').value;
  const password = document.getElementById('password').value;

  if (!userId || !password) {
    showToast('아이디와 비밀번호를 모두 입력하세요.');
    return;
  }

  chrome.storage.sync.set({ userId, password }, () => {
    showToast('저장 완료!');
  });
});

function toggleAutoLogin() {
  const toggle = document.getElementById('toggle');

  chrome.storage.sync.set({
    autoLogin: toggle.checked ? 'true' : 'false'
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show";

  setTimeout(() => {
    toast.className = "toast hide";
  }, 2000);

  setTimeout(() => {
    toast.className = "toast";
  }, 2500);
}
