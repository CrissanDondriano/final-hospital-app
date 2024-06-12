<template>
<!-- Navbar -->
<nav class="navbar navbar-expand-sm bg-dark">
    <!-- Container wrapper -->
    <div class="container">
        <!-- Collapsible wrapper -->
        <div class="collapse navbar-collapse" id="navbarButtonsExample">
            <!-- Left links -->
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link text-white" @click="goToDashboard">Dashboard</a>
                </li>
            </ul>
            <!-- Left links -->
            <div class="d-flex align-items-center">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item" v-if="user">
                        <a class="nav-link text-white" v-if="user.role === 'doctor'">Dr. {{ user.name }}</a>
                        <a class="nav-link text-white" v-if="user.role === 'admin'">Admin. {{ user.name }}</a>
                        <a class="nav-link text-white" v-if="user.role === 'patient'">Patient. {{ user.name }}</a>
                    </li>
                </ul>
            </div>
        </div>
        <!-- Collapsible wrapper -->
    </div>
    <!-- Container wrapper -->
</nav>
<div class="container-wrapper">
    <!-- Title Page -->
    <h1 class="title">Manage Medical Records</h1>
    <div class="actions">
        <!-- Add Record Button -->
        <button v-if="user.role === 'doctor'" @click="showAddRecordForm = true" class="btn add-btn">Add
            Record</button>
    </div>

    <!-- Adding New Record -->
    <div v-if="showAddRecordForm" class="form-container">
        <h2>Add New Record</h2>
        <form @submit.prevent="addRecord">
            <select id="patientName" class="form-control" v-model="newRecord.patient_id">
                <option value="" disabled>Select Patient</option>
                <option v-for="patient in filteredPatients" :key="patient.id" :value="patient.id">{{ patient.name }}</option>
            </select>
            <input type="text" v-model="newRecord.description" placeholder="Description" required />
            <input type="date" v-model="newRecord.date" required />
            <button type="submit" class="btn submit-btn">Add</button>
        </form>
    </div>

    <!-- table of medical records-->
    <div class="table-container">
        <table class="table-custom">
            <thead>
                <tr>
                    <th>Patient Name</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th v-if="user.role === 'doctor'">Actions</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="records.length > 0">
                    <tr v-for="record in records" :key="record.id">
                        <td v-if="user.role === 'doctor' || user.role === 'admin'  || record.patient_id === user.id">{{ record.patient_name }}</td>
                        <td v-if="user.role === 'doctor' || user.role === 'admin'  || record.patient_id === user.id">{{ record.description }}</td>
                        <td v-if="user.role === 'doctor' || user.role === 'admin'  || record.patient_id === user.id">{{ record.date }}</td>
                        <td v-if="user.role === 'doctor'">
                            <button @click="editRecord(record)" class="btn edit-btn">Edit</button>
                            <button @click="deleteRecord(record.id)" class="btn delete-btn">Delete</button>
                        </td>
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td colspan="4">No records available</td>
                    </tr>
                </template>
            </tbody>

        </table>
    </div>

    <div v-if="showEditRecordForm" class="form-container">
        <h2>{{ currentRecord ? 'Edit Record' : 'View Record' }}</h2>
        <form @submit.prevent="updateRecord">
            <select id="patientName" class="form-control" v-model="currentRecord.patient_name" required>
                <option value="" disabled>Select Patient</option>
                <option v-for="patient in patients" :key="patient.id" :value="patient.name">{{ patient.name }}
                </option>
            </select>
            <input type="text" v-model="currentRecord.description" placeholder="Description" required />
            <input type="date" v-model="currentRecord.date" required />
            <button type="submit" class="btn submit-btn">{{ currentRecord ? 'Update' : 'Close' }}</button>
        </form>
    </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ManageRecords',
    data() {
        return {
            records: [],
            newRecord: {
                patient_id: '',
                description: '',
                date: ''
            },
            currentRecord: {},
            showAddRecordForm: false,
            showEditRecordForm: false
        };
    },
    computed: {
        user() {
            return this.$store.getters.user;
        },
    },
    methods: {
        goToDashboard() {
            this.$router.push('/dashboard');
        },
        async fetchRecords() {
            try {
                const response = await axios.get(this.$store.state.apiUrl + '/records', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                this.patients = response.data.patients;
                this.records = response.data.records;

                // Preprocess the appointments data to map patient_id to patient's id
                const appointmentPatientIds = response.data.appointments.map(appointment => appointment.patient_id);

                // Filter patients based on appointmentPatientIds
                this.filteredPatients = this.patients.filter(patient => appointmentPatientIds.includes(patient.user_id));

            } catch (error) {
                console.error('Failed to fetch records', error);
            }
        },
        // Adding Record
        async addRecord() {
            try {
                this.fetchRecords();
                const response = await axios.post(this.$store.state.apiUrl + '/records', this.newRecord, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                this.records.push(response.data);
                this.newRecord = {
                    patient_id: '',
                    description: '',
                    date: ''
                };
                this.showAddRecordForm = false;
            } catch (error) {
                console.error('Failed to add record', error);
            }
        },
        editRecord(record) {
            this.currentRecord = {
                ...record
            };
            this.showEditRecordForm = true;
        },
        // Updating Record
        async updateRecord() {
            try {
                const response = await axios.put(this.$store.state.apiUrl + `/records/${this.currentRecord.id}`, this.currentRecord, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const index = this.records.findIndex(rec => rec.id === this.currentRecord.id);
                this.records.splice(index, 1, response.data);
                this.showEditRecordForm = false;
                this.currentRecord = {};
            } catch (error) {
                console.error('Failed to update record', error);
            }
        },
        // Deleting Record
        async deleteRecord(id) {
            try {
                await axios.delete(this.$store.state.apiUrl + `/records/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                this.records = this.records.filter(record => record.id !== id);
            } catch (error) {
                console.error('Failed to delete record', error);
            }
        }
    },
    created() {
        this.fetchRecords();
    },
};
</script>

<style scoped>
.container-wrapper {
    background-image: url('https://www.softclinicsoftware.com/wp-content/uploads/2022/05/medical-report-with-medical-equipment.jpg');
    padding: 30px;
    background-color: rgba(255, 255, 255, 0.459);
    /* Semi-transparent background */
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin: 50px auto;
    background-size: cover;
    background-position: center;
    height: 100vh;
    width: 100vh;
}

.title {
    text-align: center;
    font-size: 32px;
    color: #ffffff;
    margin-bottom: 20px;
    font-weight: bold;
    text-shadow: 2px 2px 4px #000000;

}

.actions {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.btn {
    padding: 10px 20px;
    background-color: #4facfe;
    border: none;
    border-radius: 5px;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn:hover {
    background-color: #00f2fe;
}

.add-btn {
    background-color: #28a745;
}

.add-btn:hover {
    background-color: #218838;
}

.load-btn {
    background-color: #007bff;
}

.load-btn:hover {
    background-color: #0069d9;
}

.table-container {
    margin-top: 20px;
    overflow-x: auto;
}

.table-custom {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    border: 1px solid #143a54;
}

.table-custom th,
.table-custom td {
    padding: 12px 15px;
    text-align: center;
    border: 1px solid #413c3c;
}

.table-custom th {
    background-color: #2f74b1;
    color: white;
}

.table-custom tr {
    background-color: #f2f2f2;
}

.table-custom tr:hover {
    background-color: #e4eef8;
}

.form-container {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #547c63;
    border-radius: 5px;
    background-color: rgba(231, 247, 237, 0.8);
    /* Semi-transparent background */
}

form input {
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
}

form button {
    width: 100%;
}

.submit-btn {
    background-color: #28a745;
}

.submit-btn:hover {
    background-color: #218838;
}

.edit-btn {
    background-color: #ffc107;
    margin-left: 10px;
}

.edit-btn:hover {
    background-color: #e0a800;
}

.delete-btn {
    background-color: #dc3545;
    margin-left: 10px;
}

.delete-btn:hover {
    background-color: #c82333;
}
</style>
