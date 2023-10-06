
const NoEncontrado = () => {

    return(
<div id="primario"className="w-full h-screen flex flex-col items-center justify-center">

    <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold  font-nunito md:text-6xl lg:text-9xl text-white  mt-12">404</h1>
        <h2 className="text-3xl font-semibold  font-nunito md:text-4xl lg:text-5xl text-white mt-12">Página no encontrada</h2>
        <img  className="h-96" src="https://res.cloudinary.com/dde62spnz/image/upload/v1689081748/Imagenes%20sitio/404_xqupjl.png" alt="" />
        <p className="md:text-lg font-nunito  lg:text-xl text-white mt-8">Lo sentimos la página que busca no existe, porfavor regrese al inicio.</p>
        <a href="/" id="requisitos" className="flex items-center font-nunito space-x-2 text-white px-4 py-2 mt-12 rounded-xl transition duration-150" title="Return Home">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
            </svg>
            <span>Volver al inicio</span>
        </a>
    </div>
</div>
    );
    

    };

    export default NoEncontrado;