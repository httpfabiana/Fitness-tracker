import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext/useApp";
import type { ProfileFormData, UserData } from "../../types";
import Card from "../../components/ui/Card";
import { Calendar, LogOutIcon, Scale, Target, User } from "lucide-react";
import { goalLabels, goalOptions } from "../../assets/assets";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import mockApi from "../../assets/mockApi";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";

const Profile = () => {

  const {user, logout, fetchUser, allFoodLogs, allActivityLogs} = useAppContext()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({age: 0, weight: 0, height: 0, goal: 'maintain', 
    dailyCalorieIntake: 2000, dailyCalorieBurn: 400
  })
  const fetchUserData = () => {
    if(user){
      setFormData({
       age: user?.age || 0,
       weight: user?.weight || 0,
       height: user?.height || 0,
       goal: user?.goal || 'maintain',
       dailyCalorieIntake: user?.dailyCalorieIntake || 2000,
       dailyCalorieBurn: user?.dailyCalorieBurn || 400
      })
    }
  }

  useEffect(() => {
    (() => {
      fetchUserData()
    })()
  }, [user])

  if(!user || !formData) return null;

   async function handleSave(){
     try{
      const update: Partial<UserData> = {
        ...formData,
        goal: formData.goal as 'lose' | 'maintain' | 'gain'
      };
      await mockApi.user.update(user?.id || '', update)
      await fetchUser(user?.token || '')
      toast.success('Perfil atualizado com sucesso')

     }catch(error: any) {
       console.log(error)
       toast.error(error?.message || 'Falha ao autualizar perfil')
     }
     setIsEditing(false)
   }

   function getStats() {
    const totalFoodEntries = allFoodLogs?.length || 0;
    const totalActivities = allActivityLogs?.length || 0;

    return {totalActivities, totalFoodEntries}
   }

   const stats = getStats()


  return(
   <div className="page-container">
    <div className="page-header">
    <h1 className="text-2xl font-bold text-slate-800 dark:text-white ">
      Profile
    </h1>
    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
      Manage your settings
    </p>
    </div>

    <div className="profile-content">
     <Card>
      <div className="flex items-center gap-4 mb-6">
       <div className="size-12 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
        <User className="size-6 text-white"/>
       </div>

       <div>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
          Your profile
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
         Member since {new Date(user?.createdAt || "").toLocaleDateString()}
        </p>
       </div>
      </div>

      {isEditing ? (
       <div className="space-y-4">
        <Input
         label="idade"
         type="number"
         value={formData.age}
         onChange={(idade) => setFormData({...formData, age: Number(idade)})}
         min={13}
         max={120}
        />
         <Input
         label="peso"
         type="number"
         value={formData.weight}
         onChange={(peso) => setFormData({...formData, age: Number(peso)})}
         min={20}
         max={300}
        />
         <Input
         label="altura"
         type="number"
         value={formData.height}
         onChange={(altura) => setFormData({...formData, age: Number(altura)})}
         min={100}
         max={250}
        />

        <Select
         label="metas"
         value={formData.goal as string}
         onChange={(meta)=> setFormData({...formData, goal: meta as 'lose' | 'maintain' | 'gain'})}
         options={goalOptions}
        />
        <div className="flex  gap-3 pt-2">

         <button className="flex-1" onClick={()=> {
           setIsEditing(false);
           setFormData({
            age: Number(user.age),
            weight: Number(user.weight),
            height: Number(user.height),
            goal: user.goal || '',
            dailyCalorieIntake: user.dailyCalorieIntake || 2000,
            dailyCalorieBurn: user.dailyCalorieBurn || 400
           })
         }}>
           Cancelar
         </button>
         <Button onClick={handleSave} className="flex-1">
           Save changes
         </Button>

        </div>
       </div>
      ) : (
       <>
       <div className="space-y-4">
        <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200">
         <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
          <Calendar className="size-4.5 text-blue-600 dark:text-blue-300"/>
         </div>

         <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Age</p>
          <p className="font-semibold text-slate-800 dark:text-white">
           {user.age} years
           </p>
         </div>
         </div>

         <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200">
          <div className="size-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
           <Scale className="size-4.5 text-purple-600 dark:text-purple-400"/>
         </div>

         <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Weight</p>
          <p className="font-semibold text-slate-800 dark:text-white">
           {user.weight} kg
           </p>
         </div>
        </div>

        {user.height !== 0 && (
         <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200">
          <div className="size-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
           <User className="size-4.5 text-green-600 dark:text-green-400"/>
         </div>

         <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Height</p>
          <p className="font-semibold text-slate-800 dark:text-white">
           {user.height} cm
           </p>
         </div>
        </div>
        )}

         <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200">
          <div className="size-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
           <Target className="size-4.5 text-orange-600 dark:text-orange-400"/>
         </div>

         <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Goal</p>
          <p className="font-semibold text-slate-800 dark:text-white">
           {goalLabels[user?.goal || 'gain']} 
           </p>
         </div>
        </div>

       </div>
        <Button onClick={() => setIsEditing(true)} className="w-full mt-4">
          Edit profile
        </Button>
       </>
      )}
     </Card>
     <div className="space-y-4">
      <Card>
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Suas estatísticas</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
             {stats.totalFoodEntries}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              food
            </p>
          </div>

           <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalActivities}
           </p>
           <p className="text-sm text-slate-500 dark:text-slate-400">
             Activity
          </p>
        </div>
        </div>
      </Card>
       <Button onClick={logout} className="w-full ring bg-red-500 ring-red-500 hover:ring-2">
         <LogOutIcon className="size-4"/>
          Logout
     </Button>
     </div>
    </div>
   </div>
  )
}

export default Profile;