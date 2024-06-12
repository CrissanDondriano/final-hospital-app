<template>
<div class="container">
    <h1 class="title">Manage Doctors</h1>

    <div class="actions">
        <button v-if="user && user.role === 'admin'" @click="showAddDoctorForm = true" class="btn add-btn">Add Doctor</button>
        <button @click="fetchDoctors" class="btn load-btn">Load Doctors</button>
    </div>

    <div v-if="showAddDoctorForm" class="form-container">
        <h2>Add New Doctor</h2>
        <form @submit.prevent="addDoctor">
            <input type="text" v-model="newDoctor.name" placeholder="Name" required />
            <input type="email" v-model="newDoctor.email" placeholder="Email" required />
            <button type="submit" class="btn">Add</button>
        </form>
    </div>

    <div class="table-container">
        <table class="table-custom">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th v-if="user.role === 'admin' || user.role === 'doctor'">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="doctor in doctors" :key="doctor.id">
                    <td v-if="user.role === 'admin' || doctor.user_id === user.id">{{ doctor.name }}</td>
                    <td v-if="user.role === 'admin' || doctor.user_id === user.id">{{ doctor.email }}</td>
                    <td v-if="user.role === 'admin' || doctor.user_id === user.id">
                        <button @click="editDoctor(doctor)" class="btn edit-btn">Edit</button>
                        <button @click="deleteDoctor(doctor.id)" class="btn delete-btn">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div v-if="showEditDoctorForm" class="form-container">
        <h2>{{ currentDoctor ? 'Edit Doctor' : 'View Profile' }}</h2>
        <form @submit.prevent="updateDoctor">
            <input type="text" v-model="currentDoctor.name" placeholder="Name" required />
            <input type="email" v-model="currentDoctor.email" placeholder="Email" required />
            <button type="submit" class="btn">{{ currentDoctor ? 'Update' : 'Close' }}</button>
        </form>
    </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ManageDoctors',
    data() {
        return {
            doctors: [],
            newDoctor: {
                name: '',
                email: ''
            },
            currentDoctor: null,
            showAddDoctorForm: false,
            showEditDoctorForm: false,
        };
    },
    computed: {
        user() {
            return this.$store.getters.user;
        },
    },
    methods: {
        async fetchDoctors() {
            try {
                const response = await axios.get(this.$store.state.apiUrl + '/doctors', {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.token}`
                    },
                });
                this.doctors = response.data;
            } catch (error) {
                console.error('Failed to load doctors', error);
            }
        },
        async addDoctor() {
            try {
                await axios.post(this.$store.state.apiUrl + '/doctors', this.newDoctor, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.token}`
                    },
                });
                this.fetchDoctors();
                this.showAddDoctorForm = false;
                this.newDoctor = {
                    name: '',
                    email: ''
                };
            } catch (error) {
                console.error('Failed to add doctor', error);
            }
        },
        editDoctor(doctor) {
            this.currentDoctor = {
                ...doctor
            };
            this.showEditDoctorForm = true;
        },
        async updateDoctor() {
            try {
                if (!this.currentDoctor) {
                    this.showEditDoctorForm = false;
                    return;
                }
                await axios.put(this.$store.state.apiUrl + '/doctors/' + this.currentDoctor.id, this.currentDoctor, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.token}`
                    },
                });
                this.fetchDoctors();
                this.showEditDoctorForm = false;
                this.currentDoctor = null;
            } catch (error) {
                console.error('Failed to update doctor', error);
            }
        },
        async deleteDoctor(id) {
            try {
                await axios.delete(this.$store.state.apiUrl + `/doctors/${id}`, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.token}`
                    },
                });
                this.fetchDoctors();
            } catch (error) {
                console.error('Failed to delete doctor', error);
            }
        },
    },
    created() {
        this.fetchDoctors();
    },
};
</script>
