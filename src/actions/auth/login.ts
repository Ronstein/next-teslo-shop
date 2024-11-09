'use server';

import { signIn } from '@/auth.config';
//import { sleep } from '@/utils';
//import { AuthError } from 'next-auth';

// ...

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        //console.log({ formData: Object.fromEntries(formData) });
        //await sleep(2);
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirect: false
        });
        return 'Success';
    } catch (error) {
        //if ((error as any).type === 'CredentialsSignin') {
        return 'CredentialsSignin';
        //}
        //return 'UnknownError';
    }
}

export const login = async (email: string, password: string) => {
    try {
        await signIn('credentials', { email, password });
        return {
            ok: true,
            // message: 'Login correcto'
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Error al iniciar sesión'
        }
    }
}