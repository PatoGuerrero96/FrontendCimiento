import { Link } from "react-router-dom";

const FooterPublico = () =>{

    return(
        
        <footer className=" bg-lila-300 relative pt-8 pb-6">
  <div className="container mx-auto px-4">
    <div className="flex flex-wrap text-left lg:text-left">
      <div className="w-full lg:w-6/12 px-4">
        <h4 className="text-4xl font-nunito text-white font-regular">Cimiento Clínico</h4>
        <h5 className="text-lg mt-0 mb-2 font-nunito text-white font-regular">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        </h5>
        <div className="mt-6 lg:mb-0 mb-6">
          <button className="bg-white text-lightBlue-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" type="button">
            <i className="fab fa-twitter"></i></button><button className="bg-white text-lightBlue-600 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" type="button">
            <i className="fab fa-facebook"></i></button><button className="bg-white text-pink-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" type="button">
            <i className="fab fa-instagram"></i></button><button className="bg-white text-blueGray-800 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" type="button">
            <i className="fab fa-linkedin"></i>
          </button>
        </div>
      </div>
      <div className="w-full lg:w-6/12 px-4">
        <div className="flex flex-wrap items-top mb-6">
          <div className="w-full lg:w-4/12 px-4 ml-auto">
            <span className="block  text-white   text-sm font-semibold mb-2">Servicios</span>
            <ul className="list-unstyled">
              <li>
                <a className="block  text-white   text-sm font-semibold mb-2" href="#">Datos de seguridad</a>
              </li>
              <li>
                <a className="block  text-white   text-sm font-semibold mb-2" href="#">Contacto</a>
              </li>
            </ul>
          </div>
          <div className="w-full lg:w-4/12 px-4">
            <span className="block text-white   text-sm font-semibold mb-2">Preguntas frecuentes</span>
            <ul className="list-unstyled">
              <li>
                <Link to={"/ingresa-admin"} className="block  text-white   text-sm font-semibold mb-2" href="#">Administrador</Link>
              </li>
          
            </ul>
          </div>

        </div>
      </div>
    </div>
    <hr className="my-2 border-gray-50"/>
    <div className="flex flex-wrap items-center md:justify-between justify-center">
      <div className="w-full md:w-4/12 px-4 mx-auto text-center">
        <div className="text-sm text-white  font-regular font-semibold py-1">
        © Cimiento Clínico <span id="get-current-year">2023</span><a href="https://www.creative-tim.com/product/notus-js" className="text-blueGray-500 hover:text-gray-800" target="_blank"/> 
          <a href="#" className="text-blueGray-500 hover:text-blueGray-800"> Todos los derechos reservados </a>
        </div>
      </div>
    </div>
  </div>
</footer>



    )

}
export default FooterPublico;

