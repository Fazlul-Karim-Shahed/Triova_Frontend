

export const getAProfileApi = (id,role) => {

    let data = fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/profile/' + role + '/' + id ).then(response => response.json()).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}
