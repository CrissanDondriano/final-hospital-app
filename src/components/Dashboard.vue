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
                    <a class="nav-link text-white" href="#">Dashboard</a>
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
                    <li v-if="user">
                        <button @click="logout" class="btn btn-danger">Logout</button>
                    </li>
                </ul>
            </div>
        </div>
        <!-- Collapsible wrapper -->
    </div>
    <!-- Container wrapper -->
</nav>

<main>
    <section v-if="user && user.role === 'admin'" class="section">
        <div class="text-dark text-center py-5 ">
            <h1 class="fw-bold fst-italic text-uppercase">Admin Section</h1>
        </div>
        <div class="card mx-4">
            <div class="card-body">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item ">
                        <router-link to="/patients" class="btn btn-link">Manage Patients</router-link>
                    </li>
                    <li class="list-group-item">
                        <router-link to="/doctors" class="btn btn-link">Manage Doctors</router-link>
                    </li>
                    <li class="list-group-item">
                        <router-link to="/appointments" class="btn btn-link">Manage Appointments</router-link>
                    </li>
                    <li class="list-group-item">
                        <router-link to="/records" class="btn btn-link">Manage Medical Records</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </section>

    <section v-if="user && user.role === 'doctor'" class="section">
        <div class="text-dark text-center py-5">
            <h1 class="fw-bold fst-italic text-uppercase">Doctor Section</h1>
        </div>
        <div class="card  mx-4">
            <div class="card-body">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <router-link to="/patients" class="btn btn-link">View Patients</router-link>
                    </li>
                    <li class="list-group-item">
                        <router-link to="/appointments" class="btn btn-link">Manage Appointments</router-link>
                    </li>
                    <li class="list-group-item">
                        <router-link to="/doctors" class="btn btn-link">Update Profile</router-link>
                    </li>
                    <li class="list-group-item text-decoration-none">
                        <router-link to="/records" class="btn btn-link">Update Medical Records</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </section>
    <section v-if="user && user.role === 'patient'" class="section">
        <div class="text-dark text-center py-5">
            <h2 class="fw-bold fst-italic text-uppercase">Patient Section</h2>
        </div>
        <div class="card  mx-4">
            <div class="card-body">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <router-link to="/appointments" class="btn btn-primary btn-custom">Book Appointments</router-link>
                    </li>
                    <li class="list-group-item">
                        <router-link to="/records" class="btn btn-primary btn-custom">View Medical Records</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</main>
</template>

    
<script>
export default {
    name: 'HospitalManagement',
    computed: {
        user() {
            return this.$store.getters.user;
        },
    },
    created() {
        if (!this.user) {
            this.$store.dispatch('fetchUser').catch(error => {
                console.error('Failed to fetch user:', error);
            });
        }
    },
    methods: {
        logout() {
            this.$store.dispatch('logout');
            this.$router.push('/');
        },
    },
};
</script>

    
<style scoped>
main {
    height: 100vh;
    font-family: Arial, sans-serif;
    background-image: url('https://t3.ftcdn.net/jpg/04/87/69/28/360_F_487692869_V8MZ1hLvhXQZKT50EV8Sh13AkdibGJb3.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

.btn-custom {
    background-color: #007bff;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    transition-duration: 0.4s;
    cursor: pointer;
    border-radius: 12px;
}

.btn-custom:hover {
    background-color: white;
    color: black;
    border: 2px solid #007bff;
}

.section {
    height: 100vh;
    font-family: Arial, sans-serif;
    background-image: url('https://t3.ftcdn.net/jpg/04/87/69/28/360_F_487692869_V8MZ1hLvhXQZKT50EV8Sh13AkdibGJb3.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

.btn-link {
    background-color: #007bff;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    transition-duration: 0.4s;
    cursor: pointer;
    border-radius: 12px;
}

.btn-link:hover {
    background-color: white;
    color: black;
    border: 2px solid #007bff;
}
</style>
