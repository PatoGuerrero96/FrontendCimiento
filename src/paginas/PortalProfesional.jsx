import { Link } from "react-router-dom"
const PortalProfesional = () => {
  return (
    <>

<div className="flex bg-white h-600" >
    <div className="flex items-center text-center lg:text-left px-8 md:px-12 lg:w-1/2">
        <div>
            <h2 className="text-3xl font-nunito font-semibold text-gray-800 md:text-4xl">Portal  <span className="text-blue-600">Profesionales</span></h2>
            <p className="mt-2 font-nunito text-sm text-gray-500 md:text-base">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis commodi cum cupiditate ducimus, fugit harum id necessitatibus odio quam quasi, quibusdam rem tempora voluptates. Cumque debitis dignissimos id quam vel!</p>
            <div className="flex justify-center lg:justify-start mt-6">
                <Link className="px-4 py-3 font-nunito bg-blue-500 text-gray-200 text-xs font-semibold rounded hover:bg-blue-800" to="/ingresa-profesional">Ingresar</Link>
                <Link className="mx-4 px-4 py-3 font-nunito bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400" to="/">Registrarse</Link>
            </div>
        </div>
    </div>
    <div className="hidden lg:block lg:w-1/2" >
        <div className=" object-cover" >
            <img id="pro" src="https://res.cloudinary.com/dde62spnz/image/upload/v1689082297/Imagenes%20sitio/s1_ahin2a.webp" alt="" />
            <div className="h-full bg-black opacity-25"></div>
        </div>
    </div>
</div>

    
<div className="flex min-h-screen items-center justify-center p-10 bg-blue-500">
  <div className="container grid max-w-screen-xl gap-8 lg:grid-cols-2 lg:grid-rows-2">
    <div className="row-span-2 flex flex-col rounded-md border border-slate-200">
      <div className="h-1/2 flex-1"><img src="https://res.cloudinary.com/dde62spnz/image/upload/v1689082345/Imagenes%20sitio/s3_tr7bc9.webp" className="w-full object-cover object-right-top" alt="omnichannel" /></div>
      <div className="p-10 bg-blue-100 ">
        <h3 className="text-xl font-medium text-gray-700">Omnichannel support center</h3>
        <p className="mt-2 text-slate-500">Chatwoot connects with popular customer communication channels like Email, Website live-chat, Facebook, Twitter, WhatsApp, Instagram, Line, etc., and helps you deliver a consistent customer experience across channels.</p>
     
      </div>
    </div>
    <div className="flex rounded-md border border-slate-200">
      <div className="flex-1 p-10 bg-blue-100">
        <h3 className="text-xl font-medium text-gray-700">A live-chat that fits your brand</h3>
        <p className="mt-2 text-slate-500">Connect with your website visitors, communicate with them in realtime and give them quality support with a live-chat widget that fits your brand.</p>
       
      </div>

      <div className="relative hidden h-full w-1/3 overflow-hidden lg:block">
        <div className="absolute inset-0">
          <img src="https://res.cloudinary.com/dde62spnz/image/upload/v1689082369/Imagenes%20sitio/s4_sq2yyf.webp" className="h-full w-full object-cover object-left-top" alt="" />
        </div>
      </div>
    </div>
    <div className="flex rounded-md border border-slate-200">
      <div className="flex-1 p-10 bg-blue-100">
        <h3 className="text-xl font-medium text-gray-700">Respond faster, with automated chatbots</h3>
        <p className="mt-2 text-slate-500">Integrate with chatbots using Rasa or Dialogflow to automate conversations. Qualify using chatbots and seamlessly handoff to human agents.</p>
        
      </div>

      <div className="relative hidden h-full w-1/3 overflow-hidden lg:block">
        <div className="absolute inset-0">
          <img src="https://res.cloudinary.com/dde62spnz/image/upload/v1689082403/Imagenes%20sitio/s5_um9lwc.jpg" className="h-full w-full object-cover object-left-top" alt="" />
        </div>
      </div>
    </div>
  </div>
</div>


<div
          className="container max-w-lg px-4 py-32 mx-auto text-left md:max-w-none md:text-center"
        >
          <h1
            className=" font-nunito text-5xl font-extrabold leading-10 tracking-tight text-left text-gray-900 md:text-center sm:leading-none md:text-6xl lg:text-7xl"
          >
            <span className=" font-nunito inline md:block">Registrate en </span>
            <span
              className=" font-nunito relative mt-2 text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-blue-500 md:inline-block"
              >El portal de profesionales</span>
          </h1>
          <div
            className="font-nunito mx-auto mt-5 text-gray-500 md:mt-12 md:max-w-lg md:text-center lg:text-lg"
          >
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.  orem ipsum dolor, sit amet consectetur adipisicing elit.  orem ipsum dolor, sit amet consectetur adipisicing elit. 
          </div>
          <div className="flex flex-col items-center mt-12 text-center">
            <span className="relative inline-flex w-full md:w-auto">
              <Link
                to="/"
                className=" font-nunito inline-flex items-center justify-center w-full px-8 py-4 text-base font-bold leading-6 text-white bg-blue-500 border border-transparent rounded-full md:w-auto hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
              >
                Registrarse
              </Link>

            </span>
          </div>
        </div>




    
    </>
  )
}

export default PortalProfesional