import { ArrowLeft, ArrowRight, PersonStanding, ScaleIcon, Target, User, } from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAppContext } from "../../context/AppContext/useApp";
import type { ProfileFormData } from "../../types";
import { ageRanges, goalOptions } from "../../assets/assets";
import Slider from "../../components/ui/Slide";
import api from "../../configs/api";

const Onboarding = () => {

   const [step, setStep] = useState(1)
   const {user,  setOnboardingCompleted, fetchUser} = useAppContext()
   const [formdata, setFormData] = useState<ProfileFormData>({
    age: 0,
    weight: 0,
    height: 0,
    goal: 'maintain',
    dailyCalorieIntake: 2000,
    dailyCalorieBurn: 400
   })

   const totalSteps = 3;

   function updateField(field: keyof ProfileFormData, value: string | number){
     setFormData({...formdata, [field]: value})
   }

   async function handleNext() {
    if(step === 1) {
     if(!formdata.age || 
      Number(formdata.age) < 13 || 
      Number(formdata.age) > 120
      ) {
       return toast("Age is mandatory")
      }
    }
    if(step < totalSteps) {
      setStep(step + 1)
    }else{
      const userData = {
        ...formdata,
        age: formdata.age,
        weight: formdata.weight,
        height: formdata.height ? formdata.height : null,
        createdAt: new Date().toISOString()
      }
      localStorage.setItem("fitnessUser", JSON.stringify(userData));

       try{
        await api.put(`/api/users/${user?.id}`, userData)
         toast.success("Profile updated successfully")
         setOnboardingCompleted(true)
         await fetchUser(user?.token || "")

       }catch(error: any) {
         toast.error(error.message)
       }
    }
   }

  return(
   <>
    <Toaster/>
    <div className="onboarding-container">
     <div className="p-6 pt-12 onboarding-wrapper">

     <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
       <PersonStanding className="w-6 h-6 text-white"/>
      </div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
        FitTrack
      </h1>
     </div>

      <p className="text-slate-500 dark:text-slate-400 mt-4">
        Let's personalize your experience
      </p>
     </div>

     <div className="px-6 mb-8 onboarding-wrapper">
      <div className="flex gap-2 max-w-2xl">
       {[1,2,3].map((s) => (
        <div key={s} 
        className={`h-1.5 flex-1 rounded-full transition-all duration-300 
          ${s <= step ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
        }`}
        />
       ))}
      </div>
      <p className="text-sm text-slate-400 mt-3">
        Step {step} of {totalSteps}
      </p>
     </div>

     <div className="flex-1 px-6 onboarding-wrapper">
      {step === 1 && (
        <div className="space-y-6">
         <div className="flex items-center gap-4 mb-8">

           <div className="size-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/90
            border border-emerald-100 dark:border-emerald-800 flex items-center justify-center"> 
            <User className="size-6 text-emerald-600 dark:text-emerald-400"/> 
          </div>

           <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              How old are you?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              This helps us calculate your needs
            </p>
           </div>
         </div>

         <div className="mt-2">
          <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
           Age
          </label>

          <div className="relative mt-2">
           <input
            type="number"
            className="w-full max-w-xs h-12 rounded-lg px-2 border border-white bg-transparent text-white placeholder:text-slate-400"
            placeholder="enter your age"
            min={13}
            max={120}
            value={formdata.age || ""}
            onChange={(e) => updateField("age", Number(e.target.value))}
         />
          </div>
         </div>
        </div>
      )}

       {step === 2 && (
        <div className="space-y-6 onboarding-wrapper">
         <div className="flex items-center gap-4 mb-8">

           <div className="size-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/90
            border border-emerald-100 dark:border-emerald-800 flex items-center justify-center"> 
            <ScaleIcon className="size-6 text-emerald-600 dark:text-emerald-400"/> 
           </div>

           <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              Your measurements
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Help us track your progress
            </p>
           </div>
         </div>

         <div className="flex flex-col gap-4 max-w-2xl">
          <div className="flex flex-col gap-2">
           <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
              Weight (Kg)
            </label>

           <input
            type="number"
            className="w-full max-w-xs h-12 rounded-lg border px-2 border-white bg-transparent text-white placeholder:text-slate-400"
            placeholder="enter your weight"
            min={20}
            max={300}
            value={formdata.weight || ""}
            onChange={(e) => updateField("weight", Number(e.target.value))}
            required
           />
           </div>

           <div className="flex flex-col gap-2">
           <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
              Height 
            </label>

           <input
            type="number"
            className="w-full max-w-xs h-12 rounded-lg border  px-2 border-white bg-transparent text-white placeholder:text-slate-400"
            placeholder="enter your height"
            min={100}
            max={250}
            value={formdata.height || ""}
            onChange={(e) => updateField("height", Number(e.target.value))}
           />
           </div>
          </div>
         </div>
      )}

       {step === 3 && (
        <div className="space-y-6 onboarding-wrapper">
         <div className="flex items-center gap-4 mb-8">

           <div className="size-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/90
            border border-emerald-100 dark:border-emerald-800 flex items-center justify-center"> 
            <Target className="size-6 text-emerald-600 dark:text-emerald-400"/> 
           </div>

           <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              What are your goals?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
             We will adapt your experience
            </p>
           </div>
         </div>

         <div className="space-y-4 max-w-lg">
           {goalOptions.map((option) => (
             <button key={option.value} 
             onClick={() => {
              const age = Number(formdata.age)
              let found = ageRanges[ageRanges.length - 1]

              for (const faixa of ageRanges) {
               if(age <= faixa.max) {
                found = faixa;
                break
               }
              }

              let intake = found.maintain;
              let burn = found.burn;

              if(option.value === "lose") {
                intake = intake - 400;
                burn = burn + 100;
              }

              if(option.value === "gain") {
                intake = intake + 500;
                burn = burn - 100;
              }

              setFormData({
                ...formdata,
                goal: option.value as "lose" | "maintain" | "gain",
                dailyCalorieIntake: intake,
                dailyCalorieBurn: burn
              })
             }}
             className={`onboarding-option-btn ${formdata.goal === option.value && 
               'ring-2 ring-emerald-500'
             }`}>
              <span className="text-base text-slate-700 dark:text-slate-200">
                {option.label}
              </span>
             </button>
           ))}
         </div>
         <div className="border-t border-slate-200 dark:border-slate-700 my-6 max-w-lg"></div>

         <div className="space-y-8 max-w-lg">
          <h3 className="text-md font-medium text-slate-800 dark:text-white mb-4">
            Daily goals
          </h3>
           
           <div className="space-y-6">
            <Slider
             label="Daily calorie Intake"
             min={120}
             max={4000}
             step={50}
             value={formdata.dailyCalorieIntake}
             onChange={(e) => updateField("dailyCalorieIntake", e)}
             unit="kcal"
             infoText="Total de calorias que voce planeja consumir no dia"
             />
             <Slider
             label="Burn daily Calories"
             min={100}
             max={2000}
             step={50}
             value={formdata.dailyCalorieBurn}
             onChange={(e) => updateField("dailyCalorieIntake", e)}
             unit="kcal"
             infoText="Total de calorias que voce planeja consumir no dia"
            />
           </div>
         </div>
        </div>
      )}
     </div>

     <div className="p-6 pb-10 onboarding-wrapper">
      <div className="flex gap-3 lg:justify-end">
        {step > 1 && (
         <button onClick={() => setStep(step > 1 ? step - 1 : 1)} className="max-lg:flex-1">
          <span className="flex items-center justify-center gap-2 bg-gray-600 rounded-md py-2 px-3 cursor-pointer">
            <ArrowLeft className="w-5 h-5"/>
             Back
          </span>
         </button>  
        )}
        <button onClick={() => handleNext()} className="max-lg:flex-1">
          <span className="flex items-center justify-center gap-2 bg-green-500 rounded-md py-2 px-3 cursor-pointer">
           {step === totalSteps ? "Start" : "Continue"}
           <ArrowRight className="w-5 h-5"/>
          </span>
        </button>
      </div>
     </div>
    </div>
   </>
  )
}

export default Onboarding;