'use client';
import React, { FormEvent, useState } from 'react'

function SellersDashboard() {
    const [formData, setFormData] = useState(null);
    const [userData, setUserData] = useState(null);
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/admin/user/edit");
            console.log(response.data);

        } catch (error) {
            console.log("error occured while changing user type");
        }

    }


    return (

        <div className='w-full min-h-screen bg-white text-black dark:bg-black dark:text-white flex flex-col pt-2 items-center justify-center text-center'>
            <h1 className='text-3xl text-blue-500 mb-2'>Edit Account :</h1>
            <div>
            <form className='w-1/2 bg-white dark:bg-black text-black dark:text-white flex flex-col gap-5 items-center' >
                <input type="text" placeholder='seller email' className='bg-white text-black px-5 py-2' />
                <label >
                    Account Type:
                    <select className='bg-white text-black px-5 py-1 ml-2' >
                        <option value="USER">user</option>
                        <option value="ADMIN">admin</option>
                        <option value="SELLER">seller</option>
                    </select>

                </label>

                <button type="submit" onClick={handleSubmit}>submit</button>

            </form>
            </div>


        </div>
    )
}

export default SellersDashboard