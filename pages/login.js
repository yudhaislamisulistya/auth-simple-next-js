import { getToken } from "next-auth/jwt"
import { signIn } from "next-auth/react"
import Link from "next/link"
import {  useRouter } from "next/router"
import { useRef, useState } from "react"
import toast, { Toaster } from "react-hot-toast"

export async function getServerSideProps(ctx) {
    const session  = await getToken({ req: ctx.req, secret: process.env.NEXTAUTH_SECRET })
    if(session){
        return {
            redirect: {
                permanent: true,
                destination: "/",
            },
            props:{},
        };
    }else{
        return {
            props:{},
        };
    }
}


export default function Login(){

    const emailInputRef = useRef()
    const passwordInputRef = useRef()
    const [isLoading, setIsLoading] = useState()
    const router = useRouter()

    async function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // optional: Add validation

        toast.loading('Loading...');
        setIsLoading(true)
        const result = await signIn('credentials', {
            redirect: false,
            email: enteredEmail,
            password: enteredPassword,
        });
        toast.remove()
        setIsLoading(false)

        if(result.error == 'no_user_found') toast.error('User Not Found.')
        if(result.error == 'invalid_password') toast.error('Invalid Password.')

        if (!result.error) {
            router.replace('/');
        }
    }

    return(
        <div className="p-5">
            <Toaster/>
            <h1>Login</h1>
            <form onSubmit={submitHandler}>
                <div className="form-group mb-3">
                    <input className="form-control" ref={emailInputRef} type="email" required/>
                </div>
                <div className="form-group mb-3">
                    <input className="form-control" ref={passwordInputRef} type="password"  required/>
                </div>
                {isLoading ? <button className="btn btn-primary" disabled>Loading...</button> : <button className="btn btn-primary">Login</button>}
                <Link href={'/register'}>
                    <a className="btn btn-link">Register</a>
                </Link>
            </form>
        </div>
    )
}