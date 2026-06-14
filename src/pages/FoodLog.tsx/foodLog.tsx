import { useAppContext } from "../../context/AppContext/useApp";
import React, { useEffect, useRef, useState } from "react";
import type { FoodEntry, FormData } from "../../types";
import Card from "../../components/ui/Card";
import { mealColors, mealIcons, mealTypeOptions, quickActivitiesFoodLog } from "../../assets/assets";
import Button from "../../components/ui/Button";
import { Loader2Icon, PlusIcon, SparkleIcon, Trash2Icon, UtensilsCrossedIcon } from "lucide-react";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import toast from "react-hot-toast";
import api from "../../configs/api";

const FoodLog = () => {

  const inputRef = useRef<HTMLInputElement>(null)
  const {allFoodLogs, setAllFoodLogs} = useAppContext()
  const [entries, setEntries] = useState<FoodEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({name: "", calories: 0, mealType: '' })

  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0)

  const today = new Date().toISOString().split("T")[0]

   function loadEntries(){
    const todayEntries = allFoodLogs.filter((food: FoodEntry) => 
     food.createdAt?.split('T')[0] === today)
    setEntries(todayEntries)
   }

   useEffect(() => {
    (() => {
      loadEntries()
    })()
   },[allFoodLogs])

   function handleQuickAdd(activityName: string) {
    setFormData({...formData, mealType: activityName})
    setShowForm(true)
   }

   async function handleSubmit(e: React.FormEvent) {
     e.preventDefault()

      if(!formData.name.trim() || !formData.calories || formData.calories <= 0
      || !formData.mealType) {
        return toast.error("por favor insira os dados")
      }

      try{
        const { data } = await api.post("/api/food-logs", {data: formData})
        setAllFoodLogs(prev => [...prev, data])
        setFormData({name: '', calories: 0, mealType: ''})
        setShowForm(false)

      }catch(error: any) {
        toast.error(error?.response?.data?.error?.message || error?.message)
      }
   }

   const groupeEntries: Record<'breakfast' | 'lunch' | 'dinner' | 'snack', FoodEntry[]> = entries.reduce((comida, entry) => {
     if(!comida[entry.mealType]) comida[entry.mealType] = [];

     comida[entry.mealType].push(entry)
     return comida
   }, {} as Record<'breakfast' | 'lunch' | 'dinner' | 'snack', FoodEntry[]>)


   async function handleDelete(documentId: string){
     try{
      const confirm = window.confirm('Tem certeza que quer deletar?')

      if(!confirm) return;

      await api.delete(`/api/food-logs/${documentId}`)
      setAllFoodLogs(prev => prev.filter((id) => id.documentId !== documentId))

     }catch(error: any) {
       console.log(error)
       toast.error(error?.response?.data?.error?.message || error?.message)
     }
   }

   

  return(
   <div className="page-container">
    <div className="page-header">
     <div className="flex items-center justify-between">
      <div>
       <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
         Food record
       </h1>
       <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
        Monitor your daily consumption
       </p>
      </div>

      <div className="text-right">
       <p className="text-sm text-slate-500 dark:text-slate-400">
        Today's total
       </p>
       <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
        {totalCalories} kcal
       </p>
      </div>
     </div>
    </div>

    <div className="page-content-grid">
     {!showForm && (
      <div className="space-y-4">
       <Card>
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">
         Quick addition
        </h3>
        <div className="flex flex-wrap gap-2">
          {quickActivitiesFoodLog.map((activity) => (
           <button onClick={() => handleQuickAdd(activity.name)} key={activity.name} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200
            dark:hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200">
             {activity.emoji} {activity.name}
           </button> 
          ))}
        </div>
       </Card>

       <Button className="w-full" onClick={() => setShowForm(true)}>
        <PlusIcon className="size-5"/>
         Add
       </Button>

        <Button className="w-full" onClick={() => {inputRef.current?.click()}}>
        <SparkleIcon className="size-5"/>
          AI
       </Button>
       <input type="file" accept="image/*" hidden ref={inputRef}/>
       {loading && (
        <div className="fixed inset-0 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur flex items-center justify-center z-100">
          <Loader2Icon className="size-8 text-emerald-600 dark:text-emerald-400 animate-spin"/>
        </div>
       )}
      </div>
     )}

     {showForm && (
      <Card className="border-2 border-emerald-200 dark:border-emerald-800">
       <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
         New food
       </h3>
       <form onSubmit={handleSubmit} className="space-y-4">
       <Input 
        label="Name"
        value={formData.name}
        onChange={(comida) => setFormData({...formData, name: comida.toString()})}
        placeholder="ex: salad, fish, chicken.."
        required
        />

        <Input 
        label="Calories"
        type="number"
        value={formData.calories || ''}
        onChange={(comida) => setFormData({...formData, calories: Number(comida)})}
        placeholder="ex: 350 kcal.."
        min={1}
        required
        />
         <Select 
         label="Tipe of meal"
         className="mt-2"
         value={formData.mealType}
         onChange={((comida) => setFormData({...formData, mealType: comida.toString()}))}
         options={mealTypeOptions}
         required
       />
        <div className="flex gap-3 pt-2">
         <Button onClick={() => {setShowForm(false); setFormData({
          name: '',
          calories: 0,
          mealType: ''
         })}} type="button" className="flex-1">
          Cancel
       </Button>

        <Button type="submit" className="flex-1">
         Add
        </Button>
       </div>
       </form>
      </Card>
     )}

     {entries.length === 0 ? (
       <Card className="text-center py-12">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
         <UtensilsCrossedIcon className="size-8 text-slate-400 dark:text-slate-500"/>
        </div>
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">
          No food recorded today
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
         Start tracking your meals to stay focused
        </p>
       </Card>
     ) : (
      <div className="space-y-4">
       {['breakfast', 'dinner', 'snack', 'lunch'].map((mealType) => {
        const mealTypeKey = mealType as keyof typeof groupeEntries;
        if(!groupeEntries[mealTypeKey]) return null;

        const MealIcon = mealIcons[mealTypeKey]
        const mealCalories = groupeEntries[mealTypeKey].reduce((sum, c) => sum + c.calories, 0)

        return(
         <Card key={mealType}>
         <div className="flex items-center justify-between mb-4">
         <div className="flex items-center gap-3">
         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mealColors[mealTypeKey]}`}>
          <MealIcon className="size-5"/>
         </div>

         <div>
          <h3 className="font-semibold text-slate-800 dark:text-white capitalize">
            {mealType}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {groupeEntries[mealTypeKey].length} items
          </p>
         </div>
         </div>
         <p className="font-semibold text-slate-700 dark:text-slate-200">
           {mealCalories} kcal
         </p>
         </div>

         <div>
           {groupeEntries[mealTypeKey].map((entry) => (
            <div key={entry.id} className="food-entry-item">
             <div className="flex-1">
              <p className="font-medium text-slate-700 dark:text-slate-200">
                {entry.name}
              </p>
              <p>{}</p>
             </div>

             <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {entry.calories} kcal
              </span>
              <button onClick={() => handleDelete(entry?.documentId || '')} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 
                rounded-lg ">
                <Trash2Icon className="w-4 h-4"/>
              </button>
             </div>
            </div>
           ))}
         </div>
         </Card>
        )
       })}
      </div>
     )}
    </div>
   </div>
  )
}

export default FoodLog
