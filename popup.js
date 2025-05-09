import * as utils from './utils.js';

window.addEventListener('load', async () => {
  const id_field = document.getElementById('userId');
  const pw_field = document.getElementById('password');
  const toggle = document.getElementById('toggle');
  toggle.addEventListener('click', toggleAutoLogin);
  
  const [uid, storage] = await Promise.all([
    utils.getUserId(),
    utils.getStorageData()
  ]);

  if (storage.autoLogin === 'true') {
    toggle.checked = true;
  }

  if (storage.userId) {
    id_field.value = storage.userId;
  }

  if (storage.password) {
    const uid = await utils.getUserUid();
    const plain = await utils.decrypt(storage.password, uid);
    pw_field.value = plain;
  }
});

document.getElementById('saveBtn').addEventListener('click', async () => {
  const userId = document.getElementById('userId').value;
  const password = document.getElementById('password').value;

  if (!userId || !password) {
    showToast('아이디와 비밀번호를 모두 입력하세요.');
    return;
  }

  const uid = await utils.getUserUid();
  const encrypted = await utils.encrypt(password, uid);
  utils.setStorageData({ 'userId' : userId, 'password': encrypted })
    .then(() => {
      console.log(encrypted);
      showToast('저장 완료!');
    });

});

function toggleAutoLogin() {
  const toggle = document.getElementById('toggle');
  utils.setStorageData({ autoLogin: toggle.checked ? 'true' : 'false' });
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
