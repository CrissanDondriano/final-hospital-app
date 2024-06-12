<template>
<div class="container">
    <h1 class="title">Manage Patients</h1>

    <div class="actions">
        <button v-if="user.role === 'admin'" @click="showAddPatientForm = true" class="btn add-btn">Add Patient</button>
        <button @click="fetchPatients" class="btn load-btn">Load Patients</button>
    </div>

    <div v-if="showAddPatientForm" class="form-container">
        <h2>Add New Patient</h2>
        <form @submit.prevent="addPatient">
            <input type="text" v-model="newPatient.name" placeholder="Name" required />
            <input type="email" v-model="newPatient.email" placeholder="Email" required />
            <button type="submit" class="btn">Add</button>
        </form>
    </div>

    <div class="table-container">
        <table class="table-custom">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th v-if="user.role === 'admin'|| user.role === 'doctor'" colspan="2">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="patient in patients" :key="patient.id">
                    <td>{{ patient.name }}</td>
                    <td>{{ patient.email }}</td>
                    <td v-if="user.role === 'admin' || user.role === 'doctor'">
                        <button @click="editPatient(patient)" class="btn edit-btn">Edit</button>
                    </td>
                    <td v-if="user.role === 'admin'">
                        <button @click="deletePatient(patient.id)" class="btn delete-btn">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div v-if="showEditPatientForm" class="form-container">
        <h2>Edit Patient</h2>
        <form @submit.prevent="updatePatient">
            <input type="text" v-model="currentPatient.name" placeholder="Name" required />
            <input type="email" v-model="currentPatient.email" placeholder="Email" required />
            <button type="submit" class="btn">Update</button>
        </form>
    </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ManagePatients',
    data() {
        return {
            patients: [],
            newPatient: {
                name: '',
                email: ''
            },
            currentPatient: {},
            showAddPatientForm: false,
            showEditPatientForm: false
        };
    },
    computed: {
        user() {
            return this.$store.getters.user;
        },
    },
    methods: {
        async fetchPatients() {
            try {
                const response = await axios.get(this.$store.state.apiUrl + '/patients', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                this.patients = response.data;
            } catch (error) {
                console.error('Failed to fetch patients', error);
            }
        },
        async addPatient() {
            try {
                const response = await axios.post(this.$store.state.apiUrl + '/patients', this.newPatient, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                this.patients.push(response.data);
                this.newPatient = {
                    name: '',
                    email: ''
                };
                this.showAddPatientForm = false;
            } catch (error) {
                console.error('Failed to add patient', error);
            }
        },
        editPatient(patient) {
            this.currentPatient = {
                ...patient
            };
            this.showEditPatientForm = true;
        },
        async updatePatient() {
            try {
                const response = await axios.put(this.$store.state.apiUrl + `/patients/${this.currentPatient.id}`, this.currentPatient, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const index = this.patients.findIndex(p => p.id === this.currentPatient.id);
                this.patients.splice(index, 1, response.data);
                this.showEditPatientForm = false;
                this.currentPatient = {};
            } catch (error) {
                console.error('Failed to update patient', error);
            }
        },
        async deletePatient(id) {
            try {
                await axios.delete(this.$store.state.apiUrl + `/patients/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                this.patients = this.patients.filter(patient => patient.id !== id);
            } catch (error) {
                console.error('Failed to delete patient', error);
            }
        }
    }
};
</script>

<style scoped>
.container {
    background-image: url('https://www.softclinicsoftware.com/wp-content/uploads/2022/05/medical-report-with-medical-equipment.jpg');
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

.title span {
    border: 2px solid #333;
    padding: 2px;
    /* Adjust padding as needed */
    margin: 0 2px;
    /* Adjust margin as needed */
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
    background-color: #2870bd;
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

.edit-btn {
    background-color: #ffc107;
}

.edit-btn:hover {
    background-color: #e0a800;
}

.delete-btn {
    background-color: #dc3545;
}

.delete-btn:hover {
    background-color: #c82333;
}
</style>
