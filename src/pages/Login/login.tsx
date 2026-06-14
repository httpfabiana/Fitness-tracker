import { AtSignIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext  } from "../../context/AppContext/useApp";
import { Toaster } from "react-hot-toast";


const Login = () => {
   const navigate = useNavigate()

  const [state, setState] = useState("login")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {user, login, signup} = useAppContext()

  useEffect(() => {
    if(user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleSubmit = async(e: React.FormEvent) => {
   e.preventDefault()
   setIsSubmitting(true)
   if(state === "login") {
     await login({email, password})
   }else {
    await signup({username, email, password})
   }
    setIsSubmitting(false)
  }

  return(
   <>
    <Toaster/>
    <main className="login-page-container">
     <form onSubmit={handleSubmit} className="login-form">
      <h2 className="text-3xl font-medium text-gray-900 dark:text-white">
        {state === "login" ? "Entrar" : "Inscreva-se"}
      </h2>
      <p className="mt-2 text-sm text-gray-500/90 dark:text-gray-400">
        {state === "login" ? "Por favor digite email e senha para acessa sua conta."
         : "Por favor insira seus dados para criar uma conta."}
      </p>

      {state !== "login" && (
       <div className="mt-2">
         <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
           Username
         </label>

         <div className="relative mt-1">
           <AtSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5"/>
            <input 
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type="text" 
              placeholder="Enter username" 
              className="login-input" 
              required
            />
         </div>
       </div>
      )}

       <div className="mt-2">
         <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
           Email
         </label>

         <div className="relative mt-1">
           <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5"/>
            <input 
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email" 
              placeholder="Enter your email" 
              className="login-input" 
              required
            />
         </div>
       </div>

        <div className="mt-2">
         <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
           Password
         </label>

         <div className="relative mt-1">
           <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5"/>
            <input 
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? "text" : 'password'} 
              placeholder="Enter your password" 
              className="login-input pr-10" 
              required
            />
            <button type="button" onClick={() => setShowPassword((prev) => !prev)} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
              hover:text-gray-600">
              {showPassword ? <EyeOffIcon size={18}/> : <EyeIcon size={17}/>}
            </button>
         </div>
       </div>

       <button type="submit" disabled={isSubmitting} className="login-button">
        {isSubmitting ? "logging in..." : state === "login" ? "login" : "sign up"}
       </button>

       {state === 'login' 
        ? (
         <p className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
           don't have an account? 
           <button onClick={() => setState('sign-up')} className="ml-1 cursor-pointer text-green-600 hover:underline">
             sign up
            </button>
         </p>
        )
       : (
        <p className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
          Ja tem uma conta? 
           <button onClick={() => setState('login')} className="ml-1 cursor-pointer text-green-600 hover:underline">
             Connect
           </button>
        </p>
       )}
     </form>
    </main>
   </>
  )
}

export default Login;