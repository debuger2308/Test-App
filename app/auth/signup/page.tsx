"use client"
import { useForm, SubmitHandler } from "react-hook-form";
import "./signup.css"
import { useRef, useState } from "react";
import supabase from "@/config/supabaseClient";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";


type FormValues = {
  email: string
  nickname: string
  password: string
  cpassword: string
  profileType: string
}


async function addRowToMetaData(formData: FormValues) {
  const { data, error } = await supabase
    .from('UserMetaData')
    .insert([
      { email: formData.email, nickname: formData.nickname, profilType: formData.profileType },
    ])
    .select()
  if (error) {
    return error.details
  }
  else return "ok"
}

const Signup = () => {

  const supabase = createClientComponentClient()


  const [signUpMessage, setSignUpMessage] = useState('')
  const [isLoadData, setIsLoadData] = useState(false)
  const router = useRouter()


  const {
    register,
    formState: {
      errors,
      isValid
    },
    handleSubmit,
    watch,
  } = useForm<FormValues>({ mode: "onBlur" })

  const password = useRef({})
  password.current = watch("password", "")




  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    setSignUpMessage('')
    setIsLoadData(true)

    const isMetaDataAdded = await addRowToMetaData(formData)
    if (isMetaDataAdded === 'ok') {
      const { data, error } = await supabase.auth.signUp(
        {
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              nickname: formData.nickname,
              type: formData.profileType,
            }
          }
        }
      )
      if (error) {
        console.log(error);
        setSignUpMessage(error.message)
      }
      else {
        setSignUpMessage("Account created")
        router.refresh()
      }
    }
    else {
      if (isMetaDataAdded.includes('email')
        && isMetaDataAdded.includes('already')
        && isMetaDataAdded.includes('exist'))
        setSignUpMessage(`User with email - ${formData.email} alredy exist`)

      else if (isMetaDataAdded.includes('nickname')
        && isMetaDataAdded.includes('already')
        && isMetaDataAdded.includes('exist'))
        setSignUpMessage(`nickname - ${formData.nickname} is taken`)
    }

    setIsLoadData(false)

  }



  return (

    <div className="container">

      <div className="main__signup">
        <h1 className="signup__title">Sign <span className="title-color">Up</span></h1>

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
              pattern: {
                value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                message: "Wrong format"
              }
            })}
          />
          <p className="signup__errror-msg" >{errors?.email?.message?.toString()}</p>

          <input
            autoComplete="off"
            placeholder="nickname"
            className="signup__input"
            type="text"
            {...register('nickname', {

              required: "Required field",
              pattern: {
                value: /^[A-Za-z0-9]{5,14}/,
                message: "The password must contain from 5 to 14 characters, only latin letters and numbers"
              }
            })}
          />
          <p className="signup__errror-msg" >{errors?.nickname?.message?.toString()}</p>


          <input
            autoComplete="off"
            placeholder="password"
            className="signup__input"
            type="password"
            {...register('password', {
              required: "Required field",
              pattern: {
                value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}/,
                message: "The password must contain from 6 to 16 characters, only latin letters and big capital letter"
              }
            })}
          />
          <strong className="signup__errror-msg" >{errors?.password?.message?.toString()}</strong>

          <input
            placeholder="confirm password"
            className="signup__input"
            type="password"
            {...register('cpassword', {
              required: "Required field",
              validate: value => value === password.current || "The password do not match"
            })}
          />
          <strong className="signup__errror-msg" >{errors?.cpassword?.message?.toString()}</strong>


          <fieldset className="signup__proftype-fieldset">
            <h6 className="signup__proftype-title">Profile type:</h6>
            <input
              className="signup__radio-btn"
              type="radio"
              id="author"
              value="Author"
              {...register('profileType', {
                required: "Required field",
              })}
            />
            <label htmlFor="author" className="signup__radio-label">Author</label>

            <input
              className="signup__radio-btn"
              type="radio"
              id="commentator"
              value="Commentator"
              {...register('profileType', {
                required: "Required field",
              })}
            />
            <label htmlFor="commentator" className="signup__radio-label">Commentator</label>
            <strong className="signup__errror-msg" >{errors?.profileType?.message?.toString()}</strong>
          </fieldset>




          <button className="signup__submit-btn" type="submit" disabled={!isValid} >
            <span className={isLoadData ? "loader loader--active" : "loader"}></span>
            Sign Up
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

export default Signup;