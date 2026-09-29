const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("http://localhost:5000/api/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        const data = await response.json();

        if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
            alert("Login Successful");

            window.location.href = "planner.html";

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.log(err);
        alert("Server Error");

    }

});