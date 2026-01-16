
document.addEventListener("DOMContentLoaded", () => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");


    signUpButton.addEventListener("click", () => {
        container.classList.add("right-panel-active");
    });

    signInButton.addEventListener("click", () => {
        container.classList.remove("right-panel-active");
    });

    
    // GOOGLE LOGIN
    google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID",
        callback: handleGoogleCredential
    });

    document.getElementById("googleLogin").onclick = () => {
        google.accounts.id.prompt(); // Opens Google pop-up
    };

    document.getElementById("googleSignup").onclick = () => {
        google.accounts.id.prompt();
    };

    function handleGoogleCredential(response) {
        const idToken = response.credential;

           // Send token to backend
        fetch("http://localhost:5000/auth/google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: idToken })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            alert("Logged in!");
        })
        .catch(err => console.error(err));
    }
});

//saving login details in local storage
document.getElementById("signUpForm").addEventListener("submit", async (e) =>{
    e.preventDefault();

    const name =document.getElementById("signUpName").value;
    const email = document.getElementById("signUpEmail").value;
    const password = document.getElementById("signUpPassword").value;

    const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers:{ "Content-Type": "application/json"},
        body: JSON.stringify({ name, email ,password})
    });

    const data  = await res.json();

    console.log(data);
    alert(data.message || "Signup Successfull!, Please login.");
});

//Login Form
document.getElementById("logIn").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("logInEmail").value;
    const password = document.getElementById("logInPassword").value;

    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })   
    });

    const data = await res.json();

    //login success
    if(data.token){
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);



    localStorage.setItem("user", JSON.stringify(data.user));
    
const modal = document.getElementById("alertModal");
const message = document.getElementById("alertMessage");
const okBtn = document.getElementById("alertOkBtn");

function showAlert(text, redirectUrl = null) {
    message.textContent = text;
    modal.classList.add("show");

    okBtn.onclick = () => {
        modal.classList.remove("show");
        if (redirectUrl) window.location.href = redirectUrl;
    };
}
if (data.role === "admin") {
    showAlert("Welcome Admin!", "adminDashboard/admin-dashboard.html");
} else {
    showAlert("Welcome User!", "userDashboard/userFeed.html");
}

}

});

