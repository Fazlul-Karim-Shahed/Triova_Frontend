import React from 'react';
import Styles from './AccessDenied.module.css';
import Link from 'next/link';

export default function AccessDenied() {
    return (
        <div style={{
            backgroundImage: "url(https://getwallpapers.com/wallpaper/full/6/5/4/1420574-hacker-background-1920x1080-laptop.jpg)", backgroundRepeat: "no-repeat", backgroundSize: "contain", backgroundPosition: "center", backgroundAttachment: "fixed"}} className='bg-black h-screen w-screen'>
            <div className={Styles['w3-display-middle']}>
                <h1 className={`${Styles['w3-jumbo']} ${Styles['w3-animate-top']} ${Styles['w3-center']}`}>
                    <code className=' text-red-500'>Access Denied!</code>
                </h1>
                <hr className={`${Styles['w3-border-white']} ${Styles['w3-animate-left']}`} style={{ margin: 'auto', width: '50%' }} />
                <h3 className={`${Styles['w3-center']} ${Styles['w3-animate-right']} text-white text-sm md:text-2xl mt-4`}>You don&apos;t have permission to view this page.</h3>
                {/* <h3 className={`${Styles['w3-center']} ${Styles['w3-animate-zoom']} text-xl md:text-3xl my-4`}>🚫🚫🚫🚫</h3> */}
                <h3 className={`${Styles['w3-center']} ${Styles['w3-animate-zoom']} text-xl md:text-3xl my-4`}>🔒🔒🔒🔒🔒</h3>
                <h6 className={`${Styles['w3-center']} ${Styles['w3-animate-zoom']}`}>
                    <strong className='text-red-500 font-semibold md:text-base text-sm'>Error Code: 403 forbidden</strong> <br />
                    <div className='my-10'>
                        <Link href='/' className=' text-blue-400 font-semibold text-sm underline'>Go Back</Link>
                   </div>
                </h6>
            </div>
        </div>
    );
}

