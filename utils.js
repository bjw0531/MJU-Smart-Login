export async function getUserId() {
	return new Promise((resolve) => {
		chrome.storage.local.get(["userId"], (result) => {
			resolve(result.userId || null);
		});
	});
}

export async function getUserUid(){
  return new Promise((resolve) => {
    chrome.identity.getProfileUserInfo((userInfo) => {
      resolve(userInfo.id || null);
    });
  });
}

export async function getStorageData() {
	return new Promise((resolve) => {
		chrome.storage.local.get(["userId", "password", "autoLogin"], (result) => {
			resolve(result);
		});
	});
}

export async function setStorageData(data) {
	return new Promise((resolve) => {
		chrome.storage.local.set(data, () => {
			resolve();
		});
	});
}

// 문자열 → Uint8Array
const strToBuf = (str) => new TextEncoder().encode(str);
const bufToStr = (buf) => new TextDecoder().decode(buf);

// AES 키 생성
export async function getKeyFromUid(uid) {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(uid),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode('MJUSMARTLOGIN'),  // 고정 salt or uid 기반도 가능
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    {
      name: 'AES-GCM',
      length: 256
    },
    false,
    ['encrypt', 'decrypt']
  );
}


// 암호화
export async function encrypt(text, key) {
  const encoded_key = await getKeyFromUid(key);

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    encoded_key,
    strToBuf(text)
  );

  // 결과: iv + 암호문 → Base64 인코딩
  const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.byteLength);
  return btoa(String.fromCharCode(...combined));
}

// 복호화
export async function decrypt(base64Cipher, key) {
  const encoded_key = await getKeyFromUid(key);
  const combined = Uint8Array.from(atob(base64Cipher), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    encoded_key,
    data
  );
  return bufToStr(decrypted);
}
