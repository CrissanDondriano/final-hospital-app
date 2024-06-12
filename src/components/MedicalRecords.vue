<template>
    <br>
    <div class="container">
        <h1 class="title">Manage Medical Records</h1>

        <div class="actions">
            <button v-if="user.role === 'doctor'" @click="showAddRecordForm = true" class="btn add-btn">Add
                Record</button>
            <button @click="fetchRecords" class="btn load-btn">Load Records</button>
        </div>

        <div v-if="showAddRecordForm" class="form-container">
            <h2>Add New Record</h2>
            <form @submit.prevent="addRecord">
                <select id="patientName" class="form-control" v-model="newRecord.patient_name" required>
                    <option value="" disabled>Select Patient</option>
                    <option v-for="patient in patients" :key="patient.id" :value="patient.name">{{ patient.name }}
                    </option>
                </select>
                <input type="text" v-model="newRecord.description" placeholder="Description" required />
                <input type="date" v-model="newRecord.date" required />
                <button type="submit" class="btn submit-btn">Add</button>
            </form>
        </div>

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
                    <tr v-for="record in records" :key="record.id">
                        <td v-if="user.role === 'doctor' || record.patient_id === user.id">{{ record.patient_name }}
                        </td>
                        <td v-if="user.role === 'doctor' || record.patient_id === user.id">{{ record.description }}
                        </td>
                        <td v-if="user.role === 'doctor' || record.patient_id === user.id">{{ record.date }}</td>
                        <td v-if="user.role === 'doctor'">
                            <button @click="editRecord(record)" class="btn edit-btn">Edit</button>
                            <button @click="deleteRecord(record.id)" class="btn delete-btn">Delete</button>
                        </td>
                    </tr>
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
                patient_name: '',
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
        async fetchRecords() {
            try {
                const response = await axios.get(this.$store.state.apiUrl + '/records', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                this.patients = response.data.patients;
                this.records = response.data.records;
            } catch (error) {
                console.error('Failed to fetch records', error);
            }
        },
        async addRecord() {
            try {
                const response = await axios.post(this.$store.state.apiUrl + '/records', this.newRecord, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                this.records.push(response.data);
                this.newRecord = {
                    patient_name: '',
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
    }
};
</script>

<style scoped>
.container {
    background-image: url('https://img.freepik.com/free-photo/flat-lay-medical-objects-composition-with-empty-clipboard_23-2148502930.jpg');
    padding: 30px;
    background-color: rgba(255, 255, 255, 0.459);
    /* Semi-transparent background */
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 50px auto;
    background-size: cover;
    background-position: center;
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