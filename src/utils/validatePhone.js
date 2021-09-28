export default function validatePhone(phone) {
    const re = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    return re.test(phone);
}