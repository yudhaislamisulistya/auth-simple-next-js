import { getToken } from "next-auth/jwt";
import { Toaster } from "react-hot-toast";

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
    return(
        <div className="p-5">
            <Toaster/>
            <h1>Login</h1>
            <form onSubmit=''>
                <div className="form-group mb-3">
                    <input className="form-control" ref={emailInputRef} type="email" required/>
                </div>
                <div className="form-group mb-3">
                    <input className="form-control" ref={passwordInputRef} type="password"  required/>
                </div>
                {isLoading ? <button className="btn btn-primary" disabled>Loading...</button> : <button className="btn btn-primary">Login</button>}
            </form>
        </div>
    )
}