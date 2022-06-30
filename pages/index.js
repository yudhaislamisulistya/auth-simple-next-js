import { getToken } from "next-auth/jwt"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"

export async function getServerSideProps(context) {
  const session = await getToken({req: context.req, secret: process.env.NEXTAUTH_SECRET})
  return {
    props: {
      session: session
    }
  }
}

export default function Index({session}){
  const router = useRouter()
  async function logoutHandler(){
      await signOut({redirect: false, callbackUrl: '/'})
      router.replace('/')

  }
    return (
    <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
      <header className="masthead mb-auto">
        <div className="inner">
          <h3 className="masthead-brand">Cover</h3>
          <nav className="nav nav-masthead justify-content-center">
            <a className="nav-link" href="#">Home</a>
            <a className="nav-link" href="#">Features</a>
            <a className="nav-link" href="#">Contact</a>
          </nav>
        </div>
      </header>
    
      <main role="main" className="inner cover">
        <h1 className="cover-heading">Selamat Datang yah {session != null ? session.name : "Tamu"}.</h1>
        <p className="lead">Learning Auth with Next Auth + MongoDB.</p>
        <p className="lead">
          {session == null ?<Link href={'/login'}><a className="btn btn-lg btn-secondary">Login</a></Link> : <button className="btn btn-lg btn-danger" onClick={logoutHandler}>Logout</button>}
        </p>
      </main>
    </div>
  )
}

