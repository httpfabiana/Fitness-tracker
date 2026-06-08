import { Activity, useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext/useApp";
import type { ActivityEntry } from "../../types";
import Card from "../../components/ui/Card";
import { quickActivities } from "../../assets/assets";
import { ActivityIcon, DumbbellIcon, PlusIcon, TimerIcon, Trash2Icon } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import mockApi from "../../assets/mockApi";



const ActivityLog = () => {

  const {allActivityLogs, setAllActivityLogs} = useAppContext();

  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({name: '', duration: 0, calories: 0})
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

   const totalMinutes: number = activities.reduce((sum, a) => sum + a. duration, 0)

    function loadActivities(){
      const todayActivities = allActivityLogs.filter((atividade: ActivityEntry) => 
       atividade.createdAt?.split('T')[0] === today)
      setActivities(todayActivities)
     }

     useEffect(() => {
      (() => {
        loadActivities()
      })()
     },[allActivityLogs])

     function handleQuickAdd(activity: {name: string, rate: number}) {
      setFormData({
       name: activity.name,
       duration: 30,
       calories: 30 * activity.rate
      })
      setShowForm(true)
     }

     async function handleSubmit(e: React.FormEvent){
       e.preventDefault()
       if(!formData.name.trim() || formData.duration <=0) {
        return toast("Insira os dados")
       }
       try{
        const {data} = await mockApi.activityLogs.create({data: formData})
        setAllActivityLogs(prev => [...prev, data])
        setFormData({name: '', duration: 0, calories: 0})
        setShowForm(false)
       }catch(error: any) {
        console.log(error)
        toast.error(error?.message || 'Falha ao enviar atividade')
       }
     }

     function handleDurationChange(valor: string | number) {
      const duration = Number(valor);

      const activity = quickActivities.find(atividade => atividade.name === formData.name)

      let calories = formData.calories
      if(activity){
        calories = duration * activity.rate
      }
       setFormData({...formData, duration, calories})
     }

       async function handleDelete(documentId: string){
          try{
           const confirm = window.confirm('Tem certeza que quer deletar?')
     
           if(!confirm) return;
     
           await mockApi.foodLogs.delete(documentId)
           setAllActivityLogs(prev => prev.filter((id) => id.documentId !== documentId))
     
          }catch(error: any) {
            console.log(error)
            toast.error(error?.message || 'Falha ao deletar')
          }
        }
 
  return(
    <div className="page-container">
      <div className="page-header">
      <div className="flex items-center justify-between">
      <div>
       <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
        Activity log
       </h1>
       <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
        Track your workouts
       </p>
      </div>

      <div className="text-right">
       <p className="text-sm text-slate-500 dark:text-slate-400">Ativo hoje</p>
       <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
        {totalMinutes} min
       </p>
      </div>
     </div>
    </div>

    <div className="page-content-grid">
     {!showForm && (
      <div className="space-y-4">
       <Card>
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">
         Add
        </h3>

        <div className="flex flex-wrap gap-2">
          {quickActivities.map((activity) => (
           <button onClick={() => handleQuickAdd(activity)} key={activity.name} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700
             rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors">
             {activity.emoji} {activity.name}
           </button>
          ))}
        </div>
       </Card>

       <Button onClick={() => setShowForm(true)} className="w-full">
        <PlusIcon className="size-5"/>
         Add activity
       </Button>
      </div>
     )}

     {showForm && (
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
          New activity
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
         <Input
          label="Nome da atividade"
          placeholder="ex: Correr"
          value={formData.name}
          onChange={(atividade) => setFormData({...formData, name: atividade.toString()})}
          required
         />
         <div className="flex gap-4">
          <Input
          label="duração"
          type="number"
          placeholder="ex: 30min"
          value={formData.duration || ''}
          min={1}
          max={300}
          onChange={handleDurationChange}
          required
         />

          <Input
          label="calorias queimadas"
          type="number"
          placeholder="ex: 200"
          value={formData.calories || ''}
          min={1}
          max={2000}
          onChange={(caloria)=> setFormData({...formData, calories: Number(caloria)})}
          required
         />
         </div>
         {error && <p className="text-red-500 text-sm">{error}</p>}

         <div className="flex gap-3 pt-2">
          <Button type="button" className="flex-1" onClick={() => {
            setShowForm(false)
            setError('')
            setFormData({name: '', duration: 0, calories: 0})
          }}>
            Cancel
          </Button>
           <Button type="submit" className="flex-1">
            Add
          </Button>
         </div>
        </form>
      </Card>
     )}

     {activities.length === 0 ? (
      <Card className="text-center py-12">
       <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
       <DumbbellIcon className="w-8 h-8 text-slate-400 dark:text-slate-500"/>
       </div>
       <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">
        No activity recorded today
       </h3>
       <p className="text-slate-500 dark:text-slate-400 text-sm">
        Start moving and track your progress
       </p>
      </Card>
     ) : (
      <Card>
       <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center">
         <ActivityIcon className="size-5 text-blue-600"/>
        </div>
          
        <div>
         <h3 className="font-semibold text-slate-800 dark:text-white">
           All activities
         </h3>
         <p>
          {activities.length} registered
         </p>
        </div>
       </div>

       <div className="space-y-2">
        {activities.map((activity) => (
         <div key={activity.id} className="activity-entry-item">
         <div className="flex items-center gap-3">
         <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <TimerIcon className="size-5 text-blue-500 dark:text-blue-400"/>
         </div>
         <div>
          <p className="font-medium text-slate-700 dark:text-slate-200">
           {activity.name}
           </p>
          <p>{new Date(activity?.createdAt || "").toLocaleTimeString('en-US',{hour: "2-digit", minute: "2-digit"})}</p>
         </div>
         </div>

         <div className="flex items-center gap-3">
          <div>
           <p className="font-semibold text-slate-700 dark:text-slate-200">
           {activity.duration} min
           </p>
           <p className="text-sm text-slate-400">
            {activity.calories} kcal
           </p>
          </div>
          <button onClick={() => handleDelete(activity.documentId)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20
           rounded-lg transition-colors">
            <Trash2Icon className="w-4 h-5"/>
          </button>
         </div>
         </div>
        ))}
       </div>
       <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between
        items-center">
        <span className="text-slate-500 dark:text-slate-400">
         Total time
        </span>
        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
          {totalMinutes} minutes
        </span>
       </div>
      </Card>
     )}
    </div>
  </div>
  )
}

export default ActivityLog;