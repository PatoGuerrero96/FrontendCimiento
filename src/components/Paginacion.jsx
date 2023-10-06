import  {useState} from 'react';
import { MdKeyboardArrowLeft,MdKeyboardArrowRight} from "react-icons/md";
export const Paginacion = ({pagina, setPagina, maximo}) => {
  const [input, setInput] = useState (1);

  const nextPage = () => {
    setInput (parseInt(input) + 1);
    setPagina (parseInt(pagina) + 1);
  };

  const previousPage = () => {
    setInput (parseInt(input) - 1);
    setPagina (parseInt(pagina) - 1);
  };

  const onKeyDown = e => {
    if (e.keyCode == 13) {
      setPagina (parseInt (e.target.value));
      if (
        parseInt (e.target.value < 1) ||
        parseInt (e.target.value) > Math.ceil (maximo) ||
        isNaN (parseInt (e.target.value))
      ) {
        setPagina (1);
        setInput (1);
      } else {
        setPagina (parseInt (e.target.value));
      }
    }
  };

  const onChange = e => {
    setInput (e.target.value);
  };

  return (
    <>

<div className="flex justify-center mt-2">
  <nav aria-label="Page navigation example">
    <ul className="flex list-none">
      <li>
        <button
          disabled={pagina === 1 || pagina < 1}
          onClick={previousPage}
          className="block py-1.5 px-3 border-0 mr-2 text-gray-700 bg-white hover:bg-gray-100 rounded-full transition-all duration-300"
        >
        <MdKeyboardArrowLeft/>
        </button>
      </li>
      <li>
        <input
          className="w-12 px-2 py-1 text-center text-gray-700 border rounded-full"
          onChange={(e) => onChange(e)}
          onKeyDown={(e) => onKeyDown(e)}
          name="page"
          autoComplete="off"
          value={input}
        />
        <span className="mx-2 text-gray-400">/</span>
        <span className="px-2 py-1 text-gray-700 bg-gray-100 rounded-full">{maximo}</span>
      </li>
      <li>
        <button
          disabled={pagina === Math.ceil(maximo) || pagina > Math.ceil(maximo)}
          onClick={nextPage}
          className="block py-1.5 px-3 border-0 ml-2 text-gray-700 bg-white hover:bg-gray-100 rounded-full transition-all duration-300"
        >
        <MdKeyboardArrowRight/>
        </button>
      </li>
    </ul>
  </nav>
</div>
   </>
   
    
  );
};