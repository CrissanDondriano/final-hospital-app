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
    <h1 class="title">Manage Doctors</h1>

    <div class="actions">
        <button v-if="user && user.role === 'admin'" @click="showAddDoctorForm = true" class="btn add-btn">Add Doctor</button>
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
                <template v-if="doctors.length > 0">
                    <tr v-for="doctor in doctors" :key="doctor.id">
                        <td v-if="user.role === 'admin' || doctor.user_id === user.id">{{ doctor.name }}</td>
                        <td v-if="user.role === 'admin' || doctor.user_id === user.id">{{ doctor.email }}</td>
                        <td v-if="user.role === 'admin' || doctor.user_id === user.id">
                            <button @click="editDoctor(doctor)" class="btn edit-btn">Edit</button>
                            <button v-if="user.role === 'admin'" @click="deleteDoctor(doctor.id)" class="btn delete-btn">Delete</button>
                        </td>
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td colspan="3">No data records available.</td>
                    </tr>
                </template>
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
        goToDashboard() {
            this.$router.push('/dashboard');
        },
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
