import Cookie from "js-cookie";

export const timeCheck = (startTime, endTime) => {
    if (new Date() >= new Date(startTime) && new Date() <= new Date(endTime)) {
        return true;
    } else {
        return false;
    }
};

export function base64ToBlob(base64, type = "application/octet-stream") {
    const binStr = atob(base64);
    const len = binStr.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
    }
    return new Blob([arr], { type: type });
}

export const showFile = async (file) => {
    // let base64 = file.data;
    // let blob = base64ToBlob(base64, file.contentType);
    // let url = URL.createObjectURL(blob);
    // window.open(url);
    window.open(process.env.REACT_APP_BACKEND_URL + "/api/uploads/" + file.name);
};

export const getFileUrl = (file) => {
    let base64 = file.data;
    let blob = base64ToBlob(base64, file.contentType);
    let url = URL.createObjectURL(blob);
    return url;
};

export const remainingTime = (endTime) => {
    let now = new Date();
    let end = new Date(endTime);

    // Convert to local time in "Asia/Dhaka" timezone
    now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
    end.toLocaleString("en-US", { timeZone: "Asia/Dhaka" });

    let timeDifference = end - now;

    let seconds = Math.floor((timeDifference / 1000) % 60);
    let minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    let hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);

    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
};

// export const imageSrc = (name) => `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/uploads/${name}?v=${Date.now()}`; // Next iamge
// export const imageSrc = (name) => process.env.NEXT_PUBLIC_BACKEND_URL + '/api/uploads/' + name; // local uploads folder & img tag
export const imageSrc = (name) => process.env.NEXT_PUBLIC_CLOUDINARY_URL + name; // cloudinary

export const cleanObject = (obj) => {
    let newObj = {};

    for (let key in obj) {
        if (obj[key] === "" || obj[key] === undefined || obj[key] === null) {
            continue;
        } else {
            newObj[key] = obj[key];
        }
    }

    return newObj;
};

export const checkReferral = () => {
    const triova_ref = Cookie.get("triova_ref");

    if (triova_ref) {
        return true;
    } else {
        return false;
    }
};

// <object width='100%' height='100%' data='${bufferToDataUrl(file.contentType, file.data)}'></object>

export const toKebabCase = (str) => {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};

export const formatRole = (str) => {
    return str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()); // capitalize first letter
}
