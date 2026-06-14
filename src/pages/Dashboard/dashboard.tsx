import { useAppContext } from "../../context/AppContext/useApp";
import { getMotivationalMessage } from "../../assets/assets";
import { useEffect, useState } from "react";
import type { ActivityEntry, FoodEntry } from "../../types";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";
import { ActivityIcon, FlameIcon, HamburgerIcon, Ruler, ScaleIcon, TrendingUpIcon, ZapIcon } from "lucide-react";

const Dashboard = () => {
  
  const {user, allActivityLogs, allFoodLogs} = useAppContext();
  const [todayFood, setTodayFood] = useState<FoodEntry[]>([])
  const [todayActivities, setTodayActivities] = useState<ActivityEntry[]>([])

  const DAILY_CALORIE_LIMIT: number = user?.dailyCalorieIntake || 2000;

  function loadUserData() {
    const dataDeHoje = new Date().toISOString().split('T')[0]

    const comidasDeHoje = allFoodLogs.filter((comida: FoodEntry) => {
      const dataComida = comida.createdAt?.split('T')[0]

      return dataComida === dataDeHoje
    })
    setTodayFood(comidasDeHoje)

    const atividadeDeHoje = allActivityLogs.filter((atividade: ActivityEntry) => {
      const dataAtividade = atividade.createdAt?.split('T')[0]

      return dataAtividade === dataDeHoje
    })
    setTodayActivities(atividadeDeHoje)
  }

  useEffect(() => {
    (() => {loadUserData()})()

  },[allActivityLogs, allFoodLogs])

   const totalCalories = todayFood.reduce((sum, item) => sum + item.calories, 0)

   const remainingCalories = DAILY_CALORIE_LIMIT - totalCalories;

   const totalActivityMinutes = todayActivities.reduce((sum, item) => sum + item.duration, 0);

   const totalBurn = todayActivities.reduce((sum, item) => sum + (item.calories || 0), 0)

     const motivition = getMotivationalMessage(totalCalories, totalActivityMinutes, DAILY_CALORIE_LIMIT, )

  return(
   <div className="page-container">
     <div className="dashboard-header">
      <p className="text-sm font-medium">
        Welcome back
      </p>
      <h1 className="text-2xl font-bold mt-1">{`Hi!👋${user?.username}`}</h1>

      <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
       <div className="flex items-center gap-3">
        <span className="text-3xl">{motivition.emoji}</span>
        <p className="text-white font-medium">{motivition.text}</p>
       </div>
      </div>
     </div>

     <div className="dashboard-grid">
      <Card className="shadow-lg col-span-2">
       <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
         <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
           <HamburgerIcon className="w-6 h-6 text-orange-500"/>
         </div>
         <div>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Calories consumed
           </p>
          <p className="text-2xl text-slate-800 dark:text-white">{totalCalories}</p>
         </div>
        </div>
        <div className="text-right">
         <p className="text-sm text-slate-500 dark:text-slate-400">
          Limit
         </p>
         <p className="text-2xl text-slate-800 dark:text-white">{DAILY_CALORIE_LIMIT}</p>
        </div>
       </div>
       <ProgressBar value={totalCalories} max={DAILY_CALORIE_LIMIT}/>

       <div className="mt-4 flex justify-between items-center">
        <div className={`px-3 py-1.5 rounded-lg ${remainingCalories >= 0 ? 
         'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400'  
          : 'bg-emerald-50 dark:bg-red-900/10 text-red-700 dark:text-red-400'
        }`}>
         <span className="text-sm">
          {remainingCalories >= 0 ? `${remainingCalories} kcal remainder` : 
           `${Math.abs(remainingCalories)} kcal over`}
         </span>
        </div>
        <span className="text-sm text-slate-400">
          {Math.round((totalCalories / DAILY_CALORIE_LIMIT) * 100)}%
         </span>
       </div>

       <div className="border-t border-slate-100 dark:border-slate-800 my-4"></div>

        <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
         <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
           <FlameIcon className="w-6 h-6 text-orange-500"/>
         </div>
         <div>
           <p className="text-sm text-slate-500 dark:text-slate-300">
            Calories burned
           </p>
          <p className="text-2xl text-slate-800 dark:text-white">
            {totalBurn}
           </p>
         </div>
        </div>
        <div className="text-right">
         <p className="text-sm text-slate-500 dark:text-slate-400">
          Goal
         </p>
         <p className="text-2xl text-slate-800 dark:text-white">
          {user?.dailyCalorieBurn || 400}
         </p>
        </div>
       </div>
       <ProgressBar value={totalBurn} max={user?.dailyCalorieBurn || 400}/>
      </Card>

      <div className="dashboard-card-grid">
       <Card>
        <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
         <ActivityIcon className="w-5 h-5 text-blue-500"/>
        </div>
        <p className="text-sm text-slate-500">
          Active
         </p>
        </div>
        <p className="text-2xl font-bold text-slate-800 dark:text-white">
          {totalActivityMinutes}
        </p>
        <p className="text-sm text-slate-400">
          toda's minutes
         </p>
       </Card>

        <Card>
        <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
         <ZapIcon className="w-5 h-5 text-purple-500"/>
        </div>
        <p className="text-sm text-slate-500">
         Training time
        </p>
        </div>
        <p className="text-2xl font-bold text-slate-800 dark:text-white">
          {totalActivityMinutes}
        </p>
        <p className="text-sm text-slate-400">
         minutes recorded
        </p>
       </Card>
      </div>

      {user && (
       <Card className="bg-linear-to-r from-slate-800 to-slate-700">
        <div className="flex items-center gap-4">
         <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
          <TrendingUpIcon className="w-6 h-6 text-emerald-400"/>
         </div>

         <div>
          <p className="text-slate-400 text-ssm">Your goals</p>
          <p className="text-white font-semibold capitalize">
            {user.goal === 'lose' && '🔥 lose weight'}
            {user.goal === 'maintain' && '⚖️ maintain weight'}
            {user.goal === 'gain' && '💪 gain muscle'}
          </p>
         </div>
        </div>
       </Card>
      )}

      {user && user.weight && (
       <Card>
        <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
         <ScaleIcon className="w-6 h-6 text-indigo-500"/>
        </div>

        <div>
         <h3 className="font-semibold text-slate-800 dark:text-white">
          Body metrics
         </h3>
         <p className="text-slate-500 text-sm">Your statistics</p>
        </div>
        </div>

        <div className="space-y-4">
        <div className="flex justify-between items-center">
         <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
          <ScaleIcon className="w-4 h-4 text-slate-500"/>
          </div> 
          <span className="text-sm text-slate-500 dark:text-slate-400">
            weight
          </span>
         </div>

         <span className="font-semibold text-slate-700 dark:text-slate-200">
          {user.weight}Kg
         </span>
        </div>

         {user.height && (
           <div className="flex justify-between items-center">
         <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
          <Ruler className="w-4 h-4 text-slate-500"/>
          </div> 
          <span className="text-sm text-slate-500 dark:text-slate-400">
            height
          </span>
         </div>

         <span className="font-semibold text-slate-700 dark:text-slate-200">
          {user.height}cm
         </span>
        </div>
         )}

         {user.height && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
           <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              IBM
            </span>
            {(() => {
              const bmi = (user.weight / Math.pow(user.height / 100, 2)).toFixed(1)
              const getStatus = (b: number) => {
               if(b < 18.5) return {
                color: 'text-blue-500', bg: 'bg-blue-500'
               };
               if(b < 25) return {
                color: 'text-emerald-500', bg: 'bg-emerald-500'
               };
               if(b < 30) return {
                color: 'text-orange-500', bg: 'bg-orange-500'
               };
               return {color: 'text-red-500', bg: 'bg-red-500'}
              }
              const status = getStatus(Number(bmi));
              return <span className={`text-lg font-bold ${status.color}`}>{bmi}</span>
            })()}
           </div>

           <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
           <div className="flex-1 bg-blue-400 opacity-30"></div>
           <div className="flex-1 bg-emerald-400 opacity-30"></div>
           <div className="flex-1 bg-orange-400 opacity-30"></div>
           <div className="flex-1 bg-red-400 opacity-30"></div>
           </div>

           <div className="flex justify-between mt-1 text-[14px] text-slate-400">
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
           </div>
          </div>
         )}
        </div>
       </Card>
      )}

      <Card>
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
          Today's summary
        </h3>
        <div className="space-y-3">
         <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
         <span className="text-slate-500 dark:text-slate-400">
          Recorded meals
        </span>
        <span className="font-medium text-slate-700 dark:text-slate-200">
          {todayFood.length}
        </span>
         </div>

         <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
         <span className="text-slate-500 dark:text-slate-400">
           Total de calories
         </span>
         <span className="font-medium text-slate-700 dark:text-slate-200">
          {totalCalories} kcal
        </span>
         </div>

         <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
         <span className="text-slate-500 dark:text-slate-400">
           Active time
         </span>
         <span className="font-medium text-slate-700 dark:text-slate-200">
          {totalActivityMinutes} min
        </span>
         </div>
        </div>
      </Card>
     </div>
    </div>
  )
}

export default Dashboard;