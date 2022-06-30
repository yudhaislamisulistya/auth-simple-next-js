import { getToken } from "next-auth/jwt";
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

export default function register({session}){
    const emailInputRef = useRef()
    const usernameInputRef = useRef()
    const nameInputRef = useRef()
    const nohpInputRef = useRef()
    const passwordInputRef = useRef()
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function submitHandler(event) {
        event.preventDefault()
        
        const emailValue = emailInputRef.current.value
        const usernameValue = usernameInputRef.current.value
        const nameValue = nameInputRef.current.value
        const nohpValue = nohpInputRef.current.value
        const passwordValue = passwordInputRef.current.value
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
                    <input className="form-control" ref={emailInputRef} type="email" placeholder="Your Email" required/>
                </div>
                <div className="form-group mb-3">
                    <input className="form-control" ref={usernameInputRef} type="text" placeholder="Your Username" required/>
                </div>
                <div className="form-group mb-3">
                    <input className="form-control" ref={nameInputRef} type="text" placeholder="Your Name" required/>
                </div>
                <div className="form-group mb-3">
                    <input className="form-control" ref={nohpInputRef} type="text" placeholder="Your Nohp" required/>
                </div>
                <div className="form-group mb-3">
                    <input className="form-control" ref={passwordInputRef} type="password" placeholder="Your Password"  required/>
                </div>
                {isLoading ? <button className="btn btn-primary" disabled>Loading...</button> : <button className="btn btn-primary">Register</button>}
            </form>
        </div>
    )
}