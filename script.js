// Toggle dropdown menu
function toggleDropdown() {
    const menu = document.getElementById('dropdownMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }
  
  // Delete a row from the table and update localStorage
  function deleteRow(button) {
    const row = button.closest('tr');
    const id = row.getAttribute('data-id');
    row.remove();
  
    let rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    rooms = rooms.filter(room => room.id !== id);
    localStorage.setItem('rooms', JSON.stringify(rooms));
  }
  
  // Search the table based on input
  function searchTable() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.getElementById("roomTableBody").getElementsByTagName("tr");
  
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("td");
      let match = false;
  
      for (let j = 0; j < cells.length - 1; j++) {
        if (cells[j].textContent.toLowerCase().includes(input)) {
          match = true;
          break;
        }
      }
      rows[i].style.display = match ? "" : "none";
    }
  }
  
  // Format 24-hour time to 12-hour format
  function formatTimeToAMPM(time24) {
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }
  
  // Render rooms to the table
  function renderRooms() {
    const tableBody = document.getElementById('roomTableBody');
    if (!tableBody) return;
  
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    tableBody.innerHTML = '';
  
    rooms.forEach(room => {
      const formattedTime = formatTimeToAMPM(room.time);
      const row = document.createElement('tr');
      row.setAttribute('data-id', room.id);
      row.innerHTML = `
        <td>${room.building}</td>
        <td>${room.room}</td>
        <td>${room.date}</td>
        <td>${formattedTime}</td>
      <td>
  <button class="update" onclick="openUpdateModal('${room.id}')">Update</button>
  <button class="delete" onclick="deleteRow(this)">Delete</button>
</td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  // Update Modal Controls
  let currentEditId = null;
  
  function openUpdateModal(id) {
    currentEditId = id;
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const room = rooms.find(r => r.id === id);
    if (!room) return;
  
    document.getElementById('updateBuilding').value = room.building;
    document.getElementById('updateRoom').value = room.room;
    document.getElementById('updateDate').value = room.date;
    document.getElementById('updateTime').value = room.time;
  
    document.getElementById('updateModal').style.display = 'block';
    document.getElementById('modalOverlay').style.display = 'block';
  }
  
  function closeModal() {
    currentEditId = null;
    document.getElementById('updateModal').style.display = 'none';
    document.getElementById('modalOverlay').style.display = 'none';
  }
  
  // Handle update submission
  const updateForm = document.getElementById('updateForm');
  if (updateForm) {
    updateForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const building = document.getElementById('updateBuilding').value.trim();
      const room = document.getElementById('updateRoom').value.trim();
      const date = document.getElementById('updateDate').value;
      const time = document.getElementById('updateTime').value;
  
      if (!building || !room || !date || !time) {
        alert('Please fill all fields.');
        return;
      }
  
      let rooms = JSON.parse(localStorage.getItem('rooms')) || [];
      const index = rooms.findIndex(r => r.id === currentEditId);
      if (index === -1) {
        alert('Room not found');
        closeModal();
        return;
      }
  
      rooms[index] = { id: currentEditId, building, room, date, time };
      localStorage.setItem('rooms', JSON.stringify(rooms));
      closeModal();
      renderRooms();
    });
  }
  
  // Save new room
  const addRoomForm = document.getElementById('addRoomForm');
  if (addRoomForm) {
    addRoomForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const building = document.getElementById('building').value.trim();
      const room = document.getElementById('room').value.trim();
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;
  
      if (!building || !room || !date || !time) {
        alert('Please fill all fields.');
        return;
      }
  
      const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
      const id = Date.now().toString();
  
      rooms.push({ id, building, room, date, time });
      localStorage.setItem('rooms', JSON.stringify(rooms));
  
      // Redirect back to index.html after saving
      window.location.href = 'index.html';
    });
  }
  
  // Auto-run functions on load
  document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener('input', searchTable);
    }
    renderRooms();
  });
  