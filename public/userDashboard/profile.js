document.addEventListener("DOMContentLoaded", async () => {
  console.log("PROFILE JS LOADED");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  console.log("USER:", user);
  console.log("TOKEN:", token);

  if (!user || !token) {
    alert("Not logged in");
    return;
  }

  document.getElementById("name").textContent = user.name || "N/A";
  document.getElementById("email").textContent = user.email || "N/A";

  try {
    const res = await fetch("http://localhost:5000/api/posts/user", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("FETCH STATUS:", res.status);

    const myPosts = await res.json();
    console.log("POSTS FROM API:", myPosts);

    const postsDiv = document.getElementById("posts");
    postsDiv.innerHTML = "";

    if (!Array.isArray(myPosts) || myPosts.length === 0) {
      postsDiv.innerHTML = `<p class="text-gray-500">No posts yet.</p>`;
      return;
    }

    myPosts.forEach(post => {
      postsDiv.innerHTML += `
        <div class="border p-4 rounded shadow">
          <h3 class="font-bold text-lg">${post.title}</h3>
          <p class="mt-2">${post.content}</p>
        </div>
      `;
    });
  } catch (err) {
    console.error("ERROR LOADING POSTS:", err);
  }
});
