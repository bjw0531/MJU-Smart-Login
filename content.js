window.addEventListener('load', async () => {
    const id_field = document.getElementById('input-userId');
    const pw_field = document.getElementById('input-password');
    
    const storage = await getStorageData();

    if (storage.autoLogin !== 'true') {
        return;
    }

    if (storage.userId) {
        id_field.value = storage.userId;
    }
    
    if (storage.password && storage.uid) {
        const plain = await decrypt(storage.password, storage.uid);
        pw_field.value = plain;
    }   

    const loginButton = document.getElementsByClassName('login_bt')[0];
    if (loginButton) {
        loginButton.click();
    }
});
