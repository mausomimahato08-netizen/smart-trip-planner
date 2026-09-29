const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {

        const response = await fetch("http://localhost:5000/api/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                fullName,
                email,
                mobile,
                password
            })

        });

        const data = await response.json();

        alert(data.message);

        if (data.success) {
            window.location.href = "login.html";
        }

    } catch (err) {

        console.log(err);
        alert("Server Error");

    }

});