<template>
    <div class="page-container">
      <h1 class="welcome-title">Welcome to Laravel Hospital</h1>
      <div class="login-container">
        <div class="login-card">
          <h4>Enter your Email and Password</h4>
          <div class="divider"></div>
          <form @submit.prevent="loginUser" class="form">
            <div class="form-group">
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="email"
                placeholder="Enter email"
                required
                @input="clearErrors"
              />
              <small class="text-danger" v-if="errors">{{ errors }}</small>
            </div>
            <div class="form-group">
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="password"
                placeholder="Password"
                required
                @input="clearErrors"
              />
            </div>
            <button type="submit" class="btn">Login</button>
          </form>
          <p class="register-link">
            Don't have an account? <router-link to="/register">Register here!</router-link>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        email: '',
        password: '',
        errors: null
      };
    },
    methods: {
      async loginUser() {
        try {
          const response = await axios.post(this.$store.state.apiUrl + '/login', {
            email: this.email,
            password: this.password
          });
          if (response.status === 201) {
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('userId', response.data.user_id);
            this.$store.commit('SET_TOKEN', response.data.access_token);
            await this.$store.dispatch('fetchUser');
            this.$router.push('/dashboard');
          }
        } catch (error) {
          this.errors = error.response.data.message;
        }
      },
      clearErrors() {
        this.errors = null;
      }
    }
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
  
  .page-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background: url('https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') center/cover no-repeat;
    background-size: cover;
    font-family: 'Roboto', sans-serif;
    text-align: center;
  }
  
  .welcome-title {
    font-size: 60px;
    margin-bottom: 2rem;
    font-weight: 1000;
    color: rgb(110, 149, 221);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
    margin-top: 1rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: transform 0.5s ease-out;
}

.welcome-title:hover {
  transform: scale(1.1);
}
  
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 400px;
  }
  
  .login-card {
    background: rgba(255, 255, 255, 0.9);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    text-align: center;
    backdrop-filter: blur(10px);
  }
  
  h4 {
    margin-bottom: 1.5rem;
    font-weight: 700;
    color: #333;
    font-size: 1.25rem;
  }
  
  .divider {
    height: 2px;
    background-color: #4facfe;
    margin: 1.5rem 0;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  
  .form-control:focus {
    border-color: #4facfe;
    box-shadow: 0 0 0 0.2rem rgba(79, 172, 254, 0.25);
  }
  
  .form-control:hover {
    border-color: #00f2fe;
  }
  
  .btn {
    width: 100%;
    padding: 0.75rem;
    background-color: #4facfe;
    border: none;
    border-radius: 5px;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .btn:hover {
    background-color: #00f2fe;
    transform: scale(1.05);
  }
  
  .register-link {
    margin-top: 1.5rem;
    font-size: 0.9rem;
  }
  
  .register-link a {
    color: #4facfe;
    text-decoration: none;
    font-weight: 700;
    transition: color 0.3s, text-decoration 0.3s;
  }
  
  .register-link a:hover {
    color: #00f2fe;
    text-decoration: underline;
  }
  
  .text-danger {
    font-size: 0.85rem;
    color: #e74c3c;
  }
  </style>