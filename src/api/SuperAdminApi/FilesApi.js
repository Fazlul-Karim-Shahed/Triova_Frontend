import axios from "axios";

export const getAllFilesApi = () => {
    let data = fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/files/")
        .then((response) => response.json())
        .catch((error) => {
            return { message: `Something went wrong. - (${error.message}). Try again`, error: true };
        });

    return data;
};

export const deleteFileApi = (name) => {

    let data = axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/files/' + name, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
        }
    }).then(response => response.data).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data


}