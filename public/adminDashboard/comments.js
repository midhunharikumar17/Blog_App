async function loadComments() {
  try {
    if (typeof token === "undefined") { 
  var token = localStorage.getItem("token");
  }else{
    alert("Please Login as Admin")
  }


    const res = await fetch("http://localhost:5000/api/admin/comments", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to load comments");
    }

    const comments = await res.json();

    const container = document.getElementById("commentsList");
    container.innerHTML = "";

    if (comments.length === 0) {
      container.innerHTML = `
        <p class="text-gray-500">No comments found.</p>
      `;
      return;
    }

    comments.forEach(comment => {
      container.innerHTML += `
        <div class="bg-white rounded-xl shadow p-6">

          <!-- HEADER -->
          <div class="flex justify-between items-start">
            <div>
              <h4 class="text-sm font-semibold text-gray-800">
                ${comment.user?.name || "Unknown User"}
              </h4>
              <p class="text-xs text-gray-500">
                On: ${comment.post?.title || "Unknown Post"}
              </p>
            </div>

            <button
              onclick="deleteComment('${comment._id}')"
              class="text-red-600 hover:underline text-sm">
              Delete
            </button>
          </div>

          <!-- CONTENT -->
          <p class="mt-3 text-gray-700">
            ${comment.content}
          </p>

          <!-- META -->
          <div class="mt-3 text-xs text-gray-400">
            ${new Date(comment.createdAt).toLocaleString()}
          </div>
        </div>
      `;
    });

  } catch (err) {
    console.error("Load comments error:", err);
    alert("Failed to load comments");
  }
}

/* =========================
   DELETE COMMENT
========================= */
async function deleteComment(commentId) {
  if (!confirm("Delete this comment permanently?")) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/admin/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to delete comment");
    }

    loadComments();

  } catch (err) {
    console.error("Delete comment error:", err);
    alert("Failed to delete comment");
  }
}
