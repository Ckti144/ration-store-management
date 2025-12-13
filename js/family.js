/**
 * Family Management JavaScript
 * Handles family CRUD operations
 * Updated to use backend API
 */

let currentEditId = null;

// ===== DOM ELEMENTS =====
const modal = document.getElementById('familyModal');
const form = document.getElementById('familyForm');
const addBtn = document.getElementById('addFamilyBtn');
const closeBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const addMemberBtn = document.getElementById('addMemberBtn');
const memberListContainer = document.getElementById('memberList');

// ===== EVENT LISTENERS =====
addBtn.addEventListener('click', () => {
    currentEditId = null;
    form.reset();
    memberListContainer.innerHTML = '<div class="member-item"><input type="text" class="member-name" placeholder="Member name" required><button type="button" class="btn-remove-member" onclick="removeMember(this)">Remove</button></div>';
    document.getElementById('modalTitle').textContent = 'Add Family';
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

addMemberBtn.addEventListener('click', () => {
    const memberDiv = document.createElement('div');
    memberDiv.className = 'member-item';
    memberDiv.innerHTML = `
        <input type="text" class="member-name" placeholder="Member name" required>
        <button type="button" class="btn-remove-member" onclick="removeMember(this)">Remove</button>
    `;
    memberListContainer.appendChild(memberDiv);
});

form.addEventListener('submit', handleFormSubmit);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// ===== FUNCTIONS =====
/**
 * Close modal
 */
function closeModal() {
    modal.style.display = 'none';
    form.reset();
    currentEditId = null;
}

/**
 * Remove member field
 * @param {HTMLElement} btn - Button element
 */
function removeMember(btn) {
    const memberItems = memberListContainer.querySelectorAll('.member-item');
    if (memberItems.length > 1) {
        btn.closest('.member-item').remove();
    } else {
        alert('At least one member is required.');
    }
}

/**
 * Handle form submission
 * @param {Event} e - Form submit event
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const familyId = document.getElementById('familyId').value.trim();
    const headOfFamily = document.getElementById('headOfFamily').value.trim();
    const numMembers = parseInt(document.getElementById('numMembers').value);
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    // Get member names
    const memberInputs = memberListContainer.querySelectorAll('.member-name');
    const memberList = Array.from(memberInputs)
        .map(input => input.value.trim())
        .filter(name => name !== '');
    
    // Validation
    if (memberList.length === 0) {
        alert('Please add at least one member.');
        return;
    }
    
    if (memberList.length !== numMembers) {
        if (!confirm(`Number of members (${numMembers}) doesn't match member list (${memberList.length}). Continue anyway?`)) {
            return;
        }
    }
    
    const familyData = {
        familyId: familyId,
        headOfFamily: headOfFamily,
        numMembers: memberList.length,
        memberList: memberList,
        address: address,
        phone: phone
    };
    
    try {
        if (currentEditId) {
            // Update existing family
            await familiesAPI.update(currentEditId, familyData);
            showSuccess('Family updated successfully!');
        } else {
            // Create new family
            await familiesAPI.create(familyData);
            showSuccess('Family added successfully!');
        }
        
        renderFamilyTable();
        closeModal();
    } catch (error) {
        showError(error.message || 'Error saving family. Please try again.');
    }
}

/**
 * Edit family
 * @param {string} id - Family ID
 */
async function editFamily(id) {
    try {
        const family = await familiesAPI.getById(id);
        
        currentEditId = id;
        document.getElementById('editFamilyId').value = id;
        document.getElementById('familyId').value = family.familyId;
        document.getElementById('headOfFamily').value = family.headOfFamily;
        document.getElementById('numMembers').value = family.numMembers;
        document.getElementById('address').value = family.address;
        document.getElementById('phone').value = family.phone;
        
        // Populate member list
        memberListContainer.innerHTML = '';
        family.memberList.forEach(member => {
            const memberDiv = document.createElement('div');
            memberDiv.className = 'member-item';
            memberDiv.innerHTML = `
                <input type="text" class="member-name" placeholder="Member name" value="${member}" required>
                <button type="button" class="btn-remove-member" onclick="removeMember(this)">Remove</button>
            `;
            memberListContainer.appendChild(memberDiv);
        });
        
        document.getElementById('modalTitle').textContent = 'Edit Family';
        modal.style.display = 'block';
    } catch (error) {
        showError(error.message || 'Error loading family data.');
    }
}

/**
 * Delete family
 * @param {string} id - Family ID
 */
async function deleteFamily(id) {
    if (!confirm('Are you sure you want to delete this family? This action cannot be undone.')) {
        return;
    }
    
    try {
        await familiesAPI.delete(id);
        showSuccess('Family deleted successfully!');
        renderFamilyTable();
    } catch (error) {
        showError(error.message || 'Error deleting family. Please try again.');
    }
}

/**
 * Render family table
 */
async function renderFamilyTable() {
    try {
        const families = await familiesAPI.getAll();
        const tbody = document.getElementById('familyTableBody');
        
        if (families.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No families registered yet. Click "Add Family" to register.</td></tr>';
            return;
        }
        
        tbody.innerHTML = families.map(family => {
            const members = family.memberList.join(', ');
            return `
                <tr>
                    <td>${family.familyId}</td>
                    <td>${family.headOfFamily}</td>
                    <td>${members}</td>
                    <td>${family.phone}</td>
                    <td>${family.address}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editFamily('${family.id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteFamily('${family.id}')">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading families:', error);
        document.getElementById('familyTableBody').innerHTML = '<tr><td colspan="6" class="empty-state">Error loading families. Make sure the server is running.</td></tr>';
    }
}

// Update member count when number of members changes
document.getElementById('numMembers').addEventListener('input', (e) => {
    const numMembers = parseInt(e.target.value) || 0;
    const memberItems = memberListContainer.querySelectorAll('.member-item');
    const currentCount = memberItems.length;
    
    if (numMembers > currentCount) {
        // Add members
        for (let i = currentCount; i < numMembers; i++) {
            const memberDiv = document.createElement('div');
            memberDiv.className = 'member-item';
            memberDiv.innerHTML = `
                <input type="text" class="member-name" placeholder="Member name" required>
                <button type="button" class="btn-remove-member" onclick="removeMember(this)">Remove</button>
            `;
            memberListContainer.appendChild(memberDiv);
        }
    } else if (numMembers < currentCount && numMembers > 0) {
        // Remove members (keep at least 1)
        for (let i = currentCount; i > numMembers; i--) {
            const lastItem = memberListContainer.lastElementChild;
            if (memberItems.length > 1) {
                lastItem.remove();
            }
        }
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    renderFamilyTable();
});
