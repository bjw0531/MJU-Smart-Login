import * as utils from './utils.js';

window.addEventListener('load', async () => {
    const id_field = document.getElementById('id');
    const pw_field = document.getElementById('passwrd');
    
    const [uid, storage] = await Promise.all([
        utils.getUserId(),
        utils.getStorageData()
    ]);

    if (storage.autoLogin !== 'true') {
        return;
    }

    if (storage.userId) {
        id_field.value = storage.userId;
    }
    
    if (storage.password) {
        const uid = await utils.getUserUid();
        const plain = await utils.decrypt(storage.password, uid);
        pw_field.value = plain;
    }   

    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.click();
    }
});
