import axios from "axios";


const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class ChurchPlannerApi {
  // the token for interacting with the API will be stored here.
  static token = JSON.parse(localStorage.getItem('token')) || ''

  static async request(endpoint, data = {}, method = 'get') {
    console.debug('API Call:', endpoint, data, method)

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    const url = `${BASE_URL}/${endpoint}`
    const headers = { Authorization: `Bearer ${ChurchPlannerApi.token}` }
    const params = method === 'get' ? data : {}

    try {
      return (await axios({ url, method, data, params, headers })).data
    } catch (err) {
      console.error('API Error:', err.response)
      let message = err.response.data.error.message
      throw Array.isArray(message) ? message : [message]
    }
  }

  // Individual API routes
  // User API Route calls

  static async loginUser(data) {
    let res = await this.request('auth/token', data, 'post')
    return { tkn: res.token, id: res.id }
  }

  static async getAllUsers() {
    let res = await this.request('users')
    return res.users
  }

  static async getUser(id) {
    let res = await this.request(`users/${id}`)
    return res.user
  }

  static async updateUser(data) {
    let res = await this.request(`users/${data.id}`, data, 'patch')
    return res.user
  }

  static async updateUserPermissions(data) {
    let id = data.id
    delete data.id 
    let res = await this.request(`users/${id}/auth`, data, 'patch')
    return res.user
  }

  static async deleteUser(id) {
    let res = await this.request(`users/${id}`, {}, 'delete')
    return res
  }

  static async makeUnavailable(data) {
    let id = data.id
    delete data.id 
    let res = await this.request(`users/${id}/unavailable`, data, 'post')
    return res.msg
  }

  //Department API Route calls
  static async getAllDepts() {
    let res = await this.request('departments')
    return res.departments
  }

  static async getDept(code) {
    let res = await this.request(`departments/${code}`)
    return res.department
  }

  static async deleteDept(code) {
    let res = await this.request(`departments/${code}`, {}, 'delete')
    return res
  }

  //Event API Route calls
  static async createEvent(data, code) {
    let res = await this.request(`departments/${code}/schedule`, data, 'post')
    return res.event
  }
}

export default ChurchPlannerApi