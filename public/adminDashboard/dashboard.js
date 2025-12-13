
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

}
//loading posts section
if (section === "posts") {
  document.getElementById("sectionPosts").classList.remove("hidden");
  loadPosts();
}


