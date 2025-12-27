
const tabs = document.querySelectorAll("nav ul li a");
function hideAllSections() {
  document.getElementById("sectionUsers").classList.add("hidden");
  document.getElementById("sectionPosts").classList.add("hidden");
  document.getElementById("sectionComments").classList.add("hidden");
  document.getElementById("sectionAnalytics").classList.add("hidden");
  document.getElementById("sectionSettings").classList.add("hidden");
}

function showSection(section) {
  hideAllSections();
//loading users section
  if (section === "users") {
    document.getElementById("sectionUsers").classList.remove("hidden");
    loadUsers(); 
  }
  if (section === "posts") {
  document.getElementById("sectionPosts").classList.remove("hidden");
  loadPosts();
}
  if (section === "comments") {
  document.getElementById("sectionComments").classList.remove("hidden");
  loadComments();
}

}

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  try {
    // USERS COUNT
    const usersRes = await fetch("/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const users = await usersRes.json();
    document.getElementById("totalUsers").textContent = users.length;

    // POSTS COUNT
    const postsRes = await fetch("/api/admin/posts", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const posts = await postsRes.json();
    document.getElementById("totalPosts").textContent = posts.length;

  } catch (err) {
    console.error("Dashboard error:", err);
  }
});

