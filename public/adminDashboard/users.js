const token = localStorage.getItem("token");

async function loadUsers() {
  try {
    if (!token) {
      alert("No token found. Please login as admin.");
      return;
    }

    const res = await fetch("http://localhost:5000/api/admin/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to load users");
    }

    const users = await res.json();

    const container = document.getElementById("usersList");
    container.innerHTML = "";

    users.forEach(user => {
      container.innerHTML += `
        <div class="bg-white rounded-xl shadow p-6 flex justify-between items-center">

          <!-- USER INFO -->
          <div>
            <h3 class="text-lg font-semibold">
              ${user.name}
              ${user.role === "admin"
                ? `<span class="ml-2 text-xs text-red-500">ADMIN</span>`
                : ""}
            </h3>
            <p class="text-sm text-gray-500">${user.email}</p>

            <!-- TOGGLE -->
            <div class="mt-3">
              <button
                data-id="${user._id}"
                data-active="${user.isActive}"
                onclick="handleToggle(this)"
                ${user.role === "admin" ? "disabled" : ""}
                class="relative inline-flex h-6 w-11 items-center rounded-full transition
                ${user.isActive ? "bg-green-500" : "bg-gray-400"}">

                <span
                  class="toggle-knob inline-block h-4 w-4 bg-white rounded-full transform transition
                  ${user.isActive ? "translate-x-6" : "translate-x-1"}">
                </span>
              </button>

            </div>
          </div>

          <!-- ACTIONS -->
          <button
            onclick="deleteUser('${user._id}')"
            class="text-red-600 hover:underline">
            Delete
          </button>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    alert("Failed to load users");
  }
}

async function handleToggle(button) {
  const userId = button.dataset.id;
  const isActive = button.dataset.active === "true";

  // 👉 Optimistically update UI
  button.dataset.active = (!isActive).toString();
  button.classList.toggle("bg-green-500");
  button.classList.toggle("bg-gray-400");

  const knob = button.querySelector(".toggle-knob");
  knob.classList.toggle("translate-x-6");
  knob.classList.toggle("translate-x-1");

  try {
    const endpoint = isActive
      ? `http://localhost:5000/api/admin/users/deactivate/${userId}`
      : `http://localhost:5000/api/admin/users/reactivate/${userId}`;

    const res = await fetch(endpoint, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Request failed");
    }

  } catch (err) {
    // ❌ revert UI on failure
    button.dataset.active = isActive.toString();
    button.classList.toggle("bg-green-500");
    button.classList.toggle("bg-gray-400");
    knob.classList.toggle("translate-x-6");
    knob.classList.toggle("translate-x-1");

    alert("Failed to update user status");
  }
}

async function deleteUser(userId) {
  if (!confirm("Delete this user permanently?")) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/admin/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) {
      throw new Error("Failed to delete user");
    }

    // ✅ Refresh UI
    loadUsers();

  } catch (err) {
    console.error(err);
    alert("Unable to delete user");
  }
}
