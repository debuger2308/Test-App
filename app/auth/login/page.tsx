"use client"

import { SubmitHandler, useForm } from "react-hook-form";
import "./login.css"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";


type FormValues = {
  email: string
  password: string
}

const Login = () => {

  const [isLoadData, setIsLoadData] = useState(false)
  const [signUpMessage, setSignUpMessage] = useState('')

  const router = useRouter()
  const supabase = createClientComponentClient()

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {

    setIsLoadData(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })
    if (error) {
      setSignUpMessage(error.message)
    }
    else {
      router.refresh()
    }
    setIsLoadData(false)

  }

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isValid
    }
  } = useForm<FormValues>({ mode: "onBlur" })


  return (

    <div className="container">
      <div className="main__login">
        <h1 className="login__title">Log <span className="title-color">In   </span></h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="signup__form">
          <input
            autoComplete="off"
            placeholder="email"
            className="signup__input"
            type="text"
            {...register('email', {
              required: "Required field",
            })}
          />
          <p className="signup__errror-msg" >{errors?.email?.message?.toString()}</p>

          <input
            autoComplete="off"
            placeholder="password"
            className="signup__input"
            type="password"
            {...register('password', {
              required: "Required field",
            })}
          />
          <strong className="signup__errror-msg" >{errors?.password?.message?.toString()}</strong>






          <button className="signup__submit-btn" type="submit" disabled={!isValid} >
            <span className={isLoadData ? "loader loader--active" : "loader"}></span>
            Log In
          </button>
          <strong
            className={signUpMessage === 'Account created'
              ? "signup__message--access"
              : "signup__errror-msg"
            }
          >{signUpMessage}</strong>
        </form>
      </div>
    </div>

  );
}

export default Login;