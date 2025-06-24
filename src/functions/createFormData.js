
export const createFormData = (obj) => {

    let formData = new FormData()

    for (let i in obj) {
        formData.append(i, obj[i])
    }


    return formData

}