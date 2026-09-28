// ========================================
// GET - Retrieve All Medications
// ========================================

async function loadMedications() {
    const response = await fetch("/api/medications");
    const meds = await response.json();

    const table = document.getElementById("medTable");
    table.innerHTML = "";

    let totalDaily = 0;
    let totalDoses = 0;

    meds.forEach(med => {
        totalDaily += med.dosage * med.frequency;
        totalDoses += med.frequency;

        const row = `
            <tr>
                <td>${med.id}</td>
                <td>${med.name}</td>
                <td>${med.dosage} mg</td>
                <td>${med.frequency}x daily</td>
                <td>${med.duration} days</td>
                <td>${med.start_date ? med.start_date.substring(0, 10) : ""}</td>
                <td>${med.category}</td>
                <td class="actions">
                    <a href="edit.html?id=${med.id}">Edit</a>
                    <a href="#" onclick="deleteMedication(${med.id}); return false;">Delete</a>
                </td>
            </tr>
        `;

        table.innerHTML += row;
    });

    // Update summary
    const summary = document.getElementById("summary");
    if (summary) {
        summary.innerHTML = `
            <strong>${meds.length}</strong> medications &nbsp;|&nbsp;
            <strong>${totalDaily} mg</strong> daily total &nbsp;|&nbsp;
            <strong>${totalDoses}</strong> doses per day
        `;
    }

    return meds;
}

// ========================================
// Dashboard-specific loader (no actions column)
// ========================================

async function loadDashboard() {
    const response = await fetch("/api/medications");
    const meds = await response.json();

    const table = document.getElementById("medTable");
    if (!table) return;

    table.innerHTML = "";

    let totalDaily = 0;
    let totalDoses = 0;

    meds.forEach(med => {
        totalDaily += med.dosage * med.frequency;
        totalDoses += med.frequency;

        const row = `
            <tr>
                <td>${med.name}</td>
                <td>${med.dosage} mg</td>
                <td>${med.frequency}x daily</td>
                <td>${med.duration} days</td>
                <td>${med.category}</td>
            </tr>
        `;

        table.innerHTML += row;
    });

    const summary = document.getElementById("summary");
    if (summary) {
        summary.innerHTML = `
            <strong>${meds.length}</strong> medications &nbsp;|&nbsp;
            <strong>${totalDaily} mg</strong> daily total &nbsp;|&nbsp;
            <strong>${totalDoses}</strong> doses per day
        `;
    }
}

// ========================================
// POST - Insert Medication
// ========================================

async function addMedication() {
    const name = document.getElementById("name").value;
    const dosage = document.getElementById("dosage").value;
    const frequency = document.getElementById("frequency").value;
    const duration = document.getElementById("duration").value;
    const start_date = document.getElementById("start_date").value;
    const category = document.getElementById("category").value;

    if (!name || !dosage || !frequency || !duration || !start_date || !category) {
        alert("Please fill in all fields.");
        return;
    }

    const medication = {
        name: name,
        dosage: dosage,
        frequency: frequency,
        duration: duration,
        start_date: start_date,
        category: category
    };

    const response = await fetch("/api/medications", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(medication)
    });

    const result = await response.json();
    alert(result.message);

    // Redirect to records page
    window.location.href = "records.html";
}

// ========================================
// GET - Load One Medication (for edit page)
// ========================================

async function loadMedicationForEdit() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        alert("No medication selected.");
        window.location.href = "records.html";
        return;
    }

    const response = await fetch(`/api/medications/${id}`);
    const med = await response.json();

    document.getElementById("name").value = med.name;
    document.getElementById("dosage").value = med.dosage;
    document.getElementById("frequency").value = med.frequency;
    document.getElementById("duration").value = med.duration;
    document.getElementById("start_date").value = med.start_date
        ? med.start_date.substring(0, 10)
        : "";
    document.getElementById("category").value = med.category;

    const notice = document.getElementById("notice");
    if (notice) {
        notice.innerHTML = `Editing: <strong>${med.name}</strong> (ID: ${med.id})`;
    }

    document.getElementById("medId").value = med.id;
}

// ========================================
// PUT - Update Medication
// ========================================

async function updateMedication() {
    const id = document.getElementById("medId").value;
    const name = document.getElementById("name").value;
    const dosage = document.getElementById("dosage").value;
    const frequency = document.getElementById("frequency").value;
    const duration = document.getElementById("duration").value;
    const start_date = document.getElementById("start_date").value;
    const category = document.getElementById("category").value;

    const medication = {
        name: name,
        dosage: dosage,
        frequency: frequency,
        duration: duration,
        start_date: start_date,
        category: category
    };

    const response = await fetch(`/api/medications/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(medication)
    });

    const result = await response.json();
    alert(result.message);

    window.location.href = "records.html";
}

// ========================================
// DELETE - Delete Medication
// ========================================

async function deleteMedication(id) {
    if (!confirm("Are you sure you want to delete this medication?")) {
        return;
    }

    const response = await fetch(`/api/medications/${id}`, {
        method: "DELETE"
    });

    const result = await response.json();
    alert(result.message);

    // Reload the current view
    if (document.getElementById("medTable")) {
        if (document.getElementById("summary") &&
            document.querySelector("h2")?.innerText === "Dashboard") {
            loadDashboard();
        } else {
            loadMedications();
        }
    }
}
