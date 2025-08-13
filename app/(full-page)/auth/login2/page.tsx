'use client';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import type { Page } from '@/types';
import { Checkbox } from 'primereact/checkbox';

const Login: Page = () => {
    const router = useRouter();
    const [checked, setChecked] = useState<boolean>(false);

    const navigateToDashboard = () => {
        router.push('/');
    };

    return (
        <>
            <div className="bg-primary-reverse bg-primary-50">
                <div className="flex justify-content-center">
                    <div className="w-full lg:w-5 h-screen text-center flex justify-content-center align-items-start">
                        <div className="z-5 w-full lg:w-8 px-6 text-center mt-8" style={{ maxWidth: '400px' }}>
                            <div className="w-full flex align-items-center justify-content-center">
                                <img src="/layout/images/pages/login/icon-login.svg" alt="avalon-layout" className="w-6rem" />
                            </div>
                            <h1 className="text-4xl font-light mt-4 text-primary-500">Sign in to Avalon</h1>
                            <p>Welcome, please use the form to sign-in Avalon network</p>
                            <div className="mt-5 text-left">
                                <label htmlFor="username" className="block mb-2" style={{ color: '#4c566a' }}>
                                    Username
                                </label>
                                <span className="p-input-icon-right block">
                                    <i className="pi pi-user"></i>
                                    <InputText id="username" type="text" className="w-full" />
                                </span>

                                <label htmlFor="username" className="block mb-2 mt-3" style={{ color: '#4c566a' }}>
                                    Password
                                </label>
                                <span className="p-input-icon-right block">
                                    <i className="pi pi-lock"></i>
                                    <InputText type="password" v-model="password" className="w-full" />
                                </span>

                                <div className="flex align-items-center justify-content-between mt-5">
                                    <div className="flex align-items-center">
                                        <Checkbox id="rememberme1" onChange={(e) => setChecked(e.checked ?? false)} checked={checked} className="mr-2"></Checkbox>
                                        <label htmlFor="rememberme1">Remember me</label>
                                    </div>
                                </div>

                                <div className="flex align-items-center justify-content-between mt-4 gap-3">
                                    <Button label="Login" onClick={navigateToDashboard} className="w-10rem"></Button>
                                    <a href="#" className="text-primary secondary-button">
                                        Forgot Password?
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="absolute bottom-0 w-screen" viewBox="0 0 1440 250">
                        <defs>
                            <linearGradient id="c" x1="50%" x2="50%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="var(--primary-200)" />
                                <stop offset="99.052%" stopColor="var(--primary-300)" />
                            </linearGradient>
                            <path id="b" d="M0 202c142.333-66.667 249-90 320-70 106.5 30 122 83.5 195 83.5h292c92.642-106.477 190.309-160.81 293-163 102.691-2.19 216.025 47.643 340 149.5v155.5H0V202z" />
                            <filter id="a" width="105.1%" height="124.3%" x="-2.6%" y="-12.8%" filterUnits="objectBoundingBox">
                                <feOffset dy="-2" in="SourceAlpha" result="shadowOffsetOuter1" />
                                <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="12" />
                                <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.11 0" />
                            </filter>
                            <linearGradient id="d" x1="50%" x2="50%" y1="0%" y2="99.142%">
                                <stop offset="0%" stopColor="var(--primary-300)" />
                                <stop offset="100%" stopColor="var(--primary-500)" />
                            </linearGradient>
                        </defs>
                        <g fill="none" fillRule="evenodd">
                            <g transform="translate(0 .5)">
                                <use fill="#000" filter="url(#a)" xlinkHref="#b" />
                                <use fill="url(#c)" xlinkHref="#b" />
                            </g>
                            <path fill="url(#d)" d="M0 107c225.333 61.333 364.333 92 417 92 79 0 194-79.5 293-79.5S914 244 1002 244s156-45 195-68.5c26-15.667 107-74.167 243-175.5v357.5H0V107z" transform="translate(0 .5)" />
                        </g>
                    </svg>
                </div>
            </div>
        </>
    );
};

export default Login;
