window.addEventListener('load', () => {
    const id_field = document.getElementById('id');
    const pw_field = document.getElementById('passwrd');

    chrome.storage.sync.get(['userId', 'password', 'autoLogin'], (result) => {
        if (result.userId) {
            id_field.value = result.userId;
        }
        
        if (result.password) {
            pw_field.value = result.password;
        }

        if (result.autoLogin !== 'true') {
            return;
        }
        
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            loginButton.click();
        }
    });
});
