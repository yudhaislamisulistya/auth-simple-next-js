import { useSession, signIn, signOut, getSession } from "next-auth/react"
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";


async function createUser(email, password) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }

  return data;
}


export default function Home() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const {data: session, status} = useSession();
  const [isLoading, setIsLoading] = useState();
  console.log(session);
  console.log(status);

  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  function logoutHandler(){
    signOut()
  }




  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // optional: Add validation

    if (isLogin) {

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
    } else {
      try {
        const result = await createUser(enteredEmail, enteredPassword);
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <section className="">
      <header className="">
      <Link href='/'>
        <a>
          <div className="">Next Auth</div>
          <div>Status Anda adalah {session != null ? session.user.role : "Tamu"}</div>
        </a>
      </Link>
      <nav>
        <ul>
          {!session ? (
            <li>
              <Link href='/auth'>Login</Link>
            </li>
          ) : null}
          {session ? (
            <li>
              <Link href='/profile'>Profile</Link>
            </li>
          ): null}
          {session ? (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          ): null}
        </ul>
      </nav>
    </header>
      <Toaster/>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      {!session && (
              <form onSubmit={submitHandler}>
              <div className="">
                <label htmlFor='email'>Your Email</label>
                <input type='email' id='email' required ref={emailInputRef} />
              </div>
              <div className="">
                <label htmlFor='password'>Your Password</label>
                <input
                  type='password'
                  id='password'
                  required
                  ref={passwordInputRef}
                />
              </div>
              <div className="">
                <button
                  disabled={isLoading ? true : false}
                  >
                    {isLogin ? 'Login' : 'Create Account'}
                </button>
                <button
                  disabled={isLoading ? true : false}
                  type='button'
                  className=""
                  onClick={switchAuthModeHandler}
                >
                  {isLogin ? 'Create new account' : 'Login with existing account'}
                </button>
              </div>
            </form>
      )}
    </section>
  );
}