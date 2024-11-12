export async function validateAdminCredentials(username, password) {
    const usrname = process.env.Admin
    const pwd = process.env.ADM_PWD 
    console.log(usrname, pwd)
    // ... (Rest of your validation logic)
}