<template>
    <div class="container">
        <h1 class="title">Manage Appointments</h1>

        <div class="actions">
            <button v-if="user.role === 'patient'" @click="showAddAppointmentForm = true" class="btn add-btn">Book Appointment</button>
            <button @click="fetchAppointments" class="btn load-btn">Load Appointments</button>
        </div>

        <div v-if="showAddAppointmentForm" class="form-container">
            <h2>Book New Appointment</h2>
            <form @submit.prevent="addAppointment">
                <select id="doctorName" class="form-control" v-model="newAppointment.doctor_name" required>
                    <option value="" disabled>Select Doctor</option>
                    <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.name">{{ doctor.name }}</option>
                </select>
                <select id="patientName" class="form-control" v-model="newAppointment.patient_name" required>
                    <option value="" disabled>Select Patient</option>
                    <option v-for="patient in patients" :key="patient.id" :value="patient.name">{{ patient.name }}</option>
                </select>
                <input type="date" v-model="newAppointment.date" placeholder="Date" required />
                <button type="submit" class="btn submit-btn">Book</button>
            </form>
        </div>

        <div class="table-container">
            <table class="table-custom">
                <thead>
                    <tr>
                        <th>Doctor Name</th>
                        <th>Patient Name</th>
                        <th>Date</th>
                        <th v-if="user.role == 'doctor'">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="appointment in appointments" :key="appointment.id">
                        <td v-if="appointment.doctor_id == user.id || appointment.patient_id == user.id ">{{ appointment.doctor_name }}</td>
                        <td v-if="appointment.doctor_id == user.id || appointment.patient_id == user.id ">{{ appointment.patient_name }}</td>
                        <td v-if="appointment.doctor_id == user.id || appointment.patient_id == user.id ">{{ appointment.date }}</td>
                        <td v-if="appointment.doctor_id == user.id || appointment.patient_id == user.id ">
                            <button @click="editAppointment(appointment)" class="btn edit-btn">Edit</button>
                            <button @click="deleteAppointment(appointment.id)" class="btn delete-btn">Cancel</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="showEditAppointmentForm" class="form-container">
            <h2>{{ currentAppointment ? 'Edit Appointment' : 'View Appointment' }}</h2>
            <form @submit.prevent="updateAppointment">
                <select id="doctorName" class="form-control" v-model="currentAppointment.doctor_name" required>
                    <option value="" disabled>Select Doctor</option>
                    <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.name">{{ doctor.name }}</option>
                </select>
                <select id="patientName" class="form-control" v-model="currentAppointment.patient_name" required>
                    <option value="" disabled>Select Patient</option>
                    <option v-for="patient in patients" :key="patient.id" :value="patient.name">{{ patient.name }}</option>
                </select>
                <input type="date" v-model="currentAppointment.date" placeholder="Date" required />
                <button type="submit" class="btn submit-btn">{{ currentAppointment ? 'Update' : 'Close' }}</button>
            </form>
        </div>
    </div>
    </template>

    <script>
    import axios from 'axios';

    export default {
        name: 'ManageAppointments',
        data() {
            return {
                appointments: [],
                newAppointment: {
                    doctor_name: '',
                    patient_name: '',
                    date: ''
                },
                currentAppointment: {},
                showAddAppointmentForm: false,
                showEditAppointmentForm: false
            };
        },
        computed: {
            user() {
                return this.$store.getters.user;
            },
        },
        methods: {
            async fetchAppointments() {
                try {
                    const response = await axios.get(this.$store.state.apiUrl + '/appointments', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    this.doctors = response.data.doctors;
                    this.patients = response.data.patients;
                    this.appointments = response.data.appointments;
                } catch (error) {
                    console.error('Failed to fetch appointments', error);
                }
            },
            async addAppointment() {
                try {
                    this.newAppointment.patient_name = this.user.name; // Assigning patient name based on the logged-in user
                    const response = await axios.post(this.$store.state.apiUrl + '/appointments', this.newAppointment, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    this.appointments.push(response.data);
                    this.newAppointment = {
                        doctor_name: '',
                        patient_name: '',
                        date: ''
                    };
                    this.showAddAppointmentForm = false;
                } catch (error) {
                    console.error('Failed to book appointment', error);
                }
            },
            editAppointment(appointment) {
                this.currentAppointment = {
                    ...appointment
                };
                this.showEditAppointmentForm = true;
            },
            async updateAppointment() {
                try {
                    if (!this.currentAppointment) {
                        this.showEditAppointmentForm = false;
                        return;
                    }
                    const response = await axios.put(this.$store.state.apiUrl + `/appointments/${this.currentAppointment.id}`, this.currentAppointment, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    const index = this.appointments.findIndex(app => app.id === this.currentAppointment.id);
                    this.appointments.splice(index, 1, response.data);
                    this.showEditAppointmentForm = false;
                    this.currentAppointment = {};
                } catch (error) {
                    console.error('Failed to update appointment', error);
                }
            },
            async deleteAppointment(id) {
                try {
                    await axios.delete(this.$store.state.apiUrl + `/appointments/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    this.appointments = this.appointments.filter(appointment => appointment.id !== id);
                } catch (error) {
                    console.error('Failed to delete appointment', error);
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

    .submit-btn {
        background-color: #40694a;
    }

    .submit-btn:hover {
        background-color: #218838;
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
