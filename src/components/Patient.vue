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
