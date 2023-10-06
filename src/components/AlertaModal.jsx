
const Alerta = ({alerta}) =>{

    return(
        <div className={`${alerta.error ?' bg-red-400   ' : 'bg-green-500'}  flex rounded-lg p-1 mb-2 text-sm role="alert" ' `}>
        <svg className="w-5 h-5 text-white inline mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
        <div>
            <h2 className=" text-white font-nunito text-base font-semibold"><span className="font-bold font-nunito"> </span> {alerta.msg} </h2>
        </div>
    </div>
    )
}
export default Alerta;