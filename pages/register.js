import { getToken } from "next-auth/jwt";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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

export default function Register(){
    const EmailInputRef = useRef()
    const UsernameInputRef = useRef()
    const NameInputRef = useRef()
    const NohpInputRef = useRef()
    const PasswordInputRef = useRef()
    const [isLoading, setIsLoading] = useState()
    const router = useRouter()

    async function submitHandler(event) {
        event.preventDefault()
        
        const emailValue = EmailInputRef.current.value
        const usernameValue = UsernameInputRef.current.value
        const nameValue = NameInputRef.current.value
        const nohpValue = NohpInputRef.current.value
        const passwordValue = PasswordInputRef.current.value
        setIsLoading(true)
        const payload = {
            email: emailValue,
            username: usernameValue,
            name: nameValue,
            nohp: nohpValue,
            password: passwordValue,
        }
        const res = await fetch(`/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        setIsLoading(false)

        const data = await res.json()
        if(data.code == 422){
            toast.error(data.status)
        }

        if(data.code == 201){
            toast.success(data.status)
            router.replace('/login')
        }

        return res
    }

    return(
        <div className="p-5">
            <Toaster/>
            <h1>Login</h1>
            <form onSubmit={submitHandler}>
                <div className="form-group mb-3">
                    <input className="form-control" ref={EmailInputRef} type="email" placeholder="Your Email" required/>
                </div>
                <div className="form-group mb-3">
                    <input className="form-control" ref={UsernameInputRef} type="text" placeholder="Your Username" required/>
                </div>
                <div className="form-group mb-3">
                    <input className="form-control" ref={NameInputRef} type="text" placeholder="Your Name" required/>
                </div>
                <div className="form-group mb-3">
                    <input className="form-control" ref={NohpInputRef} type="text" placeholder="Your Nohp" required/>
                </div>
                <div className="form-group mb-3">
                    <input className="form-control" ref={PasswordInputRef} type="password" placeholder="Your Password"  required/>
                </div>
                {isLoading ? <button className="btn btn-primary" disabled>Loading...</button> : <button className="btn btn-primary">Register</button>}
                <Link href={'/login'}>
                    <a className="btn btn-link">Login</a>
                </Link>
            </form>
        </div>
    )
}