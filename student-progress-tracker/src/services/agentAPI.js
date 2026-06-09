const API_BASE_URL = 'http://localhost:5000';

class AgentAPI {
  getToken() {
    return localStorage.getItem('agentAuthToken');
  }

  setToken(token) {
    localStorage.setItem('agentAuthToken', token);
  }

  removeToken() {
    localStorage.removeItem('agentAuthToken');
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`[API] ${options.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Check content type before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Backend returned ${contentType} instead of JSON. Check that backend is running on http://localhost:5000`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      console.log(`[API] Response:`, data);
      return data;
    } catch (error) {
      if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
        throw new Error('Backend returned invalid JSON. Ensure backend is running on http://localhost:5000');
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to backend. Ensure server is running on http://localhost:5000');
      }
      console.error('[API] Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async disconnectGmail() {
    return this.request('/auth/disconnect-gmail', {
      method: 'POST',
    });
  }

  async logout() {
    const data = await this.request('/auth/logout', {
      method: 'POST',
    });
    this.removeToken();
    return data;
  }

  // WhatsApp endpoints
  async sendOTP(phoneNumber) {
    return this.request('/otp/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone: phoneNumber }),
    });
  }

  async verifyOTP(phoneNumber, otp) {
    return this.request('/otp/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone: phoneNumber, otp }),
    });
  }
}

export default new AgentAPI();
