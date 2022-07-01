import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export async function getServerSideProps(context){
    const session = await getSession({req: context.req})
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const res = await fetch(`https://auth-simple-next-js.vercel.app/api/profile/` + session.user._id)

    const data = await res.json()


    return {
        props: {
            session: session,
            data: data.data
        },
    };
}

const Profile = ({session, data}) =>{
    const nohpInputRef = useRef()
    const nameInputRef = useRef()
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()

    async function changeProfileHandler(e){
        e.preventDefault()
        setIsLoading(true)
        toast.loading('Process')

        const payload = {
            _id: session.user._id,
            nohp: nohpInputRef.current.value,
            name: nameInputRef.current.value
        }

        const res = await fetch(`/api/profile/change-profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)

        })

        toast.remove()
        setIsLoading(false)

        const data = await res.json()

        if(data.status == "success"){
            toast.success(data.success)
            router.push('/profile')
        }else if(data.status == "error"){
            toast.error(data.error)
        }
    }

    return(
        <div className="container p-5">
            <Toaster/>
            <div className="row">
                <div className="col-md-6 m-auto">
                    <form onSubmit={changeProfileHandler}>
                        <div className="form-group text-left">
                            <label htmlFor="">Email</label>
                            <input readOnly type="email" value={session.user.email} className="form-control" aria-describedby="helpId"/>
                        </div>
                        <div className="form-group text-left">
                            <label htmlFor="">Username</label>
                            <input readOnly type="text" value={session.user.username} className="form-control" aria-describedby="helpId"/>
                        </div>
                        <div className="form-group text-left">
                            <label htmlFor="">Nomor Handphone</label>
                            <input type="text" className="form-control" ref={nohpInputRef} placeholder={data.nohp} required aria-describedby="helpId"/>
                        </div>
                        <div className="form-group text-left">
                            <label htmlFor="">Name</label>
                            <input type="text" className="form-control" ref={nameInputRef} placeholder={data.name} aria-describedby="helpId"/>
                        </div>
                        <div className="form-group text-left">
                            {!isLoading ? <button className="btn btn-primary">Change</button> : <button disabled className="btn btn-secondary">Loading...</button>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile;