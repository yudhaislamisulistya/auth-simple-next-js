import { getSession } from "next-auth/react";
import AccessToken from "../components/access_token";

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

    return {
        props: { session },
    };
}

const Profile = ({session}) =>{
    console.log(session.user.role);
    return(
        <div>
            <AccessToken/>
        </div>
    )
}

export default Profile;