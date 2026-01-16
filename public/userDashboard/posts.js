const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");
const searchInput = document.getElementById("searchInput");
const postsContainer = document.getElementById("postsContainer");

if (!token) {
  window.location.href = "/index.html";
}

/* ======================
   LOAD POSTS
====================== */
async function loadPosts() {
  try {
    const res = await fetch(`${API_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch posts");

    const posts = await res.json();
    renderPosts(posts);
  } catch (err) {
    console.error("Failed to load posts", err);
  }
}

/* ======================
   RENDER POSTS
====================== */
function renderPosts(posts) {
  const container = document.getElementById("postsContainer");
  container.innerHTML = "";

  posts.forEach((post) => {
    container.innerHTML += `
      <div class="bg-white rounded-xl shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-2">${post.title}</h2>
        <p class="text-gray-600 mb-4">${post.content}</p>

        <div class="flex justify-between items-center text-sm text-gray-500">
          <span>By ${post.author?.name || "User"}</span>

          <div class="flex gap-4">
            <button onclick="likePost('${post._id}')">
              ❤️ ${post.likesCount || 0}
            </button>

            <button onclick="toggleComments('${post._id}')">
              💬 ${post.commentsCount || 0}
            </button>
          </div>
        </div>

        <!-- COMMENTS -->
        <div id="comments-${post._id}" class="hidden mt-4">
          <div id="comments-list-${post._id}" class="space-y-2"></div>

          <div class="flex mt-3 gap-2">
            <input
              id="comment-input-${post._id}"
              class="flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="Write a comment..."
            />
            <button
              class="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-lg text-sm font-medium"
              onclick="addComment('${post._id}')"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

/* ======================
   LIKE / UNLIKE
====================== */
async function likePost(postId) {
  try {
    const res = await fetch(`${API_URL}/likes/${postId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    // already liked → unlike
    if (data.message === "Post already liked") {
      await fetch(`${API_URL}/likes/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    loadPosts();
  } catch (err) {
    console.error("Like failed", err);
  }
}

/* ======================
   TOGGLE COMMENTS
====================== */
async function toggleComments(postId) {
  const box = document.getElementById(`comments-${postId}`);

  if (box.classList.contains("hidden")) {
    box.classList.remove("hidden");
    await loadComments(postId);
  } else {
    box.classList.add("hidden");
  }
}

/* ======================
   LOAD COMMENTS (✅ FIXED URL)
====================== */
async function loadComments(postId) {
  try {
    const res = await fetch(
      `${API_URL}/comments/post/${postId}`
    );

    if (!res.ok) throw new Error("Failed to load comments");

    const comments = await res.json();
    const list = document.getElementById(`comments-list-${postId}`);
    list.innerHTML = "";

    comments.forEach((c) => {
      list.innerHTML += `
        <div class="text-sm bg-gray-100 rounded-lg px-3 py-2">
          <strong>${c.author?.name || "User"}:</strong> ${c.content}
        </div>
      ${
        c.author._id === loggedInUserId
          ? `<button
              onclick="deleteComment('${c._id}', '${postId}')"
              class="text-xs text-red-500 hover:underline"
            >
              Delete
            </button>`
          : ""
      }
    </div>
      `;
    });
  } catch (err) {
    console.error("Failed to load comments", err);
  }
}

/* ======================
   ADD COMMENT (✅ FIXED URL)
====================== */
async function addComment(postId) {
  const input = document.getElementById(`comment-input-${postId}`);
  const content = input.value.trim();
  if (!content) return;

  try {
    const res = await fetch(
      `${API_URL}/comments/post/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      }
    );

    if (!res.ok) throw new Error("Failed to add comment");

    input.value = "";
    loadComments(postId);
  } catch (err) {
    console.error("Add comment failed", err);
  }
}

async function deleteComment(commentId, postId) {
  if (!confirm("Delete this comment?")) return;

  try {
    const res = await fetch(
      `${API_URL}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to delete comment");

    // Reload comments for that post
    loadComments(postId);

  } catch (err) {
    console.error("Delete comment failed", err);
    alert("Could not delete comment");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("createPostBtn");
  const modal = document.getElementById("createPostModal");
  const closeBtn = document.getElementById("closeCreatePost");
  const submitBtn = document.getElementById("submitPost");

  if (!openBtn || !modal || !closeBtn || !submitBtn) {
    console.error("Create post modal elements missing");
    return;
  }

  // Open modal
  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  // Submit post
  submitBtn.addEventListener("click", async () => {
    const title = document.getElementById("postTitle").value.trim();
    const content = document.getElementById("postContent").value.trim();

    if (!title || !content) {
      showAlert("Title and content are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("Failed to create post");

      // Reset + close modal
      document.getElementById("postTitle").value = "";
      document.getElementById("postContent").value = "";
      modal.classList.add("hidden");
      modal.classList.remove("flex");

      // Reload posts
      loadPosts();
    } catch (err) {
      console.error(err);
      showAlert("Post creation failed");
    }
  });
});

//seacrh handling

function debounce(fn, delay = 400) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

//logicforseacrch
if (searchInput) {
  const debouncedSearch = debounce(searchContent, 400);

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();

    if (query === "") {
      loadPosts(); // show normal feed again
      return;
    }

    debouncedSearch(query);
  });
}
//api of search
async function searchContent(query) {
  try {
    const res = await fetch(
      `${API_URL}/search?q=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) throw new Error("Search failed");

    const data = await res.json();

    renderPosts(data.posts || []);
  } catch (err) {
    console.error("Search error:", err);
  }
}


/* ======================
   INIT
====================== */
loadPosts();
