const keycloak = new Keycloak({
    url: 'https://auth.stage.redhat.com/auth',
    realm: 'EmployeeIDP',
    clientId: 'warhw-arcade'
});
window.kc = keycloak;
keycloak.init().success(async function(authenticated) {
    console.log(`[auth] initialized keycloak.js`);

    const storedToken = await localforage.getItem("jwt");

    // if there's no stored token, and we aren't authenticated, log in
    if (!storedToken && !authenticated) {
        console.log(`[auth] no user token found; logging in`);
        keycloak.login();
    }

    // if we're authenticated but the token hasn't been stored yet
    if (authenticated && !storedToken) {
        console.log(`[auth] logged in, storing user token`);
        await localforage.setItem("jwt", _.pick(keycloak.tokenParsed, ["email", "preferred_username"]));
    }

    // if the token is stored locally, retrieve it and copy the username into a
    // global var for PAE to pick up
    if (storedToken) {
        const email = storedToken.email || "";
        const name = storedToken.preferred_username || email.replace(/@.*/, "");
        console.log(`[auth] passing username ${name} to PAE`);
        if (name) {
            window.PAE_USERNAME = name;
        }

    }

}).error(function() {
    console.log('failed to initialize');
});
