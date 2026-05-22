import axios from "axios"

const API_URL = "http://localhost:5000/api"

const handleSeperate = async (audioData) => {
    const response = await axios.post(`${API_URL}/separate`, audioData)
    console.log("yawService response data:", response.data)
    return response.data
}

const yawService = {
    handleSeperate
}

export default yawService 
