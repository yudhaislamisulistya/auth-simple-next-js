import { getToken } from "next-auth/jwt"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import toast, { Toaster } from "react-hot-toast"

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
      toast.loading('Prosessing...')
      await signOut({redirect: false, callbackUrl: '/'})
      router.replace('/')
      toast.remove()
  }
  let urlAccess = null
  if(session != null){
    urlAccess = session.role == 'admin' ? '/admin' : '/customer'
  }
    return (
    <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
      <Toaster/>
      <header className="masthead mb-auto">
        <div className="inner">
          <h3 className="masthead-brand">Cover</h3>
          <nav className="nav nav-masthead justify-content-center">
            <Link href={'/'}>
              <a className="nav-link">Home</a>
            </Link>
            {session != null ? <Link href={'/profile'}><a className="nav-link">Profile</a></Link> : null}
            {session != null ? <Link href={'/' + urlAccess}><a className="nav-link">Access</a></Link> : null}

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

