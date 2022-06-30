import { useSession } from "next-auth/react"

const AccessToken = () =>{
    const {data: session, status} = useSession()

    return <div>Access Token : {session.expires}</div>
} 

export default AccessToken;