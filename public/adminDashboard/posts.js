
async function loadPosts() {
  try {
 if (typeof token === "undefined") {
  var token = localStorage.getItem("token");
  }else{
    alert("Please Login as Admin")
  }

    const res = await fetch("http://localhost:5000/api/admin/posts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to load posts");
    }

    const posts = await res.json();

    const container = document.getElementById("postsList");
    container.innerHTML = "";

    posts.forEach(post => {
      container.innerHTML += `
        <div class="bg-white rounded-xl shadow p-6">

          <!-- POST HEADER -->
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">
                ${post.title}
              </h3>
              <p class="text-sm text-gray-500">
                By ${post.author?.name || "Unknown"}
              </p>
            </div>

            <div class="flex gap-3">
              <button
                onclick="editPost('${post._id}', '${post.title.replace(/'/g, "\\'")}', '${post.content.replace(/'/g, "\\'")}')"
                class="text-blue-600 hover:underline">
                Edit
              </button>

              <button
                onclick="deletePost('${post._id}')"
                class="text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </div>

          <!-- POST CONTENT -->
          <p class="mt-4 text-gray-700 line-clamp-3">
            ${post.content}
          </p>

          <!-- META -->
          <div class="mt-4 text-xs text-gray-400">
            ${new Date(post.createdAt).toLocaleString()}
          </div>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    alert("Failed to load posts");
  }
}

/* =========================
   EDIT POST
========================= */
async function editPost(postId, oldTitle, oldContent) {
  const title = prompt("Edit title", oldTitle);
  if (title === null) return;

  const content = prompt("Edit content", oldContent);
  if (content === null) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/admin/posts/${postId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    loadPosts();

  } catch (err) {
    console.error(err);
    alert("Failed to delete post");
  }
}